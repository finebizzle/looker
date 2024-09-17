var formattedData = measures.map(measureName => {
  return {
    name: measureName,
    values: data.map(function(row) {
      return {
        date: new Date(row[dimension].value),
        value: row[measureName].value
      };
    })
  };
});
