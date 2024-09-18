looker.plugins.visualizations.add({
  id: "baseball_card_carousel",
  label: "Baseball Card Carousel",
  options: {
    primaryColor: {
      label: "Primary Team Color",
      type: "string",
      display: "color",
      default: "#001F5C", // Default navy blue color
      order: 1
    },
    secondaryColor: {
      label: "Secondary Team Color",
      type: "string",
      display: "color",
      default: "#ffffff", // Default white color
      order: 2
    },
    tertiaryColor: {
      label: "Tertiary Team Color",
      type: "string",
      display: "color",
      default: "#C8102E", // Default red color
      order: 3
    },
    measureTitle: {
      label: "Measure Title",
      type: "boolean",
      default: false,
      order: 4
    }
  },
  create(element, config) {
    // Create a container element for the carousel
    const container = document.createElement('div');
    container.className = 'carousel-container';
    container.innerHTML = `
      <button class="carousel-prev" style="position:absolute; left: 0;">Previous</button>
      <div class="carousel-cards" style="display:flex; justify-content:center; align-items:center;"></div>
      <button class="carousel-next" style="position:absolute; right: 0;">Next</button>
    `;
    element.appendChild(container);
  },
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    const cardContainer = element.querySelector('.carousel-cards');
    const prevButton = element.querySelector('.carousel-prev');
    const nextButton = element.querySelector('.carousel-next');
    let currentIndex = 0;

    cardContainer.innerHTML = ""; // Clear the container

    if (queryResponse.fields.dimensions.length < 3 || queryResponse.fields.measures.length < 1) {
      const errorMessage = `
        <div style="color: red; font-weight: bold; padding: 10px;">
          <p>Error: This visualization requires at least 3 dimensions (Player Name, Player Logo URL, Player Image URL) and 1 measure.</p>
        </div>
      `;
      cardContainer.innerHTML = errorMessage;
      doneRendering();
      return;
    }

    // Use dimensions based on their position in the query
    const playerNameDimension = queryResponse.fields.dimensions[0].name; // First dimension is Player Name
    const playerLogoDimension = queryResponse.fields.dimensions[1].name; // Second dimension is Player Logo URL
    const playerImageDimension = queryResponse.fields.dimensions[2].name; // Third dimension is Player Image URL
    const measureDimension = queryResponse.fields.measures[0].name; // First measure

    // Colors from the configuration options
    const primaryColor = config.primaryColor || '#001F5C';
    const secondaryColor = config.secondaryColor || '#ffffff';
    const tertiaryColor = config.tertiaryColor || '#C8102E';

    // Create cards array to hold all cards
    const cards = data.map(row => {
      const playerName = LookerCharts.Utils.textForCell(row[playerNameDimension]).replace(/\s+/g, '-').replace(/\./g, '');
      const playerNameHtml = LookerCharts.Utils.htmlForCell(row[playerNameDimension]);
      const playerLogoUrl = LookerCharts.Utils.textForCell(row[playerLogoDimension]);
      const playerImgUrl = LookerCharts.Utils.textForCell(row[playerImageDimension]);
      const measureValue = LookerCharts.Utils.textForCell(row[measureDimension]);

      return `
        <div class="card-${playerName}" style="display:none; flex-direction:column; align-items:center;">
          <style>
            .card-${playerName} {
              width: 243px;
              height: 350px;
              border: 8px solid ${primaryColor};
              border-radius: 10px;
              background-color: ${secondaryColor};
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
              overflow: hidden;
              position: relative;
              display: flex;
              flex-direction: column;
            }
            .card-${playerName} .team_logo {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: ${primaryColor};
              position: absolute;
              top: 10px;
              left: 10px;
              border: 3px solid ${secondaryColor};
              object-fit: contain;
            }
            .card-${playerName} .player {
              width: 100%;
              height: 70%;
              object-fit: cover;
            }
            .card-${playerName} figcaption {
              background-color: ${primaryColor};
              color: ${secondaryColor};
              font-family: 'Roboto', sans-serif;
              font-weight: bold;
              padding: 10px;
              text-transform: capitalize;
              border-top: 2px solid ${tertiaryColor};
            }
          </style>
          <img class="team_logo" src="${playerLogoUrl}" alt="Team Logo" />
          <img class="player" src="${playerImgUrl}" alt="${playerNameHtml}" />
          <figcaption>${playerNameHtml}</figcaption>
        </div>
      `;
    });

    // Show the first card by default
    function showCard(index) {
      cardContainer.innerHTML = cards[index];
      currentIndex = index;
    }

    // Show the first card initially
    showCard(0);

    // Handle next and previous clicks
    prevButton.onclick = () => {
      const newIndex = (currentIndex - 1 + cards.length) % cards.length; // Handle wrapping backward
      showCard(newIndex);
    };

    nextButton.onclick = () => {
      const newIndex = (currentIndex + 1) % cards.length; // Handle wrapping forward
      showCard(newIndex);
    };

    doneRendering(); // Signal rendering completion
  }
});
