var svgWidth = 1000;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Test Read Data
d3.csv("static/data/all_data.csv").then((x) => {
  console.log(x);
})

function init() {

d3.csv("static/data/all_data.csv").then((x) => {
    console.log(x);
    var sample_year=x.year_all 
    var year_select=d3.select("#selYear")
    sample_year.forEach((y)=>{
            sample_name.append("option")
            .text(y)
            .property(y,"value")
      });
      var first_year=sample_year[0];
      // chart_table(first_year);
  })
}

// run the init function
// init()
// function optionChanged(sample_one){
//     chart_table(sample_one);
// }

// var years;
// d3.csv("all_data.csv").then(years => {
//     console.log(years);
//     d3.select("#selYear")
//         .append("select")
//         .attr("id", "YearSelector").on("change",yearchanged)
//         .selectAll("option")
//         .data(years)
//         .enter()
//         .append("option")
//         .attr("value", d => d)
//         .text(d => d);
// }
// );

function yearchanged (){
  var newYear = d3.select(this).property('value');
  console.log(newYear);
  d3.json(`http://127.0.0.1:5000/api/${newYear}`).then(props => {
  properties = props;
  // updateBarChart(newYear, "literacy_rate");
})

}





  
// Initial Params
var chosenYAxis = "literacy_rate";

// function used for updating x-scale var upon click on axis label
function yScale(eduData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(eduData, d => d[chosenYAxis]),
      d3.max(eduData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}


// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {

  var label;

  if (chosenYAxis === "literacy_rate") {
    label = "Literacy Rate";
  }
  else if (chosenYAxis === "unemployment_rate") {
    label = "Unemployment Rate";
  }
  else {
    label = "Distribution Family Income";
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.country}<br>${label} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("2019.csv").then(function(eduData, err) {
  console.log(eduData);
  if (err) throw err;

  // parse data
  eduData.forEach(function(data) {
    data.education_expenditures = +data.education_expenditures;
    data.literacy_rate = +data.literacy_rate;
    data.unemployment_rate = +data.unemployment_rate;
    data.distribution_of_family_income = +data.distribution_of_family_income;
  });

  // console.log(data.education_expenditures)

  // yLinearScale function above csv import
  var yLinearScale = yScale(eduData, chosenYAxis);

  // Create y scale function
  var xLinearScale = d3.scaleLinear()
    .domain([-1, d3.max(eduData, d => d.education_expenditures)])
    .range([0, width]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
   .classed("y-axis", true)
   .call(leftAxis);

  console.log(yAxis)

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(eduData)
    .enter()
    .append("circle")
    .attr("cy", d => yLinearScale(d[chosenYAxis]))  
    .attr("cx", d => xLinearScale(d.education_expenditures))
    .attr("r", 10)
    .attr("fill", "green")
    .attr("opacity", "2");

  // Create group for three y-axis labels
  // var labelsGroup = chartGroup.append("g")
  //   .attr("transform", `translate(${width / 2}, ${height + 20})`);


// x axis label
    chartGroup.append("text")
    .attr("x", 400)
    .attr("y", 650)
    .attr("value", "education_expenditures") // value to grab for event listener
    .classed("axis-text", true)
    .text("education Expenditures");

// three y label
  var labelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");

  var ylabel1Group=labelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 0 - 150)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "literacy_rate") // value to grab for event listener
    .classed("active", true)
    // .classed("axis-text", true)
    .text("Literacy Rate");

    var ylabel2Group=labelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 0 - 100)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "unemployment_rate") // value to grab for event listener
    .classed("inactive", true)
    // .classed("axis-text", true)
    .text("Unemployment Rate");


    var ylabel3Group=labelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "distribution_of_family_income") // value to grab for event listener
    .classed("inactive", true)
    // .classed("axis-text", true)
    .text("Distribution Family Income");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(eduData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "literacy_rate") {
          ylabel1Group
            .classed("active", true)
            .classed("inactive", false);
          ylabel2Group
            .classed("active", false)
            .classed("inactive", true);
          ylabel3Group
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "unemployment_rate") {
          ylabel1Group
            .classed("active", false)
            .classed("inactive", true);
          ylabel2Group
            .classed("active", true)
            .classed("inactive", false);
          ylabel3Group
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
        ylabel1Group
          .classed("active", false)
          .classed("inactive", true);
        ylabel2Group
          .classed("active", false)
          .classed("inactive", true);
        ylabel3Group
          .classed("active", true)
          .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});


// minSorted([-100, -10, 1, 2, 5]);