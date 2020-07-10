// Create the Bar Chart
function barChart(sampleID) {
    d3.json("./data/samples.json").then((data) => {
        console.log(data);
        let samples = data.samples;
        let results = samples.filter(object => object.id == sampleID);
        let result = results[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        let yvalues = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        let trace1 = {
            y: yvalues,
            x: sample_values.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h',
            text: otu_labels.slice(0, 10).reverse()
        }

        let chartData = [trace1];

        let barLayout = {
            title: 'Top Ten Cultures',
        }

        Plotly.newPlot('bar', chartData, barLayout);
    });
}

//Display demographic info
function demoInfo(sampleID) {
    d3.json('./data/samples.json').then((data) => {
        let metaData = data.metadata;
        let array = metaData.filter(object => object.id == sampleID);
        let result = array[0];

        let display = d3.select('#sample-metadata');
        display.html('');
        Object.entries(result).forEach(([key, value]) => {
            let text = `${key}: ${value}`;
            display.append('h6').text(text);
        });
    });
}

//Bubble chart
function bubbleChart(sampleID) {
    d3.json('./data/samples.json').then((data) => {
        let samples = data.samples;
        let results = samples.filter(object => object.id == sampleID);
        let result = results[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let trace2 = {
            x: otu_ids,
            y:sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        let bubbleData = [trace2];

        let bubbleLayout = {
            title: "Belly Button Bacteria Samples",
            xaxis: {title: 'OTU ID'}
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

//Function to handle selection of new sample ID
function optionChanged(newSampleID) {
    barChart(newSampleID);
    demoInfo(newSampleID);
    bubbleChart(newSampleID);
}

//Function to run everything
function createCharts() {

    let selector = d3.select('#selDataset');

    d3.json('./data/samples.json').then((data) => {
        let sampleNames = data.names;

        sampleNames.forEach((sampleID) => {
            selector
                .append('option')
                .text(sampleID)
                .property('value', sampleID);
        });

        barChart(data.names[0]);
        demoInfo(data.names[0]);
        bubbleChart(data.names[0]);

    });
}

createCharts();
