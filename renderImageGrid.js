function renderDynamicImageGrid(data, container, config) {
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
      grid-auto-flow: dense; /* Ensures best fit for varying image sizes */
      grid-auto-rows: auto; /* Allow rows to be dynamic */
      grid-auto-columns: auto; /* Allow columns to be dynamic */
      gap: 10px; /* Gap between images */
    }
    .grid-item {
      position: relative;
      display: block;
      overflow: hidden; /* Hide any overflow if needed */
    }
    .grid-item img {
      width: 100%; /* Image should fill the container horizontally */
      height: auto; /* Let height adjust dynamically based on aspect ratio */
    }
  `;
  document.head.appendChild(style);

  // Loop through the truncated data and add image elements to the grid container
  truncatedData.forEach((d, index) => {
    const imageURL = d[Object.keys(d)[0]].value;
    const imageAlt = d[Object.keys(d)[1]]?.label || 'Image';

    const imageContainer = gridContainer.append('div')
      .attr('class', 'grid-item');

    imageContainer.append('img')
      .attr('src', imageURL)
      .attr('alt', imageAlt);
  });
}

const vis = {
  id: 'dynamic-image-grid',
  label: 'Dynamic Image Grid',
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
      // Render the dynamic image grid
      renderDynamicImageGrid(data, container, config);
    } catch (error) {
      console.error('Error occurred during update:', error);
      element.innerHTML = '<div class="error-message">An error occurred while rendering the visualization.</div>';
    }
  },
};

looker.plugins.visualizations.add(vis);
