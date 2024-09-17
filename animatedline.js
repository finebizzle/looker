(function() {
  var viz = {
    options: {
      xAxisLabel: {
        label: "X-Axis Label",
        type: "string",
        default: "Date",
        section: "x-Axis",
        order: 0
      },
      yAxisLabel: {
        label: "Y-Axis Label",
        type: "string",
        default: "Value",
        section: "y-Axis",
        order: 1
      },
      animationDuration: {
        label: "Animation Duration",
        type: "string",
        default: "6000",
        section: "Animation",
        order: 2
      }
    },

    create: function(element, config) {
      element.innerHTML = "<div id='animated-line-chart'></div>";

      if (typeof d3 === "undefined") {
        var script = document.createElement("script");
        script.src = "https://d3js.org/d3.v5.min.js";
        script.onload = () => {
          this.updateVisualization(element, config);
        };
        document.head.appendChild(script);
      } else {
        this.updateVisualization(element, config);
      }
    },

    update: function(data, element, config, queryResponse) {
      try {
        // Error handling for dimensions and measures
        if (queryResponse.fields.dimensions.length !== 1) {
          throw new Error("This chart requires exactly 1 dimension.");
        }
        if (queryResponse.fields.measures.length < 1) {
          throw new Error("This chart requires at least 1 measure.");
        }

        // Dynamically create legend name options based on the number of measures
        var measureNames = queryResponse.fields.measures.map(m => m.name);
        measureNames.forEach((measure, i) => {
          if (!this.options[`legendName${i}`]) {
            this.options[`legendName${i}`] = {
              label: `Legend Name for ${queryResponse.fields.measures[i].label}`,
              type: "string",
              default: queryResponse.fields.measures[i].label_short || queryResponse.fields.measures[i].label,
              section: "Legend",
              order: i + 3
            };
          }
        });

        // Ensure the options are updated and re-rendered in Looker
        this.trigger("registerOptions", this.options);  // Tell Looker to re-render the options

        // Clear previous content
        d3.select("#animated-line-chart").html("");

        // Data parsing
        var dimension = queryResponse.fields.dimensions[0].name;
        var measures = queryResponse.fields.measures.map(m => m.name); // Array of measures

        // Prepare data for single or multiple lines
        var formattedData = measures.map((measureName, i) => {
          return {
            name: config[`legendName${i}`] || measureName, // Use the custom legend name from the config
            values: data.map(function(row) {
              return {
                dimensionValue: row[dimension].value,
                value: row[measureName].value
              };
            })
          };
        });

        // [Chart setup code...]

        // Tooltip definition
        var tooltip = svg.append("g")
          .attr("class", "tooltip")
          .style("display", "none");

        tooltip.append("rect")
          .attr("width", 150)
          .attr("height", 30)
          .attr("fill", "lightsteelblue")
          .style("opacity", 0.9)
          .attr("rx", 8)
          .attr("ry", 8);

        var tooltipText = tooltip.append("text")
          .attr("x", 10)
          .attr("y", 20)
          .style("font-size", "12px")
          .style("fill", "#000");

        // Add circles for each data point and the tooltip behavior
        formattedData.forEach(function(series, index) {
          // [Line drawing and animation code...]

          // Add circles for each data point and the tooltip behavior
          svg.selectAll(".dot-" + index)
            .data(series.values)
            .enter()
            .append("circle")
            .attr("class", "dot-" + index)
            .attr("cx", function(d) { return x(new Date(d.dimensionValue)); })
            .attr("cy", function(d) { return y(d.value); })
            .attr("r", 4)
            .attr("fill", color(index))
            .on("mouseover", function(event, d) {
              tooltip.style("display", null);
              tooltipText.text(series.name + ": " + d.value);  // Corrected to use d.value
            })
            .on("mousemove", function(event) {
              tooltip.attr("transform", "translate(" + (d3.pointer(event)[0] + 10) + "," + (d3.pointer(event)[1] - 30) + ")");
            })
            .on("mouseout", function() {
              tooltip.style("display", "none");
            });
        });

        // [Rest of your code...]

      } catch (error) {
        this.addError({title: "Visualization Error", message: error.message});
        console.error("Visualization Error:", error);
      }
    }
  };

  looker.plugins.visualizations.add(viz);
}());
