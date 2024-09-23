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
  const imageWidth = 150;
  const imageHeight = 150;
  const imagesPerRow = 5; // Adjust to fit the layout better
  const spacing = 15;
  const maxImages = 500; // Limit to display 500 images

  // Set the grid container styles
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${imagesPerRow}, ${imageWidth}px)`;
  container.style.gridGap = `${spacing}px`;
  container.style.width = 'fit-content';
  container.style.margin = 'auto';

  // Process the data to only display the first 500 images
  const truncatedData = data.slice(0, maxImages);

  // Loop through each data item to create the image divs
  truncatedData.forEach(row => {
    // Ensure dimensions and measures are defined before accessing them
    const dimensions = row['dimensions'] || [];
    const measures = row['measures'] || [];

    // Check if the dimensions array has the required values (image URL and title)
    const imageUrl = dimensions[0] || ''; // Default to an empty string if undefined
    const title = dimensions[1] || 'Untitled'; // Default to 'Untitled' if undefined

    // Check if the measures array has the required value
    const measure = measures[0] !== undefined ? measures[0] : 'No Data'; // Default to 'No Data' if undefined

    // Skip this row if the image URL is missing
    if (!imageUrl) {
      console.warn('Skipping row due to missing image URL');
      return;
    }

    // Create the div to hold the image
    const imageDiv = document.createElement('div');
    imageDiv.style.width = `${imageWidth}px`;
    imageDiv.style.height = `${imageHeight}px`;
    imageDiv.style.position = 'relative'; // Enable relative positioning for the label
    imageDiv.style.backgroundColor = '#eee';
    imageDiv.style.backgroundSize = 'cover';
    imageDiv.style.backgroundPosition = 'center';
    imageDiv.style.backgroundImage = `url(${imageUrl})`;

    // Create the title div for the image (the second dimension)
    const titleDiv = document.createElement('div');
    titleDiv.style.position = 'absolute';
    titleDiv.style.top = '0';
    titleDiv.style.left = '0';
    titleDiv.style.right = '0';
    titleDiv.style.padding = '5px';
    titleDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent background for the title
    titleDiv.style.color = '#fff'; // White text
    titleDiv.style.textAlign = 'center'; // Center the title text
    titleDiv.textContent = title; // Use the second dimension as the title

    // Append the title div to the image div
    imageDiv.appendChild(titleDiv);

    // Create the measure div to show the measure value under the image
    const measureDiv = document.createElement('div');
    measureDiv.style.textAlign = 'center';
    measureDiv.style.marginTop = '5px';
    measureDiv.style.color = '#333'; // Style for the measure text
    measureDiv.textContent = measure; // Use the first measure as the value under the image

    // Append the image div and measure div to the container
    container.appendChild(imageDiv);
    container.appendChild(measureDiv); // Add measure under the image
  });
}

// Register the visualization with Looker
looker.plugins.visualizations.add(vis);
