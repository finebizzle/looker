function renderImageGrid(data, container) {
  // Clear any existing content
  container.innerHTML = '';

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
    // Create the div for each image
    const imageDiv = document.createElement('div');
    imageDiv.style.width = `${imageWidth}px`;
    imageDiv.style.height = `${imageHeight}px`;
    imageDiv.style.backgroundColor = '#eee';
    imageDiv.style.backgroundSize = 'cover';
    imageDiv.style.backgroundPosition = 'center';
    imageDiv.style.backgroundImage = `url(${item.image_url})`;

    // Create a label div for the image name
    const labelDiv = document.createElement('div');
    labelDiv.style.position = 'relative';
    labelDiv.style.bottom = '0';
    labelDiv.style.left = '0';
    labelDiv.style.right = '0';
    labelDiv.style.padding = '5px';
    labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    labelDiv.style.color = '#fff';
    labelDiv.style.textAlign = 'center';
    labelDiv.innerText = item.master_id;

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
    const container = element.querySelector('.image-grid');
    renderImageGrid(data, container);
  },
};

looker.plugins.visualizations.add(vis);
