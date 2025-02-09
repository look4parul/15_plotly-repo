// Belly Button Boi-diversity - Plotly code
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let metadataURL = '/metadata/'+sample;
  d3.json(metadataURL).then(function(sample) {
    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleData = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sampleData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key,value]){
      let row = sampleData.append("p");
      row.text(key+" : "+value)
      console.log("row value: ", row)
    })
  }); 
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let plotData = "/samples/"+sample;

  
  d3.json(plotData).then(function(data){
    let x_axis = data.otu_ids;
    let y_axis = data.sample_values;
    let size = data.sample_values;
    let color = data.otu_ids;
    let texts = data.otu_labels;
    let bubble = {
      x: x_axis,
      y: y_axis,
      text: texts,
      mode: "markers",
      marker: {
        size: size,
        color: color,
        colorscale: "Earth"
      }
};

let bubbleData = [bubble];
var layout = {
  title: "Belly Button Bacteria",
  xaxis: {title: "OTU ID"}
};
Plotly.newPlot("bubble", bubbleData, layout);

// @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    d3.json(plotData).then(function(data){
      let values = data.sample_values.slice(0,10);
      let labels = data.otu_ids.slice(0,10);
      let display = data.otu_labels.slice(0,10);

      let pie_chart = [{
        values: values,
        lables: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  });
};

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
