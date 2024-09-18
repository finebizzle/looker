looker.plugins.visualizations.add({
  id: "baseball_card",
  label: "Baseball Card",
  options: {
    customMeasureName: {
      label: "Custom Measure Name",
      type: "string",
      default: "",
      order: 2
    },
    measureTitle: {
      label: "Measure Title",
      type: "boolean",
      default: false,
      order: 1
    }
  },
  create(element, config) {
    // Create a container element for the card
    element.innerHTML = '<div class="card-container"></div>';
  },
  updateAsync(data, element, config, queryResponse, details, doneRendering) {
    const container = d3.select(element).select('.card-container');
    container.html(""); // Clear container

    // Check if the necessary dimensions and measures are available
    const requiredDimensions = 6; // We need 6 dimensions for the visualization to work
    const requiredMeasures = 1; // We need at least 1 measure

    if (queryResponse.fields.dimensions.length < requiredDimensions || queryResponse.fields.measures.length < requiredMeasures) {
      // Display an error message
      const errorMessage = `
        <div style="color: red; font-weight: bold; padding: 10px;">
          <p>Error: This visualization requires at least 6 dimensions and 1 measure to display correctly.</p>
          <p>Please ensure your query includes:</p>
          <ul>
            <li>Player Name (Dimension)</li>
            <li>Player Logo URL (Dimension)</li>
            <li>Primary Team Color (Dimension)</li>
            <li>Secondary Team Color (Dimension)</li>
            <li>Tertiary Team Color (Dimension)</li>
            <li>Player Image URL (Dimension)</li>
            <li>A numerical measure (Measure)</li>
          </ul>
        </div>
      `;
      container.html(errorMessage);
      doneRendering();
      return;
    }

    // Proceed with rendering if dimensions and measures are sufficient
    const customMeasureName = config.customMeasureName || queryResponse.fields.measures[0].name.replace(/_/g, ' ').split(".").pop().toLowerCase().replace(/(?:^|\s)[a-z]/g, (m) => m.toUpperCase());

    // Loop through data and create each card
    data.forEach(row => {
      const playerName = LookerCharts.Utils.textForCell(row[queryResponse.fields.dimensions[0].name]).replace(/\s+/g, '-').replace(/\./g,'');
      const playerNameHtml = LookerCharts.Utils.htmlForCell(row[queryResponse.fields.dimensions[0].name]);
      const playerLogoUrl = LookerCharts.Utils.textForCell(row[queryResponse.fields.dimensions[1].name]);
      const primaryColor = LookerCharts.Utils.textForCell(row[queryResponse.fields.dimensions[2].name]);
      const secondaryColor = LookerCharts.Utils.textForCell(row[queryResponse.fields.dimensions[3].name]);
      const tertiaryColor = LookerCharts.Utils.textForCell(row[queryResponse.fields.dimensions[4].name]);
      const playerImgUrl = LookerCharts.Utils.textForCell(row[queryResponse.fields.dimensions[5].name]);
      const measureValue = LookerCharts.Utils.textForCell(row[queryResponse.fields.measures[0].name]);

      // Add card to container
      container.html(`
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
      `);
    });

    // Edit Looker tile title if the measureTitle option is enabled
    if (config.measureTitle) {
      const measureName = customMeasureName;
      const measureValue = LookerCharts.Utils.textForCell(data[0][queryResponse.fields.measures[0].name]);

      const titles = document.getElementsByClassName("looker-vis-context-title-link");
      if (titles.length > 0) {
        titles[0].innerText = `${measureName}: ${measureValue}`;
      }
    }

    doneRendering(); // Call doneRendering to signal completion
  }
});
