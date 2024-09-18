looker.plugins.visualizations.add({
  id: "baseball_card",
  label: "Baseball Card",
  options: {
    playerName: {
      label: "Player Name Dimension",
      type: "string",
      display: "select",
      section: "Fields",
      order: 1,
      // Dynamically populate available dimensions for player name
      values: (config, queryResponse) => {
        return queryResponse.fields.dimensions.map(dim => ({
          [dim.label]: dim.name
        }));
      }
    },
    playerLogo: {
      label: "Player Logo URL Dimension",
      type: "string",
      display: "select",
      section: "Fields",
      order: 2,
      // Dynamically populate available dimensions for player logo
      values: (config, queryResponse) => {
        return queryResponse.fields.dimensions.map(dim => ({
          [dim.label]: dim.name
        }));
      }
    },
    playerImage: {
      label: "Player Image URL Dimension",
      type: "string",
      display: "select",
      section: "Fields",
      order: 3,
      // Dynamically populate available dimensions for player image
      values: (config, queryResponse) => {
        return queryResponse.fields.dimensions.map(dim => ({
          [dim.label]: dim.name
        }));
      }
    },
    playerMeasure: {
      label: "Numerical Measure",
      type: "string",
      display: "select",
      section: "Fields",
      order: 4,
      // Dynamically populate available measures
      values: (config, queryResponse) => {
        return queryResponse.fields.measures.map(measure => ({
          [measure.label]: measure.name
        }));
      }
    },
    primaryColor: {
      label: "Primary Team Color",
      type: "string",
      display: "color",
      default: "#FF0000", // Default color red
      order: 5
    },
    secondaryColor: {
      label: "Secondary Team Color",
      type: "string",
      display: "color",
      default: "#00FF00", // Default color green
      order: 6
    },
    tertiaryColor: {
      label: "Tertiary Team Color",
      type: "string",
      display: "color",
      default: "#0000FF", // Default color blue
      order: 7
    }
  },
  create(element, config) {
    // Create a container element for the card
    const container = document.createElement('div');
    container.className = 'card-container';
    element.appendChild(container);
  },
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    const container = element.querySelector('.card-container');
    container.innerHTML = ""; // Clear container

    const playerNameDimension = config.playerName;
    const playerLogoDimension = config.playerLogo;
    const playerImageDimension = config.playerImage;
    const playerMeasureDimension = config.playerMeasure;

    // Check if the required fields are selected
    if (!playerNameDimension || !playerLogoDimension || !playerImageDimension || !playerMeasureDimension) {
      const errorMessage = `
        <div style="color: red; font-weight: bold; padding: 10px;">
          <p>Error: Please select the required dimensions and measure in the visualization settings:</p>
          <ul>
            <li>Player Name (Dimension)</li>
            <li>Player Logo URL (Dimension)</li>
            <li>Player Image URL (Dimension)</li>
            <li>A numerical measure (Measure)</li>
          </ul>
        </div>
      `;
      container.innerHTML = errorMessage;
      doneRendering();
      return;
    }

    // Colors from the configuration options
    const primaryColor = config.primaryColor || '#FF0000';
    const secondaryColor = config.secondaryColor || '#00FF00';
    const tertiaryColor = config.tertiaryColor || '#0000FF';

    // Loop through data and create each card
    data.forEach(row => {
      const playerName = LookerCharts.Utils.textForCell(row[playerNameDimension]).replace(/\s+/g, '-').replace(/\./g,'');
      const playerNameHtml = LookerCharts.Utils.htmlForCell(row[playerNameDimension]);
      const playerLogoUrl = LookerCharts.Utils.textForCell(row[playerLogoDimension]);
      const playerImgUrl = LookerCharts.Utils.textForCell(row[playerImageDimension]);
      const measureValue = LookerCharts.Utils.textForCell(row[playerMeasureDimension]);

      const cardHTML = `
        <style>
          .card-container {
            text-transform: uppercase;
            font-family: 'Roboto', sans-serif;
          }
          .card-${playerName} {
            position: relative;
            max-width: 243px;
            max-height: 350px;
            height: 100%;
            width: 100%;
            border: 15px ${primaryColor} solid;
          }
          .card-${playerName}:before, .card-${playerName}:after {
            content: '';
          }
          .card-${playerName}:before {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 8;
            border-top: 60px solid ${primaryColor};
            border-right: 60px solid transparent;
          }
          .card-${playerName}:after {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 5;
            border-top: 62px solid black;
            border-right: 62px solid transparent;
          }
          .card-${playerName} .team_logo {
            position: absolute;
            z-index: 15;
            top: -8px;
            left: -8px;
          }
          .card-${playerName} .player {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            height: 100%;
            width: 100%;
            border: 2px black solid;
          }
          .card-${playerName} figcaption {
            position: absolute;
            padding-top: 5px;
            padding-left: 5px;
            bottom: -10px;
            right: 0;
            min-width: 66%;
            min-height: 34px;
            text-align: center;
            font-size: 100%;
            background: ${secondaryColor};
            border: 2px black solid;
            z-index: 10;
          }
          .card-${playerName} figcaption:before, .card-${playerName} figcaption:after {
            content: '';
          }
          .card-${playerName} figcaption:before {
            position: absolute;
            bottom: 32px;
            right: -2px;
            z-index: 18;
            border-bottom: 15px solid ${primaryColor};
            border-left: 15px solid transparent;
          }
          .card-${playerName} figcaption:after {
            position: absolute;
            bottom: 32px;
            right: -2px;
            z-index: 15;
            border-bottom: 17px solid black;
            border-left: 17px solid transparent;
          }
          .name-${playerName} a {
            color: ${tertiaryColor} !important;
          }
        </style>
        <figure class="card-${playerName}">
          <img class="team_logo" src="${playerLogoUrl}" />
          <img class="player" src="${playerImgUrl}" />
          <figcaption class="name-${playerName}">${playerNameHtml}</figcaption>
        </figure>
      `;

      container.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Optionally, update the tile title if the option is enabled
    if (config.measureTitle) {
      const measureName = queryResponse.fields.measures.find(m => m.name === playerMeasureDimension).label;
      const measureValue = LookerCharts.Utils.textForCell(data[0][playerMeasureDimension]);

      const titles = document.getElementsByClassName("looker-vis-context-title-link");
      if (titles.length > 0) {
        titles[0].innerText = `${measureName}: ${measureValue}`;
      }
    }

    doneRendering(); // Call doneRendering to signal completion
  }
});
