function renderNonUniformImageGrid(data, container, config) {
  const maxImages = config.maxImages || 500; // Maximum number of images to display

  // Filter and truncate data to include only valid images
  const truncatedData = data
    .filter(d => d[Object.keys(d)[0]] && d[Object.keys(d)[0]].value)
    .slice(0, maxImages);

  // Create a container for the image grid with CSS Grid layout
  const gridContainer = container.append('div')
    .attr('class', 'grid-container');

  // Add CSS styles for the grid and images
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    .grid-container {
      display: grid;
      grid-template-columns: repeat(5, 1fr); /* Adjust columns as needed */
      grid-auto-rows: 100px; /* Base row height */
      gap: 15px; /* Gap between images */
    }
    .grid-item {
      position: relative;
      width: 100%;  /* Make sure it fits the full grid width */
      height: 100%; /* Make sure it fits the full grid height */
      overflow: hidden; /* Hide any overflow */
      background-color: #f0f0f0; /* Optional background for empty space */
    }
    .grid-item img {
      width: 100%;  /* Force the image to take full width of the container */
      height: 100%; /* Force the image to take full height of the container */
      object-fit: cover; /* Fit the full image while maintaining aspect ratio */
    }
  `;
  document.head.appendChild(style);

  // Predefined grid spans for non-uniform layout (similar to your image)
  const predefinedGridSpans = [
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
  ];

  // Loop through the truncated data and add image elements to the grid container
  truncatedData.forEach((d, index) => {
    const imageURL = d[Object.keys(d)[0]].value;
    const imageAlt = d[Object.keys(d)[1]]?.label || 'Image';
    const gridSpan = predefinedGridSpans[index % predefinedGridSpans.length]; // Cycle through predefined spans

    const imageContainer = gridContainer.append('div')
      .attr('class', 'grid-item')
      .style('grid-column', `span ${gridSpan.colSpan}`)
      .style('grid-row', `span ${gridSpan.rowSpan}`);

    imageContainer.append('img')
      .attr('src', imageURL)
      .attr('alt', imageAlt);
  });
}

const vis = {
  id: 'non-uniform-image-grid',
  label: 'Non-Uniform Image Grid',
  options: {
    maxImages: {
      label: 'Max Images',
      default: 500,
      type: 'number',
      display: 'text',
      section: 'Data',
      placeholder: 'Enter the maximum number of images to display',
    },
  },
  create(element, config) {
    element.innerHTML = '<div class="image-grid"></div>';
  },
  update(data, element, config, context) {
    const container = d3.select(element).select('.image-grid');
    container.selectAll('*').remove(); // Clear previous content

    try {
      // Render the non-uniform image grid
      renderNonUniformImageGrid(data, container, config);
    } catch (error) {
      console.error('Error occurred during update:', error);
      element.innerHTML = '<div class="error-message">An error occurred while rendering the visualization.</div>';
    }
  },
};

looker.plugins.visualizations.add(vis);
