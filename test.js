function renderImageGrid(data, container) {
  // Clear any existing content
  container.innerHTML = '';

  // Log data to inspect its structure
  console.log('Data:', data);

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
  data.forEach((item, index) => {
    // Access fields by position in the `item` object (based on the data structure)
    const imageUrl = item[Object.keys(item)[0]]?.value || 'https://via.placeholder.com/200';  // Assume first field is the image URL
    const masterId = item[Object.keys(item)[1]]?.value || 'Unknown';  // Assume second field is the ID
    const tooltip = item[Object.keys(item)[2]]?.value || 'No data';  // Assume third field is the tooltip/measure

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
  update(data, element, config, context) {
    // Log data to debug its structure
    console.log('Data:', data);

    const container = element.querySelector('.image-grid');
    renderImageGrid(data, container);
  },
};

looker.plugins.visualizations.add(vis);
