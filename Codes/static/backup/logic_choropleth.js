var geojson;
var info = L.control();
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
}

function getColor(d){
    return d > 8 ? '#800026' :
           d > 7  ? '#BD0026' :
           d > 6  ? '#E31A1C' :
           d > 5  ? '#FC4E2A' :
           d > 4  ? '#FD8D3C' :
           d > 3  ? '#FEB24C' :
           d > 1  ? '#FED976' :
                    '#FFEDA0';

}

function style(feature){
    return{
        fillColor: getColor(feature.properties.Edu_Exp),
        weight:2,
        opacity:1,
        color:'lightgray',
        dashArray:'1',
        fillOpacity: 0.7


    };
}

function highlightFeature(e){
    var layer = e.target;

    layer.setStyle({
        weight:5,
        color: '#666',
        dashArray:'',
        fillOpacity:0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){
        layer.bringToFront();
    }
    console.log("layer.feature=",layer.feature.properties);
    info.update(layer.feature.properties);
}

function resetHighlight(e){
    geojson.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}



info.onAdd = function(myMap){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function(props){
    this._div.innerHTML = '<h4>World Education Expenditures</h4>' +  (props ?
        '<b>' + props.ADMIN + '</b><br /><hr>' + props.Edu_Exp + ' % of GDP'
        : 'Hover over a state');
};

info.addTo(myMap);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        rates = [0, 1, 3, 4, 5, 6, 7, 8],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < rates.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(rates[i] + 1) + '"></i> ' +
            rates[i] + (rates[i + 1] ? '&ndash;' + rates[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


d3.json('static/data/updated_countries.geojson').then(function(countryData){
    geojson = L.geoJson(countryData,{
        style: style,
        onEachFeature: onEachFeature
    }).addTo(myMap);
    // console.log("Country Data in geoJson: ",countryData);
});

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

        literacy=d.literacy_rate;
        // console.log("d.literacy_rate :", d.literacy_rate);

        L.circle([d.lattitude,d.longitude],{
            fillOpacity: 0.85,
            // color:"white",
            fillColor:"steelblue",
            radius: markerSize(d.literacy_rate)
            
        }).bindPopup("<h1>" + d.country + "</h1> <hr> <h3>Literacy Rate: " + d.literacy_rate + "</h3>").addTo(myMap);

        L.circle([d.lattitude,d.longitude],{
            fillOpacity: 0.85,
            color:"pink",
            fillColor:"red",
            radius: markerSizeUnEmployment(d.unemployment_rate)
            
        }).bindPopup("<h1>" + d.country + "</h1> <hr> <h3>Unemployement Rate: " + d.unemployment_rate + "</h3>").addTo(myMap);

    });
    
    
});
