function renderImageGrid(data, container, config) {
  // Define the dimensions and properties of the image grid
  const imageWidth = 90;
  const imageHeight = 90;
  const imagesPerRow = 20;
  const spacing = 10;
  const maxImages = config.maxImages || 500; // Maximum number of images to display
  // Take the first `maxImages` elements from the data array that have images
  const truncatedData = data.filter(d => d[Object.keys(d)[2]] && d[Object.keys(d)[2]].value).slice(0, maxImages);
  // Calculate the total number of rows based on the truncated data length and images per row
  const numRows = Math.ceil(truncatedData.length / imagesPerRow);
  // Calculate the number of images to display in the last row
  const imagesInLastRow = truncatedData.length % imagesPerRow || imagesPerRow;
  // Create a container for the image grid
  const gridContainer = container.append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap');
  // Loop through the truncated data and add image elements to the grid container
  truncatedData.forEach((d, index) => {
    const imageURL = d[Object.keys(d)[0]].value;
    const imageAlt = d[Object.keys(d)[1]].label || 'Image'; // Use image label as alt text
    const imageContainer = gridContainer.append('div')
      .style('width', `${imageWidth}px`)
      .style('height', `${imageHeight}px`)
      .style('margin', `${spacing}px`)
      .style('background-color', '#eee')
      .style('background-size', 'cover')
      .style('background-position', 'center')
      .style('background-image', `url(${imageURL})`)
      ;
      .style('background-image', `url(${imageURL})`);

    // Add the alt attribute to the image container
    imageContainer.append('img')
      .attr('alt', 'pulled ' + imageAlt);
    // Add overlay text to the image container
    imageContainer.append('div')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('background-color', 'rgba(0, 0, 0, 0.5)') // Overlay background color
      .style('color', '#000')
      .style('font-size', '14px')
      .style('text-align', 'center')
      .text(imageAlt); // Set the overlay text

  });
