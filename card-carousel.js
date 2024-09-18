looker.plugins.visualizations.add({
  id: "single_baseball_card",
  label: "Single Baseball Card",
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
    // Create a container element for the card
    const container = document.createElement('div');
    container.className = 'card-container';
    element.appendChild(container);
  },
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    const cardContainer = element.querySelector('.card-container');
    cardContainer.innerHTML = ""; // Clear the container

    // Check for the minimum number of dimensions and measures
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

    // Assuming we just want to display the first card from the dataset
    const row = data[0];

    const playerName = LookerCharts.Utils.textForCell(row[playerNameDimension]).replace(/\s+/g, '-').replace(/\./g, '');
    const playerNameHtml = LookerCharts.Utils.htmlForCell(row[playerNameDimension]);
    const playerLogoUrl = LookerCharts.Utils.textForCell(row[playerLogoDimension]);
    const playerImgUrl = LookerCharts.Utils.textForCell(row[playerImageDimension]);
    const measureValue = LookerCharts.Utils.textForCell(row[measureDimension]);

    // Build the single card HTML
    const cardHTML = `
      <style>
        .card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

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

      <div class="card-${playerName}">
        <img class="team_logo" src="${playerLogoUrl}" alt="Team Logo" />
        <img class="player" src="${playerImgUrl}" alt="${playerNameHtml}" />
        <figcaption>${playerNameHtml}</figcaption>
      </div>
    `;

    // Insert the card HTML into the container
    cardContainer.innerHTML = cardHTML;

    if (config.measureTitle) {
      const measureName = queryResponse.fields.measures[0].label;
      const measureValue = LookerCharts.Utils.textForCell(row[measureDimension]);

      const titles = document.getElementsByClassName("looker-vis-context-title-link");
      if (titles.length > 0) {
        titles[0].innerText = `${measureName}: ${measureValue}`;
      }
    }

    doneRendering(); // Signal rendering completion
  }
});
