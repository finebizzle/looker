(function() {
  var viz = {
    options: {
      xAxisLabel: {
        label: "X-Axis Label",
        type: "string",
        default: "Dimension 1",
        section: "x-Axis",
        order: 0
      },
      yAxisLabel: {
        label: "Y-Axis Label",
        type: "string",
        default: "Measure",
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
        document.head.appendChild(script);
      }
    },

    update: function(data, element, config, queryResponse) {
      try {
        // Error handling for dimensions and measures
        if (queryResponse.fields.dimensions.length < 1) {
          throw new Error("This chart requires at least 1 dimension.");
        }
        if (queryResponse.fields.measures.length !== 1) {
          throw new Error("This chart requires exactly 1 measure.");
        }
        if (!queryResponse.hasPivotedResults) {
          throw new Error("This chart requires pivoted data. Please pivot a dimension.");
        }

        // Clear previous content
        d3.select("#animated-line-chart").html("");

        // Data parsing
        var dimension1 = queryResponse.fields.dimensions[0].name; // First dimension (x-axis)
        var measure = queryResponse.fields.measures[0].name;      // Single measure
        var pivots = queryResponse.pivots;                        // Pivoted dimension values

        var isTimeDimension = queryResponse.fields.dimensions[0].is_timeframe;

        // Prepare data for multiple lines, one for each pivot value
        var formattedData = pivots.map(function(pivot, i) {
          return {
            name: pivot.label || pivot.key, // Use the pivot label or key as the series name
            values: data.map(function(row) {
              var dimValue = row[dimension1].value;
              var cell = row[measure][pivot.key] || row[measure][pivot.name];

              if (!cell || cell.value === null || cell.value === undefined) {
                // If cell is undefined or value is null, skip this data point
                return null;
              }

              var measureValue = cell.value;
              var measureRendered = cell.rendered || measureValue;

              // For date dimensions, parse to Date object
              if (isTimeDimension) {
                dimValue = new Date(dimValue);
              }

              return {
                dimensionValue: dimValue,
                value: measureValue,
                rendered: measureRendered
              };
            }).filter(function(d) {
              // Filter out null values
              return d !== null;
            })
          };
        }).filter(function(series) {
          // Filter out series with no valid data points
          return series.values.length > 0;
        });

        // If no data is present, display an error message
        if (formattedData.length === 0) {
          this.addError({ title: "No Data", message: "No valid data to display." });
          return;
        }

        // Set up chart dimensions and scales
        var margin = {top: 10, right: 100, bottom: 30, left: 40},
            width = element.clientWidth - margin.left - margin.right,
            height = element.clientHeight - margin.top - margin.bottom;

        var svg = d3.select("#animated-line-chart")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Determine x scale type based on dimension data type
        var xScaleType = isTimeDimension ? d3.scaleTime : d3.scalePoint;

        var x;
        if (isTimeDimension) {
          x = xScaleType()
            .domain(d3.extent(data, function(row) {
              var dimValue = row[dimension1].value;
              return new Date(dimValue);
            }))
            .range([0, width]);
        } else {
          x = xScaleType()
            .domain(data.map(function(row) { return row[dimension1].value; }))
            .range([0, width]);
        }

        var yMax = d3.max(formattedData, function(series) {
          return d3.max(series.values, function(d) { return d.value; });
        });

        if (yMax === undefined || yMax === null) {
          yMax = 0; // Default to 0 if no data is present
        }

        var y = d3.scaleLinear()
          .domain([0, yMax])
          .range([height, 0]);

        // Add the X Axis
        var xAxis = d3.axisBottom(x);

        if (!isTimeDimension) {
          xAxis.tickFormat(function(d) { return d; });
        }

        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        // Add the Y Axis
        svg.append("g")
          .call(d3.axisLeft(y));

        // Add a color scale to differentiate the lines
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // Line generator function
        var line = d3.line()
          .defined(function(d) { return d.value !== null && d.value !== undefined; }) // Ignore points with null values
          .x(function(d) { return x(d.dimensionValue); })
          .y(function(d) { return y(d.value); });

        // Tooltip definition
        var tooltip = svg.append("g")
          .attr("class", "tooltip")
          .style("display", "none");

        tooltip.append("rect")
          .attr("width", 160)
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

        // Add a line for each series
        formattedData.forEach(function(series, index) {
          var path = svg.append("path")
            .datum(series.values)
            .attr("fill", "none")
            .attr("stroke", color(index))
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
            .data(series.values.map(function(d) {
              return { data: d, seriesName: series.name };
            }))
            .enter()
            .append("circle")
            .attr("class", "dot-" + index)
            .attr("cx", function(d) { return x(d.data.dimensionValue); })
            .attr("cy", function(d) { return y(d.data.value); })
            .attr("r", 4)
            .attr("fill", color(index))
            .on("mouseover", function(d) {
              var event = d3.event;
              tooltip.style("display", null);
              tooltipText.text(d.seriesName + ": " + d.data.rendered);
            })
            .on("mousemove", function(d) {
              var event = d3.event;
              tooltip.attr("transform", "translate(" + (event.offsetX + 10) + "," + (event.offsetY - 30) + ")");
            })
            .on("mouseout", function() {
              tooltip.style("display", "none";
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
          .attr("x", width + 20)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d, i) { return color(i); });

        // Add text to legend
        legend.append("text")
          .attr("x", width + 45)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d.name; });

      } catch (error) {
        this.addError({ title: "Visualization Error", message: error.message });
        console.error("Visualization Error:", error);
      }
    }
  };

  looker.plugins.visualizations.add(viz);
}());
