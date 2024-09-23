function renderImageGrid(data, container, queryResponse) {
  // Clear any existing content
  container.innerHTML = '';

  // Log data and queryResponse to inspect their structure
  console.log('Data:', data);
  console.log('Query Response:', queryResponse);

  // Check if queryResponse has fields and dimensions/measures, and log the structure for debugging
  const fields = queryResponse.fields || {};
  console.log('Fields:', fields);

  const dimensions = fields.dimension_like || [];
  const measures = fields.measure_like || [];

  // Safety check: Ensure there is at least one dimension and one measure
  if (dimensions.length === 0 || measures.length === 0) {
    console.error('No dimensions or measures found in the queryResponse');
    container.innerHTML = '<p>No data available to render</p>';
    return;
  }

  const dimension = dimensions[0].name;  // First dimension for image URL or ID
  const measure = measures[0].name;  // First measure for tooltip

  // Define the dimensions and properties of the image grid
  const imageWidth = 200;
  const imageHeight = 200;
  const imagesPerRow = 4;
  const spacing = 10;

  // Calculate the total number of rows based on the data length and images per row
  const numRows = Math.ceil(data.length / imagesPerRow);

  // Set up the grid container styles
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${imagesPerRow}, ${imageWidth}px)`;
  container.style.gridGap = `${spacing}px`;

  // Add image elements to the grid container
  data.forEach((item) => {
    // Dynamically access the dimension and measure from the data
    const imageUrl = item[dimension]?.value || 'https://via.placeholder.com/200';  // Fallback to placeholder
    const masterId = item[dimension]?.value || 'Unknown';
    const tooltip = item[measure]?.value || 'No data';  // Tooltip showing the measure value

    // Create the div for each image
    const imageDiv = document.createElement('div');
    imageDiv.style.width = `${imageWidth}px`;
    imageDiv.style.height = `${imageHeight}px`;
    imageDiv.style.backgroundColor = '#eee';
    imageDiv.style.backgroundSize = 'cover';
    imageDiv.style.backgroundPosition = 'center';
    imageDiv.style.backgroundImage = `url(${imageUrl})`;
    imageDiv.title = tooltip;  // Add tooltip (measure value)

    // Create a label div for the image name (dimension)
    const labelDiv = document.createElement('div');
    labelDiv.style.position = 'relative';
    labelDiv.style.bottom = '0';
    labelDiv.style.left = '0';
    labelDiv.style.right = '0';
    labelDiv.style.padding = '5px';
    labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    labelDiv.style.color = '#fff';
    labelDiv.style.textAlign = 'center';
    labelDiv.innerText = masterId;

    // Append the label to the image div
    imageDiv.appendChild(labelDiv);

    // Append the image div to the container
    container.appendChild(imageDiv);
  });

  // Adjust the grid container height based on the number of rows
  const gridHeight = numRows * (imageHeight + 2 * spacing);
  container.style.height = `${gridHeight}px`;
}

const vis = {
  id: 'image-grid',
  label: 'Image Grid',
  options: {},
  create(element, config) {
    element.innerHTML = '<div class="image-grid"></div>';
    return {};
  },
  update(data, element, config, context, queryResponse) {
    // Log data and queryResponse to debug their structure
    console.log('Data:', data);
    console.log('QueryResponse:', queryResponse);

    const container = element.querySelector('.image-grid');
    renderImageGrid(data, container, queryResponse);
  },
};

looker.plugins.visualizations.add(vis);
