// Defined three variables in BaseMap
var satelliteLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
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

var outdoorsLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// Add variables into baseMaps
var baseMaps = {
    "Satellite": satelliteLayer,
    "Grayscale": grayscaleLayer,
    "Outdoors": outdoorsLayer
};

// read tectonicplates into the variable
var boundaries;
d3.json("PB2002_boundaries.json").then(data => {
    boundaries = L.geoJSON(data.features);
});

// Adjusted markers size
function markerSize(magnitude) {
    return (magnitude) * 2;
}

// Defined colors for markers
function getColor(d) {
    return d > 9 ? '#800026' :
        d > 7 ? '#BD0026' :
            d > 5 ? '#E31A1C' :
                d > 3 ? '#FC4E2A' :
                    d > 1 ? '#FED976' :
                        '#FFEDA0';
}

var literacy;
var overlays;
var myMap;
var queryUrl = "https://http://localhost:5000/api/worldMapData/2008";

// Read in earthquake data and assigned into variable for layer control
// Added markers (circle) 
// Added popup to markers
// Added earthquakes and boundaries variable into overlays 
// Added myMap
// Added basemap and overlays into layer control
// Added legend
d3.json(queryUrl).then(data => {
    literacy = L.geoJSON(data.features,
        {
            pointToLayer: ((feature, latlng) => (
                L.circleMarker(latlng,
                    {
                        radius: markerSize(feature.properties.mag),
                        color: "gray",
                        fillColor: getColor(feature.properties.mag),
                        fillOpacity: 0.8,
                        weight: 0.5
                    }
                )
            ))
        }).bindPopup(layer => (
            "Magnitude: " + layer.feature.properties.mag.toString() +
            "<br/>Location: " + layer.feature.properties.place
        ));

    overlays = {
        "Earthquakes": earthquakes,
        "Techtonic Plates": boundaries
    }

    myMap = L.map("map", {
        center: [31.44, -100.45], // latitude, longitude
        zoom: 4,
        layers: [outdoorsLayer, earthquakes]

    });

    L.control.layers(baseMaps, overlays, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        magnitudesLegend = [1, 3, 5, 7, 9];
        magnitudesLegend.forEach(m => {
            div.innerHTML +=
                '<i style="background:' + `${getColor(m)}` + '"></i> ' +
                (m - 1) + '&ndash;' + (m + 1) + '<br>';
        });
        return div;

    };
    legend.addTo(myMap);

})