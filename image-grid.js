const vis = {
  id: 'ImageDisplayGrid',
  label: 'DisplayGrid',
  options: {},

  // The create function sets up the DOM for the visualization
  create: function (element, config) {
    // Create the container for the image grid
    element.innerHTML = '<div class="image-grid" style="display: grid;"></div>';
  },

  // The update function is called when the visualization is rendered or updated
  update: function (data, element, config, context) {
    const container = element.querySelector('.image-grid');
    container.innerHTML = ''; // Clear the grid before rendering new content

    // Call the function to render the image grid with the data
    renderImageGrid(data, container);
  }
};

// Function to render the image grid using Vanilla JavaScript
function renderImageGrid(data, container) {
  // Define the dimensions and properties of the image grid
  const imageWidth = 100;
  const imageHeight = 100;
  const imagesPerRow = 20; // 20 images per row to fit 500 total images
  const spacing = 10;
  const maxImages = 500; // Limit to display 500 images

  // Slice the data to show only the first 500 images
  const truncatedData = data.slice(0, maxImages);

  // Set the grid container styles
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${imagesPerRow}, ${imageWidth}px)`;
  container.style.gridGap = `${spacing}px`;
  container.style.width = 'fit-content';
  container.style.margin = 'auto';

  // Loop through each data item to create the image divs
  truncatedData.forEach(item => {
    // Create the div to hold the image
    const imageDiv = document.createElement('div');
    imageDiv.style.width = `${imageWidth}px`;
    imageDiv.style.height = `${imageHeight}px`;
    imageDiv.style.position = 'relative'; // Enable relative positioning for the label
    imageDiv.style.backgroundColor = '#eee';
    imageDiv.style.backgroundSize = 'cover';
    imageDiv.style.backgroundPosition = 'center';
    imageDiv.style.backgroundImage = `url(${item.image_url})`;

    // Create the label div for the image
    const labelDiv = document.createElement('div');
    labelDiv.style.position = 'absolute';
    labelDiv.style.bottom = '0';
    labelDiv.style.left = '0';
    labelDiv.style.right = '0';
    labelDiv.style.padding = '5px';
    labelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent background for the label
    labelDiv.style.color = '#fff'; // White text
    labelDiv.style.textAlign = 'center'; // Center the label text
    labelDiv.textContent = item.master_id; // Use master_id as the label text

    // Append the label div to the image div
    imageDiv.appendChild(labelDiv);

    // Append the image div to the container
    container.appendChild(imageDiv);
  });
}

// Register the visualization with Looker
looker.plugins.visualizations.add(vis);
