function renderImageTable(data, container, config) {
  // ... (previous code)

  // Add the image cells for the current statement month
  uniqueRankProductIds.forEach(rankProductId => {
    const imageData = monthData.find(d => d[Object.keys(d)[5]].value === rankProductId);
    const imageUrl = imageData ? imageData[Object.keys(imageData)[2]].value  : ''; // Use the retrieved dimension name
    const mediaType = imageData ? imageData[config.queryResponse.fields.measure_like[0].name] : ''; // Use the retrieved measure name
    const revenue = imageData ? formatNumericValue(imageData[Object.keys(imageData)[4]].value, config.numericFormat) : '';
    const id = imageData ? imageData[config.queryResponse.fields.dimension_like[0].name] : '';

    assetRow.append('td')
      .style('background-color', config.rowColor2)
      .style('color', config.fontColor)
      .style('font-size', config.fontSize)
      .style('font-family', config.fontFamily)
      .style('padding', config.headerPadding)
      .text(id);

    if (imageUrl) {
      const mediaCell = row.append('td').style('padding', '5px');
      if (mediaType !== 'VIDEO') {
        mediaCell.append('img')
          .style('width', config.imageWidth)
          .style('height', '90px')
          .attr('src', imageUrl)
          .attr('alt', 'Pulled');
      } else if (mediaType === 'VIDEO') {
        mediaCell.append('video')
          .style('width', '100px')
          .style('height', config.imageWidth)
          .attr('src', imageUrl)
          .attr('alt', 'Pulled');
      }
    }

    revenueRow.append('td')
      .style('background-color', config.rowColor1)
      .style('color', config.fontColor)
      .style('font-size', config.fontSize)
      .style('font-family', config.fontFamily)
      .style('padding', config.headerPadding)
      .text(revenue);
  });

  // ... (remaining code)
}

function formatNumericValue(value, format) {
  // Check if a format is specified
  if (format && format.length > 0) {
    // Format the value using the specified format
    return d3.format(format)(value);
  }

  // No format specified, return the value as is
  return value;
}

const vis = {
  // ... (rest of your code)

  update(data, element, config, context) {
    const tableContainer = element.querySelector('.image-table');
    const errorMessageElement = element.querySelector('.error-message');

    try {
      // Clear any previous error messages
      errorMessageElement.textContent = '';

      // Clear the table content
      tableContainer.innerHTML = '';

      // Extract the dimension and measure names from the queryResponse
      const dimensionName = config.queryResponse.fields.dimension_like[0].name;
      const measureName = config.queryResponse.fields.measure_like[0].name;

      // Update the code to use the retrieved dimension and measure names
      // Add the image cells for the current statement month
      uniqueRankProductIds.forEach(rankProductId => {
        const imageData = monthData.find(d => d[Object.keys(d)[5]].value === rankProductId);
        const imageUrl = imageData ? imageData[Object.keys(imageData)[2]].value : ''; // Use the retrieved dimension name
        const mediaType = imageData ? imageData[measureName] : ''; // Use the retrieved measure name
        const revenue = imageData ? formatNumericValue(imageData[Object.keys(imageData)[4]].value, config.numericFormat) : '';
        const id = imageData ? imageData[dimensionName] : '';

        // Rest of the code remains the same
        // ...

      });

      // Call the renderImageTable function with the correct arguments
      renderImageTable(data, d3.select(tableContainer), config);
    } catch (error) {
      console.error('Error occurred during update:', error);
      errorMessageElement.textContent = 'This chart requires dimensions. Non unique Dimension,Image Url dimension,measures(must contain a rank measure) follow this same order, id,date,url,media_type,dynamic_measure,rank';
    }
  },
};

looker.plugins.visualizations.add(vis);
