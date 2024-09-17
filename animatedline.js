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
    
    // Set up the initial state of the visualization
    create: function(element, config) {
      element.innerHTML = "<div id='animated-line-chart'></div>";
    },

    // Render the visualization with data
    update: function(data, element, config, queryResponse) {
      // Error handling
      if (queryResponse.fields.dimensions.length !== 1) {
        this.addError({title: "Incorrect Number of Dimensions", message: "This chart requires 1 dimension."});
        return;
      }
      if (queryResponse.fields.measures.length !== 1) {
        this.addError({title: "Incorrect Number of Measures", message: "This chart requires 1 measure."});
        return;
      }

      // Clear any previous content
      d3.select("#animated-line-chart").html("");

      // Data parsing
      var dimension = queryResponse.fields.dimensions[0].name;
      var measure = queryResponse.fields.measures[0].name;

      var formattedData = data.map(function(row) {
        return {
          date: new Date(row[dimension].value),
          value: row[measure].value
        };
      });

      // Set up chart dimensions and scales
      var margin = {top: 10, right: 30, bottom: 30, left: 40},
          width = element.clientWidth - margin.left - margin.right,
          height = element.clientHeight - margin.top - margin.bottom;

      var svg = d3.select("#animated-line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleTime()
        .domain(d3.extent(formattedData, function(d) { return d.date; }))
        .range([0, width]);

      var y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, function(d) { return d.value; })])
        .range([height, 0]);

      // Add the X Axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g")
        .call(d3.axisLeft(y));

      // Add line path
      var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); });

      svg.append("path")
        .datum(formattedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      // Animation effect: Reveal the line gradually
      var totalLength = svg.select("path").node().getTotalLength();

      svg.select("path")
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(config.animationDuration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

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
    }
  };

  looker.plugins.visualizations.add(viz);
}());
