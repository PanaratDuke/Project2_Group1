// blank out map so it can be replace if needed.
var container = L.DomUtil.get('map'); if(container != null){ container._leaflet_id = null; }

//----------------------------------------------
// Functions to defind markers in each factors
function markerSize(literacy_rate){
    return literacy_rate * 1000;
}

function markerSizeUnEmployment(unemployment_rate){
    return unemployment_rate * 5000;
}
//----------------------------------------------

// Define arrays to hold the factors markers
var literacyMarkers=[];
var unemploymentMarkers=[];
//----------------------------------------------

//

// Add markers into array
d3.csv("static/data/world_map_data.csv").then(function(worldData){
    // console.log("worldData : ", worldData)
    // console.log("worldData.country :", d3.entries(worldData))

    worldData.forEach(function(d){
        d.country = d.country;
        d.longitude = +d.longitude;
        d.lattitude = +d.lattitude;
        d.education_expenditures = +d.education_expenditures;
        d.purchasing_power_parity = +d.purchasing_power_parity;
        d.unemployment_rate = +d.unemployment_rate;
        d.distribution_of_family_income = +d.distribution_of_family_income;
        d.literacy_rate = +d.literacy_rate;
        
        literacyMarkers.push(
            L.circle([d.lattitude,d.longitude],{
            fillOpacity: 0.85,
            // color:"white",
            fillColor:"steelblue",
            radius: markerSize(d.literacy_rate)
            
        }).bindPopup("<h1>" + d.country + "</h1> <hr> <h3>Literacy Rate: " + d.literacy_rate + "</h3>").addTo(myMap)
        );

        unemploymentMarkers.push(
            L.circle([d.lattitude,d.longitude],{
            fillOpacity: 0.85,
            color:"pink",
            fillColor:"red",
            radius: markerSizeUnEmployment(d.unemployment_rate)
            
        }).bindPopup("<h1>" + d.country + "</h1> <hr> <h3>Unemployement Rate: " + d.unemployment_rate + "</h3>").addTo(myMap)
        ); 
    });    
});


//----------------------------------------------

// Create separate layer groups
var literacyGroup = L.layerGroup(literacyMarkers);
var unemployementGroup = L.layerGroup(unemploymentMarkers);
//----------------------------------------------

// Create an overlay object
var overlayMaps = {
    "Literary Rate": literacyGroup,
    "Unemployment Rate": unemployementGroup
};
//----------------------------------------------

// Define a map object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
    layers: [literacyGroup,unemployementGroup] 
});
//----------------------------------------------
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18, 
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  }).addTo(myMap); 

// Pass map layers into layer control
// Add the layer control to the map
L.control.layers(null,overlayMaps,{
    collapsed: true
}).addTo(myMap);




