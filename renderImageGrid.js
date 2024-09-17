function renderImageGrid(data, container, config) {
  // Define dimensions and layout specifics based on your image layout
  const largeImageWidth = 250;
  const largeImageHeight = 350;
  const smallImageWidth = 180;
  const smallImageHeight = 120;
  const spacing = 10;

  // Create a container for the grid
  const gridContainer = container.append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('justify-content', 'space-between');

  // Example layout: one big image, a set of smaller images, and a title area
  const largeImage = data[0]; // Assuming the first image is the large one in the middle

  // Create a large image block (like the central player image in your screenshot)
  const largeImageContainer = gridContainer.append('div')
    .style('width', `${largeImageWidth}px`)
    .style('height', `${largeImageHeight}px`)
    .style('background-color', '#eee')
    .style('background-size', 'cover')
    .style('background-position', 'center')
    .style('margin', `${spacing}px`)
    .style('background-image', `url(${largeImage.url})`);

  // Loop through the remaining data to create smaller images (like in the screenshot)
  data.slice(1).forEach((d, index) => {
    const imageContainer = gridContainer.append('div')
      .style('width', `${smallImageWidth}px`)
      .style('height', `${smallImageHeight}px`)
      .style('background-color', '#eee')
      .style('background-size', 'cover')
      .style('background-position', 'center')
      .style('margin', `${spacing}px`)
      .style('background-image', `url(${d.url})`);
  });

  // Adjust the container height and width dynamically based on content
  const containerWidth = (largeImageWidth + (smallImageWidth * 4) + (spacing * 6));
  const containerHeight = largeImageHeight + (smallImageHeight * 2) + (spacing * 3);
  gridContainer.style('width', `${containerWidth}px`)
    .style('height', `${containerHeight}px`);
}

const vis = {
  id: 'image-grid',
  label: 'Image Grid',
  options: {
    maxImages: {
      label: 'Max Images',
      default: 10,
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

      // Additional content or functionality could be inserted here if needed
    } catch (error) {
      console.error('Error occurred during update:', error);
      errorMessageElement.textContent = 'This chart requires specific dimensions and measures to work.';
    }
  },
};

looker.plugins.visualizations.add(vis);
