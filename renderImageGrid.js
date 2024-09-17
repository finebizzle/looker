function renderCustomImageGrid(data, container, config) {
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
      grid-template-columns: repeat(4, 1fr); /* Four columns in the grid */
      grid-auto-rows: 200px; /* Base row height */
      gap: 10px; /* Gap between images */
    }
    .grid-item {
      position: relative;
      overflow: hidden; /* Hide any overflow if needed */
    }
    .grid-item img {
      width: 100%; /* Image should fill the container horizontally */
      height: 100%; /* Image should fill the container vertically */
      object-fit: cover; /* Cover the container without distortion */
    }
  `;
  document.head.appendChild(style);

  // Predefined grid spans for a custom layout (similar to the one in your image)
  const predefinedGridSpans = [
    { colSpan: 2, rowSpan: 2 },  // First image
    { colSpan: 1, rowSpan: 1 },  // Second image
    { colSpan: 1, rowSpan: 1 },  // Third image
    { colSpan: 1, rowSpan: 2 },  // Fourth image (taller)
    { colSpan: 1, rowSpan: 1 },  // Fifth image
    { colSpan: 2, rowSpan: 1 },  // Sixth image (wider)
    { colSpan: 1, rowSpan: 1 },  // Seventh image
    { colSpan: 1, rowSpan: 1 },  // Eighth image
    { colSpan: 2, rowSpan: 1 },  // Ninth image (wider)
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
  id: 'custom-image-grid',
  label: 'Custom Image Grid',
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
      // Render the custom image grid
      renderCustomImageGrid(data, container, config);
    } catch (error) {
      console.error('Error occurred during update:', error);
      element.innerHTML = '<div class="error-message">An error occurred while rendering the visualization.</div>';
    }
  },
};

looker.plugins.visualizations.add(vis);
