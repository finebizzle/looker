// Ensure D3.js is available before running this script
function renderImageGrid(data, container) {
  const imageWidth = 100;
  const imageHeight = 100;
  const imagesPerRow = 20;
  const spacing = 10;
  const maxImages = 500;

  // Take the first `maxImages` elements from the data array
  const truncatedData = data.slice(0, maxImages);

  // Create a container for the image grid with a CSS grid layout
  const gridContainer = container.append('div')
    .style('display', 'grid')
    .style('grid-template-columns', `repeat(${imagesPerRow}, ${imageWidth}px)`)
    .style('grid-gap', `${spacing}px`)
    .style('width', 'fit-content')
    .style('margin', 'auto');

  // Add image elements to the grid container
  const images = gridContainer.selectAll('.image')
    .data(truncatedData)
    .enter()
    .append('div')
    .style('width', `${imageWidth}px`)
    .style('height', `${imageHeight}px`)
    .style('position', 'relative') // Add relative position to parent container
    .style('background-color', '#eee')
    .style('background-size', 'cover')
    .style('background-position', 'center')
    .style('background-image', d => `url(${d.image_url})`);

  // Add image names as labels at the bottom of each cell
  images.append('div')
    .style('position', 'absolute')
    .style('bottom', '0')
    .style('left', '0')
    .style('right', '0')
    .style('padding', '5px')
    .style('background-color', 'rgba(0, 0, 0, 0.7)')
    .style('color', '#fff')
    .style('text-align', 'center')
    .text(d => d.master_id);
}

const vis = {
  id: 'ImageDisplayGrid',
  label: 'DisplayGrid',
  options: {},
  create(element, config) {
    element.innerHTML = '<div class="image-grid"></div>';
    return {};
  },
  update(data, element, config, context) {
    // Check if data is available
    if (!data || data.length === 0) {
      element.innerHTML = '<div>No data available</div>';
      return;
    }

    const container = d3.select(element).select('.image-grid');
    container.html(''); // Clear the grid before rendering

    // Render the image grid with the data
    renderImageGrid(data, container);
  },
};

// Register the visualization with Looker
looker.plugins.visualizations.add(vis);
