function renderImageTable(data, container) {
  // Create a container for the image table
  const tableContainer = container.append('table')
    .style('border-collapse', 'collapse');

  // Extract the unique statement months from the data objects
  const statementMonths = Array.from(new Set(data.map(d => d['content_partner.statement_month'].value)));

  // Extract the unique rank_product_id values
  const uniqueRankProductIds = Array.from(new Set(data.map(d => d['content_partner.rank_product_id'].value)));

  // Create the table header row
  const headerRow = tableContainer.append('tr');

  // Add the statement month header
  headerRow.append('th')
    .text('Statement Month');

  // Add the image headers
  uniqueRankProductIds.forEach(rankProductId => {
    headerRow.append('th')
      .text(rankProductId);
  });

  
  // Iterate over each statement month
  statementMonths.forEach(month => {
    // Filter the data for the current statement month
    const monthData = data.filter(d => d['content_partner.statement_month'].value === month);
    // Create a table row for the current statement month
    const row = tableContainer.append('tr')
      .style('border-top', '1px solid #ccc');
    const revenueRow = tableContainer.append('tr');
    const assetRow = tableContainer.append('tr');
    // Add the statement month cell
    row.append('td')
      .text(month)
      .style('border-right', '1px solid #ccc');
    revenueRow.append('td')
      .text("revenue")
      .style('border-right', '1px solid #ccc');
    assetRow.append('td')
      .style('border-right', '1px solid #ccc');

    // Add the image cells for the current statement month
    uniqueRankProductIds.forEach(rankProductId => {
      const imageData = monthData.find(d => d['content_partner.rank_product_id'].value === rankProductId);
      const imageUrl = imageData ? imageData['content_partner.image_url'].value : '';
      const revenue = imageData ? imageData['content_partner.revenue'].value : '';
      const id = imageData ? imageData['content_partner.master_id'].value : '';


      row.append('td')
        .style('padding', '5px')
        .append('img')
        .style('width', '90px')
        .style('height', '90px')
        .attr('src', imageUrl)
        .attr('alt', rankProductId);

      revenueRow.append('td')
         .text(revenue);

      assetRow.append('td')
         .text(id);
    });
  });

  // Adjust the table cell borders
  tableContainer.selectAll('td, th')
    .style('border', '1px solid #ccc');
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
    cellPadding: {
      type: 'string',
      label: 'Cell Padding',
      default: '5px',
    },
    rowColor1: {
      type: 'string',
      label: 'Row Color 1',
      default: '#f2f2f2',
    },
    rowColor2: {
      type: 'string',
      label: 'Row Color 2',
      default: '#fff',
    },
  },
  create(element, config) {
    element.innerHTML = '<div class="image-table"></div><div class="error-message" style="color: red; font-weight: bold;"></div>';
    return {};
  },
  update(data, element, config, context) {
    const tableContainer = element.querySelector('.image-table');
    const errorMessageElement = element.querySelector('.error-message');

    try {
      // Clear any previous error messages
      errorMessageElement.textContent = '';

      // Clear the table content
      tableContainer.innerHTML = '';

      // Render the image table
      renderImageTable(data, d3.select(tableContainer));
    } catch (error) {
      console.error('Error occurred during update:', error);
      errorMessageElement.textContent = 'An error occurred during update.';
    }
  },
};

looker.plugins.visualizations.add(vis);
