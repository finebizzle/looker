function renderImageGrid(data, container) {
  // Define the dimensions and properties of the image grid
  const imageWidth = 90;
  const imageHeight = 90;
  const imagesPerRow = 20;
  const spacing = 10;

  // Calculate the total number of rows based on the data length and images per row
  const numRows = Math.ceil(data.length / imagesPerRow);

  // Create a container for the image grid
  const gridContainer = container.append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap');

  // Add image elements to the grid container
  const images = gridContainer.selectAll('.image')
    .data(data)
    .enter()
    .append('div')
    .style('width', `${imageWidth}px`)
    .style('height', `${imageHeight}px`)
    .style('margin', `${spacing}px`)
    .style('background-color', '#eee')
    .style('background-size', 'cover')
    .style('background-position', 'center')
    .style('background-image', d => `url(${d[Object.keys(d)[2]].value})`);

  // Add image names as labels at the bottom of each cell
  images.append('div')
    .style('bottom', '0')
    .style('left', '0')
    .style('right', '0')
    .style('padding', '5px')
    .style('background-color', 'rgba(0, 0, 0, 0.7)')
    .style('color', '#fff')
    .style('text-align', 'center')
    .text(d => '$' + d[Object.keys(d)[3]].value.toFixed(2));

  // Adjust the grid container height based on the number of rows
  const gridHeight = numRows * (imageHeight + 2 * spacing);
  gridContainer.style('height', `${gridHeight}px`);
}



const vis = {
  id: 'image-grid',
  label: 'Image Grid',
  options: {},
  create(element, config) {
    element.innerHTML = '<div class="image-grid"></div>';
    return {};
  },
  update(data, element, config, context) {
    // Render the image grid
    const container = d3.select(element).select('.image-grid');
    const errorMessageElement = element.querySelector('.error-message');
    renderImageGrid(data, container);

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
