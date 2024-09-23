looker.plugins.visualizations.add({
  id: "image_grid", // A unique ID for your visualization
  label: "Image Grid", // Label for the visualization
  options: {
    maxImages: {
      type: "number",
      label: "Maximum Number of Images",
      default: 500
    }
  },

  // The create function is where the DOM for the visualization will be built
  create: function(element, config) {
    this.container = d3.select(element);
  },

  // The update function is called when data or settings change
  update: function(data, element, config, queryResponse) {
    // Clear the container for new content
    this.container.html('');

    // Render the image grid by calling the previously defined function
    renderImageGrid(data, this.container, config);
  }
});

// The renderImageGrid function, as defined earlier
function renderImageGrid(data, container, config) {
  // Define the dimensions and properties of the image grid
  const imageWidth = 90;
  const imageHeight = 90;
  const imagesPerRow = 20;
  const spacing = 10;
  const maxImages = config.maxImages || 500; // Maximum number of images to display

  // Take the first `maxImages` elements from the data array that have images
  const truncatedData = data.filter(d => d[Object.keys(d)[2]] && d[Object.keys(d)[2]].value).slice(0, maxImages);

  // Create a container for the image grid with a CSS grid layout
  const gridContainer = container.append('div')
    .style('display', 'grid')
    .style('grid-template-columns', `repeat(${imagesPerRow}, ${imageWidth}px)`)
    .style('grid-gap', `${spacing}px`)
    .style('width', 'fit-content')
    .style('margin', 'auto');

  // Loop through the truncated data and add image elements to the grid container
  truncatedData.forEach((d, index) => {
    const imageURL = d[Object.keys(d)[0]].value;
    const imageAlt = d[Object.keys(d)[1]].label || 'Image'; // Use image label as alt text

    const imageContainer = gridContainer.append('div')
      .style('width', `${imageWidth}px`)
      .style('height', `${imageHeight}px`)
      .style('position', 'relative')
      .style('background-color', '#eee')
      .style('background-size', 'cover')
      .style('background-position', 'center')
      .style('background-image', `url(${imageURL})`);

    // Add the alt attribute to the image container
    imageContainer.append('img')
      .attr('alt', imageAlt)
      .style('display', 'none'); // Hide the image tag itself since it's being used as a background image

    // Add overlay text to the image container
    const overlayText = imageContainer.append('div')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('background-color', 'rgba(0, 0, 0, 0.5)') // Overlay background color
      .style('color', '#fff')
      .style('font-size', '14px')
      .style('text-align', 'center')
      .text(imageAlt); // Set the overlay text
  });
}
