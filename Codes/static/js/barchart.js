console.log("hello")

var years;
d3.json("http://127.0.0.1:5000/api/years").then(years => {
    console.log(years);
    d3.select("#years")
        .append("select")
        .attr("id", "YearSelector").on("change", yearchanged)
        .selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);


}
);
var slice = 12;
var newYear = 2008;
function yearchanged() {
    newYear = d3.select(this).property('value');
    console.log(newYear);
    d3.json(`http://127.0.0.1:5000/api/${newYear}`).then(props => {
        properties = props.slice(0,slice);
        updateBarChart(newYear, "literacy_rate");
    })

}



var impacts;
d3.json("http://127.0.0.1:5000/api/properties").then(impacts => {
    console.log(impacts);
    d3.select("#impacts")
        .append("select")
        .attr("id", "ImpactSelector").on("change", propertychanged)
        .selectAll("option")
        .data(impacts)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);
}
);

function propertychanged() {
    var newProperty = d3.select(this).property('value');
    console.log(newProperty);
    updateBarChart(newYear, newProperty);

}


var properties;
d3.json("http://127.0.0.1:5000/api/2008").then(props => {
    properties = props.slice(0,slice);
    updateBarChart(2008, "education_expenditures");
})




// Update the horizontal bar chart
function updateBarChart(year, property) {
    // Set a chart title, appropriate for one or more sample bacteria
    let chart_title = `${property} in ${year}`;
    let country_list = properties.map(p => p.country);
    let value_list = properties.map(p => p[property]);

    // Plot the counts of the bacteria samples
    var trace1 = {
        type: "bar",
        orientation: "h",
        x: value_list,
        y: country_list,
        text: country_list
    };

    var layout = {
        title: { text: chart_title, font: { size: 20 } },
        xaxis: { title: property, rangemode: 'tozero' },
        yaxis: { title: 'Country' }
    };

    var data = [trace1];
    Plotly.newPlot("bar", data, layout)
}

