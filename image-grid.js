function renderImageGrid(data, container, config) {
  // Define the dimensions and properties of the image grid
  const imageWidth = 90;
  const imageHeight = 90;
  const imagesPerRow = 20;
  const spacing = 10;
  const maxImages = config.maxImages || 500; // Maximum number of images to display

  // Take the first `maxImages` elements from the data array that have images
  const truncatedData = data.filter(d => d[Object.keys(d)[2]] && d[Object.keys(d)[2]].value).slice(0, maxImages);

  // Calculate the total number of rows based on the truncated data length and images per row
  const numRows = Math.ceil(truncatedData.length / imagesPerRow);

  // Calculate the number of images to display in the last row
  const imagesInLastRow = truncatedData.length % imagesPerRow || imagesPerRow;

  // Create a container for the image grid
  const gridContainer = container.append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap');

  // Loop through the truncated data and add image elements to the grid container
  truncatedData.forEach((d, index) => {
    const imageURL = d[Object.keys(d)[0]].value;

    const imageContainer = gridContainer.append('div')
      .style('width', `${imageWidth}px`)
      .style('height', `${imageHeight}px`)
      .style('margin', `${spacing}px`)
      .style('background-color', '#eee')
      .style('background-size', 'cover')
      .style('background-position', 'center')
      .style('background-image', `url(${imageURL})`);

  
  });

  // Adjust the grid container height based on the number of rows
  const gridHeight = numRows * (imageHeight + 2 * spacing);
  gridContainer.style('height', `${gridHeight}px`);
}

const vis = {
  id: 'image-grid',
  label: 'Image Grid',
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
    return {};
  },
  update(data, element, config, context) {
    // Render the image grid
    const container = d3.select(element).select('.image-grid');
    const errorMessageElement = element.querySelector('.error-message');
    renderImageGrid(data, container, config);

    try {
      // Clear any previous error messages
      errorMessageElement.textContent = '';

      // Clear the table content
      tableContainer.innerHTML = '';

      // Render the image table
      renderImageTable(data, d3.select(tableContainer), config, queryResponse);
    } catch (error) {
      console.error('Error occurred during update:', error);
      errorMessageElement.textContent = 'This chart requires 1 Image dimension and 1 Measure, Move the order of dimension and measure to display chart. ';
    }
  },
};

looker.plugins.visualizations.add(vis);

