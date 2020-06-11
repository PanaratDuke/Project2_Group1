// Defined variable in basemap
var outdoorsLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
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

// Add Two layers into baseMap
var baseMap={
    "World Map": outdoorsLayer,
    "Light Map": grayscaleLayer
};

var chorophlet;
var url="http://localhost:5000/api/worldMapData/2008";
d3.json(url).then(data=>{
    
    // console.log("data=", data);
    // console.log("edu_exp_inner_loop=",edu_exp);
    for (var i = 0; i<data.length;i++){
        // console.log(data[i].latitude);
        var location = [`${data[i].latitude},${data[i].longitude}`];
        console.log("location : ",location);
        L.circle(location,{
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            // Adjust radius
            radius: countries[i].points * 1500
            }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);
    }
    


        


});
console.log("edu_exp2=", edu_exp)
