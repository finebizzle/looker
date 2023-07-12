function renderImageTable(data, container, config) {
  // Create a container for the image table
  const tableContainer = container.append('table')
    .style('border-collapse', 'collapse');

  // Extract the unique statement months from the data objects
  // const statementMonths = Array.from(new Set(data.map(d => d['content_partner.statement_month'].value)));

    const statementMonths = Array.from(new Set(data.map(d => d[Object.keys(d)[1]].value)));

  // Extract the unique rank_product_id values
  // const uniqueRankProductIds = Array.from(new Set(data.map(d => d['content_partner.rank_product_id'].value)));

  const uniqueRankProductIds = Array.from(new Set(data.map(d => d[Object.keys(d)[5]].value)));

  // Create the table header row
  const headerRow = tableContainer.append('tr');

  // Get the custom labels from the options
  const statementMonthLabel = config.statementMonthLabel || 'Dimension';
  const measureLabel1 = config.MeasureLabel || 'Measure';
  const measureLabel2 = config.MeasureLabel2 || '';

  // Add the statement month header
  headerRow.append('th')
    .text(statementMonthLabel)
    .style('background-color', config.headerColor)
    .style('color', config.headerFontColor)
    .style('font-size', config.fontSize)
    .style('font-family', config.fontFamily)
    .style('padding', config.headerPadding);

  // Add the image headers
  uniqueRankProductIds.forEach(rankProductId => {
    headerRow.append('th')
      .style('background-color', config.headerColor)
      .style('color', config.headerFontColor)
      .style('font-size', config.fontSize)
      .style('font-family', config.fontFamily)
      .style('padding', config.headerPadding)
      .text(rankProductId);
  });

  // Iterate over each statement month
  statementMonths.forEach(month => {
    // Filter the data for the current statement month
    // const monthData = data.filter(d => d['content_partner.statement_month'].value === month);
    const monthData = data.filter(d => d[Object.keys(d)[1]].value === month);
    // Create a table row for the current statement month
    const assetRow = tableContainer.append('tr');
    const row = tableContainer.append('tr')
      .style('border-top', '1px solid #ccc');
    const revenueRow = tableContainer.append('tr');
    // Add the statement month cell
    assetRow.append('td')
      .text(measureLabel2)
      .style('background-color', config.rowColor2)
      .style('color', config.headerFontColor)
      .style('font-size', config.fontSize)
      .style('font-family', config.fontFamily)
      .style('padding', config.headerPadding)
      .style('border-right', '1px solid #ccc');
    
    row.append('td')
      .text(month)
      .style('background-color', config.headerColor)
      .style('color', config.headerFontColor)
      .style('font-size', config.fontSize)
      .style('font-family', config.fontFamily)
      .style('padding', config.headerPadding)
      .style('border-right', '1px solid #ccc');
    revenueRow.append('td')
      .text(measureLabel1)
      .style('background-color', config.rowColor1)
      .style('color', config.headerFontColor)
      .style('font-size', config.fontSize)
      .style('font-family', config.fontFamily)
      .style('padding', config.headerPadding)
      .style('border-right', '1px solid #ccc');
    

    // Add the image cells for the current statement month
    uniqueRankProductIds.forEach(rankProductId => {
      const imageData = monthData.find(d => d[Object.keys(d)[5]].value === rankProductId);
      const imageUrl = imageData ? imageData[Object.keys(imageData)[2]].value  : '';
      const mediaType = imageData ? imageData[Object.keys(imageData)[3]].value : '';
      const revenue = imageData ? formatNumericValue(imageData[Object.keys(imageData)[4]].value, config.numericFormat) : '';
      const id = imageData ? imageData[Object.keys(imageData)[0]].value : '';
      assetRow.append('td')
        .style('background-color', config.rowColor2)
        .style('color', config.fontColor)
        .style('font-size', config.fontSize)
        .style('font-family', config.fontFamily)
        .style('padding', config.headerPadding)
        .text(id);

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

      revenueRow.append('td')
        .style('background-color', config.rowColor1)
        .style('color', config.fontColor)
        .style('font-size', config.fontSize)
        .style('font-family', config.fontFamily)
        .style('padding', config.headerPadding)
        .text(revenue);

     
    });
  });

  // Adjust the table cell borders
  tableContainer.selectAll('td, th')
    .style('border', '1px solid #ccc');
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
  id: 'image-table',
  label: 'Image Table',
  options: {
    fontFamily: {
      type: 'string',
      label: 'Font Family',
      default: 'Arial',
    },
    fontSize: {
      type: 'string',
      label: 'Font Size',
      default: '12px',
    },
    fontColor: {
      type: 'string',
      label: 'Font Color',
      default: '#000',
    },
    headerColor: {
      type: 'string',
      label: 'Header Color',
      default: '#ccc',
    },
    headerFontColor: {
      type: 'string',
      label: 'Header Font Color',
      default: '#000',
    },
    headerPadding: {
      type: 'string',
      label: 'Header Padding',
      default: '5px',
    },
    rowColor1: {
      type: 'string',
      label: 'Row Color 1',
      default: '#fff',
    },
    rowColor2: {
      type: 'string',
      label: 'Row Color 2',
      default: '#fff',
    },
    imageWidth: {
      type: 'string',
      label: 'Image Width',
      default: '90px',
    },
    imageHeight: {
      type: 'string',
      label: 'Image Height',
      default: '90px',
    },
    cellPadding: {
      type: 'string',
      label: 'Cell Padding',
      default: '5px',
    },
    statementMonthLabel: {
      type: 'string',
      label: 'Dimension',
      default: '',
    },
    MeasureLabel: {
      type: 'string',
      label: 'Measure 1',
      default: '',
    },
    MeasureLabel2: {
      type: 'string',
      label: 'Measure 2',
      default: '',
    },
    numericFormat: {
      type: 'string',
      label: 'Numeric Format',
      default: '',
    },
  },
  create(element, config) {
    element.innerHTML = '<div class="image-table"></div><div class="error-message" style="color: red; font-weight: bold;"></div>';
    return {};
  },
  update(data, element, config, context, queryResponse) {
    const tableContainer = element.querySelector('.image-table');
    const errorMessageElement = element.querySelector('.error-message');

    
    try {
      // Clear any previous error messages
      errorMessageElement.textContent = '';

      // Clear the table content
      tableContainer.innerHTML = '';
      

      // Render the image table
      renderImageTable(data, d3.select(tableContainer), config, queryResponse);
    } catch (error) {
      console.error('Error occurred during update:', error);
      errorMessageElement.textContent = 'This chart requires dimensions. Non unique Dimension,Image Url dimension,measures(must contain a rank measure) follow this same order, id,date,url,media_type,revenue,rank ';
    }
  },
};

looker.plugins.visualizations.add(vis);
