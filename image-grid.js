function renderImageGrid(data, container, config) {
  // Define the dimensions and properties of the image grid
  const imageWidth = 90;
  const imageHeight = 90;
  const imagesPerRow = 20;
  const spacing = 10;
  const maxImages = config.maxImages || 500; // Maximum number of images to display

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

  // ... (existing code)
}

const vis = {
  // ... (existing code)

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

    // Remove empty elements from the last row
    const lastRow = container.select(':nth-child(' + numRows + ')');
    lastRow.selectAll('div').each(function(d, i) {
      if (i >= imagesInLastRow) {
        d3.select(this).remove();
      }
    });
  },
};

looker.plugins.visualizations.add(vis);
