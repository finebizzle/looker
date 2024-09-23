// Function to dynamically load D3.js
const loadD3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof d3 !== 'undefined') {
      resolve(); // D3 is already loaded
    } else {
      const script = document.createElement('script');
      script.src = 'https://d3js.org/d3.v7.min.js'; // Use the D3.js v7 CDN link
      script.onload = () => resolve(); // D3 loaded successfully
      script.onerror = () => reject(new Error('Failed to load D3.js'));
      document.head.appendChild(script); // Add the script to the document head
    }
  });
};

// Visualization object for Looker
const vis = {
  id: 'ImageDisplayGrid',
  label: 'DisplayGrid',
  options: {},

  // The create function sets up the DOM for the visualization
  create: function (element, config) {
    // Dynamically load D3.js before creating the visualization
    return loadD3().then(() => {
      // Create the container for the image grid
      element.innerHTML = '<div class="image-grid"></div>';
    });
  },

  // The update function is called when the visualization is rendered or updated
  update: function (data, element, config, context) {
    // Check if D3.js is available
    if (typeof d3 === 'undefined') {
      console.error('D3.js failed to load');
      return;
    }

    // Select the container where the grid will be rendered
    const container = d3.select(element).select('.image-grid');
    container.html(''); // Clear the grid before rendering new content

    // Call the function to render the image grid with the data
    renderImageGrid(data, container);
  }
};

// Function to render the image grid using D3.js
function renderImageGrid(data, container) {
  // Define the dimensions and properties of the image grid
  const imageWidth = 100;
  const imageHeight = 100;
  const imagesPerRow = 20; // 20 images per row to fit 500 total images
  const spacing = 10;
  const maxImages = 500; // Limit to display 500 images

  // Slice the data to show only the first 500 images
  const truncatedData = data.slice(0, maxImages);

  // Create a container for the image grid using CSS Grid
  const gridContainer = container.append('div')
    .style('display', 'grid')
    .style('grid-template-columns', `repeat(${imagesPerRow}, ${imageWidth}px)`)
    .style('grid-gap', `${spacing}px`)
    .style('width', 'fit-content')
    .style('margin', 'auto');

  // Add the image elements to the grid container
  const images = gridContainer.selectAll('.image')
    .data(truncatedData)
    .enter()
    .append('div')
    .style('width', `${imageWidth}px`)
    .style('height', `${imageHeight}px`)
    .style('position', 'relative') // Use relative position to enable absolute positioning of the label
    .style('background-color', '#eee')
    .style('background-size', 'cover')
    .style('background-position', 'center')
    .style('background-image', d => `url(${d.image_url})`); // Set the background image using the data

  // Add labels (image names) as text at the bottom of each image
  images.append('div')
    .style('position', 'absolute')
    .style('bottom', '0')
    .style('left', '0')
    .style('right', '0')
    .style('padding', '5px')
    .style('background-color', 'rgba(0, 0, 0, 0.7)') // Semi-transparent black background for the label
    .style('color', '#fff') // White text
    .style('text-align', 'center') // Center the label text
    .text(d => d.master_id); // Use master_id as the label text
}

// Register the visualization with Looker
looker.plugins.visualizations.add(vis);
