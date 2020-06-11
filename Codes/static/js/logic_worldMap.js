// Create a map object and add the default ones to the map:
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
    // layers: [literacy]
});
// Defined variable in basemap
// var outdoorsLayer = 
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);
// var grayscaleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/light-v10',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: API_KEY
// });

// Add Two layers into baseMap
// var baseMap={
//     "World Map": outdoorsLayer,
//     "Light Map": grayscaleLayer
// };
function markerSize(literacy_rate) {
    return literacy_rate * 1000;
}

function markerSizeUnEmployment(unemployment_rate) {
    return unemployment_rate * 5000;
}
var chorophlet;
var url = "http://localhost:5000/api/worldMapData/2008";
d3.json(url).then(data => {

    console.log("data : ", data);
    // console.log("edu_exp_inner_loop=",edu_exp);
    
    for (var i = 0; i < data.length; i++) {
        var country = data[i].country;
    var literacyRate = data[i].literacy_rate;
    var unemploymentRate = data[i].unemployment_rate;

        console.log("i : ", i);
        console.log("latitude : ", data[i].latitude);
        var location = [data[i].latitude,data[i].longitude];
        console.log("location : ", location);
        L.circle([data[i].latitude,data[i].longitude], {
            fillOpacity: 0.75,
            color: "gray",
            fillColor: "green",
            // Adjust radius
            radius: markerSize(data[i].literacy_rate),
            weight: 0.5
        }).bindPopup(`<h1>  ${country} </h1> <hr> <h3>Literacy Rate: ${literacyRate} </h3>`).addTo(myMap);
    }


});


// console.log("edu_exp2=", edu_exp)
