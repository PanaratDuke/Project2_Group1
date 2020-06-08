
// blank out map so it can be replace if needed.
var container = L.DomUtil.get('map'); if(container != null){ container._leaflet_id = null; }

// Initialize all of the LayerGroups we'll be using
var layers = {
    LITERACY: new L.LayerGroup(),
    UNEMPLOYMENT: new L.LayerGroup()
};

// Create a map object with layers
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3,
    layers: [
        layers.LITERACY,
        layers.UNEMPLOYMENT
    ]
});

// Create an overlays object to add to the layer control
var overlays={
    "Literacy": layers.LITERACY,
    "Unemployment": layers.UNEMPLOYMENT
};

// Create a control for the layers, add overlay layers to it
L.control.layers(null, overlays).addTo(myMap);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18, 
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  }).addTo(myMap);  


function markerSize(literacy_rate){
    return literacy_rate * 1000;
}

function markerSizeUnEmployment(unemployment_rate){
    return unemployment_rate * 5000;
};

var literacy;
var Unemployement;
var circleStatus;

var circleCount = {
    LITERACY:0,
    UNEMPLOYMENT:0
};

d3.csv("static/data/world_map_data.csv",function(worldData){
    console.log("worldData : ", worldData)
    console.log("worldData.country :", d3.entries(worldData))

    worldData.forEach(function(d){
        d.country = d.country;
        d.longitude = +d.longitude;
        d.lattitude = +d.lattitude;
        d.education_expenditures = +d.education_expenditures;
        d.purchasing_power_parity = +d.purchasing_power_parity;
        d.unemployment_rate = +d.unemployment_rate;
        d.distribution_of_family_income = +d.distribution_of_family_income;
        d.literacy_rate = +d.literacy_rate;

        literacy = d.literacy_rate;
        // console.log("d.literacy_rate :", d.literacy_rate);

        
        var circles = {
            LITERACY: L.circle([d.lattitude,d.longitude],{
                fillOpacity: 0.85,
                // color:"white",
                fillColor:"steelblue",
                radius: markerSize(d.literacy_rate)
                
            }).bindPopup("<h1>" + d.country + "</h1> <hr> <h3>Literacy Rate: " + d.literacy_rate + "</h3>").addTo(myMap);
        
            UNEMPLOYMENT: L.circle([d.lattitude,d.longitude],{
                fillOpacity: 0.85,
                color:"pink",
                fillColor:"red",
                radius: markerSizeUnEmployment(d.unemployment_rate)
                
            }).bindPopup("<h1>" + d.country + "</h1> <hr> <h3>Unemployement Rate: " + d.unemployment_rate + "</h3>").addTo(myMap);
        
        };   
        
        for (var i=0; i<d.length; i++){
            if (d.literacy_rate != null){
                circleStatus = "LITERACY";
            }
            else if (d.unemployment_rate != null){
                circleStatus = "UNEMPLOYMENT";
            }
        };
        var newCircle = L.circle([d.lattitude,d.longitude],{

        });

        newCircle.addTo(layers[circleStatus]);


    });
    
    
});
