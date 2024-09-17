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
                date: new Date(row[dimension].value),
                value: row[measureName].value
              };
            })
          };
        });

        // Set up chart dimensions and scales
        var margin = {top: 10, right: 100, bottom: 30, left: 40}, // Adjust right margin for the legend
            width = element.clientWidth - margin.left - margin.right,
            height = element.clientHeight - margin.top - margin.bottom;

        var svg = d3.select("#animated-line-chart")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Define x and y scales
        var x = d3.scaleTime()
          .domain(d3.extent(data, function(d) { return new Date(d[dimension].value); }))
          .range([0, width]);

        var y = d3.scaleLinear()
          .domain([0, d3.max(formattedData, function(series) {
            return d3.max(series.values, function(d) { return d.value; });
          })])
          .range([height, 0]);

        // Add the X Axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
          .call(d3.axisLeft(y));

        // Add a color scale to differentiate the lines
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // Line generator function
        var line = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.value); });

        // Add a line for each series (supports both single and multiple lines)
        formattedData.forEach(function(series, index) {
          var path = svg.append("path")
            .datum(series.values)
            .attr("fill", "none")
            .attr("stroke", color(index)) // Apply a different color for each series
            .attr("stroke-width", 1.5)
            .attr("d", line);

          // Animate the line
          var totalLength = path.node().getTotalLength();

          path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(config.animationDuration)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

          // Add circles for each data point and the tooltip behavior
          svg.selectAll(".dot-" + index)
            .data(series.values)
            .enter()
            .append("circle")
            .attr("class", "dot-" + index)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.value); })
            .attr("r", 4)
            .attr("fill", color(index))
            .on("mouseover", function(event, d) {
              tooltip.transition().duration(200).style("opacity", 1);
              tooltip.html(series.name + "<br/>Date: " + d3.timeFormat("%b %d, %Y")(d.date) + "<br/>Value: " + d.value)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
              tooltip.transition().duration(500).style("opacity", 0);
            });
        });

        // Add labels
        svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height + margin.top + 20)
          .text(config.xAxisLabel);

        svg.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 10)
          .attr("x", -margin.top)
          .text(config.yAxisLabel);

        // Add legend
        var legend = svg.selectAll(".legend")
          .data(formattedData)
          .enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

        // Add colored rectangles to legend
        legend.append("rect")
          .attr("x", width + 20) // Position it to the right of the chart
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d, i) { return color(i); });

        // Add text to legend
        legend.append("text")
          .attr("x", width + 45) // Position the text next to the rectangles
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d.name; });

        // Tooltip definition
        var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      } catch (error) {
        this.addError({title: "Visualization Error", message: error.message});
        console.error("Visualization Error:", error);
      }
    }
  };

  looker.plugins.visualizations.add(viz);
}());
