function buildMetadata(sample) {
  console.log(sample);

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadataURL = "/metadata/" + sample;

  d3.json(metadataURL).then(function(response) {
    console.log(response);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panelID = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panelID.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value]) => {
      var cell = panelID.append("li");
      cell.text(`${key}: ${value}`);
    });  
  });
};

// Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleDataURL = "/samples/" + sample; 
  d3.json(sampleDataURL).then(function(bubble) {
    console.log(bubble);
    //console.log(charts.otu_ids);

    // @TODO: Build a Bubble Chart using the sample data
      //var otu_ids = charts.otu_ids;
      //var otu_labels = charts.otu_labels;
      //var sample_values = charts.sample_values;

      var bubbleChart = [{
        x: bubble.otu_ids,
        y: bubble.sample_values,
        text: bubble.otu_labels,
        mode: "markers",
        marker: {
          size: bubble.sample_values,
          color: bubble.otu_ids,
          colorscale: "Earth"
        }
      }];

      var layout = {
        title: "Bubble Plot"
      }

      Plotly.plot("bubble", bubbleChart, layout);

    });
    
    // @TODO: Build a Pie Chart
    d3.json(sampleDataURL).then(function(pie) {
      console.log(pie);

      var val = pie.sample_values.slice(0,10);
      var lab = pie.otu_ids.slice(0,10);
      var hover = pie.otu_labels.slice(0,10);

      var pieChart = [{
        values: val,
        labels: lab,
        hovertext: hover,
        type: "pie", 
        colorscale: "Jet"
      }];

      //var data = [trace1];

      var layout = {
        title: "Pie Chart"
      };

      Plotly.plot("pie", pieChart, layout);
    });
  };
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

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
