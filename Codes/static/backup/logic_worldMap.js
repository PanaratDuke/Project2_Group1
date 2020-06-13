
var streetLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
var grayscaleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

var baseMaps = {
    "World Map": streetLayer,
    "Grayscale": grayscaleLayer
};

function markerSize(literacy_rate) {
    return literacy_rate * 1000;
}

function markerSizeUnEmployment(unemployment_rate) {
    return unemployment_rate * 5000;
}

function markerSizeppp(unemployment_rate) {
    return unemployment_rate / 10000000;
}

function markerSizeGini(unemployment_rate) {
    return unemployment_rate * 5000;
}
//###############################
// Variables : Factors
//###############################

var literacyMarkers = [];
var unemploymentMarkers = [];
var pppMarkers = [];
var giniIndexMarkers = [];

//###############################
// Variables : For Map
//###############################
var overlays;
var myMap;


var url = "http://localhost:5000/api/worldMapData/2008";

d3.json(url).then(data => {

    console.log("data : ", data);

    for (var i = 0; i < data.length; i++) {
        var country = data[i].country;
        var literacyRate = data[i].literacy_rate;
        var unemploymentRate = data[i].unemployment_rate;
        var ppp = data[i].purchasing_power_parity;
        // console.log("ppp = ",ppp);
        var giniIndex = data[i].distribution_of_family_income;
        // console.log("gini = ", giniIndex);

        // console.log("latitude : ", data[i].latitude);
        var location = [data[i].latitude, data[i].longitude];
        // console.log("location : ", location);
        literacyMarkers.push(
            L.circle(location,
                {
                    fillOpacity: 0.75,
                    color: "gray",
                    fillColor: "green",
                    radius: markerSize(literacyRate),
                    weight: 0.5
                }

            ).bindPopup(
                `<h1>  ${country} </h1> <hr> <h3>Literacy Rate: ${literacyRate} </h3>`));

        unemploymentMarkers.push(
            L.circle(location,
                {
                    fillOpacity: 0.75,
                    color: "gray",
                    fillColor: "red",
                    radius: markerSizeUnEmployment(unemploymentRate),
                    weight: 0.5
                }

            ).bindPopup(
                `<h1>  ${country} </h1> <hr> <h3>Unemployment Rate: ${unemploymentRate} </h3>`));

        pppMarkers.push(
            L.circle(location,
                {
                    fillOpacity: 0.75,
                    color: "gray",
                    fillColor: "blue",
                    radius: markerSizeppp(ppp),
                    weight: 0.5
                }

            ).bindPopup(
                `<h1>  ${country} </h1> <hr> <h3>Purchasing Power Parity : ${ppp} </h3>`));

        giniIndexMarkers.push(
            L.circle(location,
                {
                    fillOpacity: 0.75,
                    color: "gray",
                    fillColor: "purple",
                    radius: markerSizeGini(giniIndex),
                    weight: 0.5
                }

            ).bindPopup(
                `<h1>  ${country} </h1> <hr> <h3>Distribution of Family Incoome: ${giniIndex} </h3>`));


    };

    var literacyLayer = L.layerGroup(literacyMarkers);
    var unemploymentLayer = L.layerGroup(unemploymentMarkers);
    var pppLayer = L.layerGroup(pppMarkers);
    var giniIndexLayer = L.layerGroup(giniIndexMarkers);


    overlays = {
        "Literacy": literacyLayer,
        "Unemployment": unemploymentLayer,
        "Purchasing Power Parity": pppLayer,
        "Distribution of family Income": giniIndexLayer

    };
    myMap = L.map("map", {
        center: [25.0, 17.0], // latitude, longitude
        zoom: 2,
        layers: [streetLayer, literacyLayer]

    });

    L.control.layers(baseMaps, overlays, {
        collapsed: false
    }).addTo(myMap);
});