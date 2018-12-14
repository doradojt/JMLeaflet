var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    minZoom: 3,
    id: "mapbox.dark",
    accessToken: API_KEY
});

//   var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.dark",
//     accessToken: API_KEY
//   });

var layers = {
    MAJOR_QUAKES: new L.LayerGroup(),
    AVG_QUAKES: new L.LayerGroup(),
    MINOR_QUAKES: new L.LayerGroup()
};

var overlays = {
"Major Earthquakes": layers.MAJOR_QUAKES,
"Average Earthquakes": layers.AVG_QUAKES,
"Minor Earthquakes": layers.MINOR_QUAKES
};



var icons ={
    MAJOR_QUAKES: L.ExtraMarkers.icon({
        iconUrl: "Bullseye1.png"
        //iconColor: "white",
        //markerColor: "yellow",
        //shape: "star"
    }),
    AVG_QUAKES: L.ExtraMarkers.icon({ 
        iconUrl: 'yellowbull.png'
        //iconColor: "blue",
        //markerColor: "orange",
        //shape: "penta"
    }),
    MINOR_QUAKES: L.ExtraMarkers.icon({
        iconUrl: "greenbullseye.png"
        //iconColor: "green",
        //markerColor: "yellow",
        //shape: "star"
    })
};
function updateLegend(time, earthquakeCount) {
    document.querySelector(".legend").innerHTML = [ 
        "<p> <class ='major-quakes'> Major Earthquakes: " + earthquakeCount.MAJOR_QUAKES + "</p>",
        "<p> <class ='average-quakes'> Average Earthquakes: " + earthquakeCount.AVG_QUAKES + "</p>",
        "<p> <class ='minor-quakes' > Minor Earthquakes: " + earthquakeCount.MINOR_QUAKES + "</p>"].join("");
    }
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(infoRes) { 
    var quakeInfo = infoRes.features;
    var updatedAt = infoRes.metadata.generated;
    //console.log(quakeInfo)
    //var quakeTitle = infoRes.features.properties.title;
    var coordinateinfo = infoRes.features;

    //var magscale = quakeInfo[0].properties.mag;

    var earthquakeCount ={
        MAJOR_QUAKES: 0,
        AVG_QUAKES: 0,
        MINOR_QUAKES: 0
    };

    var earthquakeStatusCode;
    //problem with this forloop
    

    for (var i = 0; i < quakeInfo.length; i++) {
        quake = quakeInfo[i]
        coordinates = coordinateinfo[i].geometry

        var markerOptions = {
            radius: quakeInfo[i].properties.mag*5,
            fillColor:"#708598",
            color:"#537898",
            weight:1,
            fillOpacity:.6, 
    
        }
        //var quake = Object.assign({}, quakeInfo[i], coordinates[i]);

        if(quake.properties.mag < 3.5) {
            earthquakeStatusCode = "MINOR_QUAKES";
            
        }
        else if (quake.properties.mag < 3.5 < 6.00 && quake.properties.mag < 3.5 >= 4.00) {
            earthquakeStatusCode = "AVG_QUAKES";

        }
        else {
            earthquakeStatusCode = "MAJOR_QUAKES";
        }
        
        earthquakeCount[earthquakeStatusCode]++;

        var newMarker = L.circleMarker([coordinates.coordinates[1], coordinates.coordinates[0]], markerOptions, {
            icon: icons[earthquakeStatusCode]
        });

        newMarker.addTo(layers[earthquakeStatusCode]);

        newMarker.bindPopup(quake.properties.title + "<br> Magnitude:" + quake.properties.mag + "<br> Type:" + quake.properties.type);
    }
        updateLegend(updatedAt, earthquakeCount);
});

var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 6,
    layers: [
        layers.MAJOR_QUAKES,
        layers.AVG_QUAKES,
        layers.MINOR_QUAKES
    ]
    });

darkmap.addTo(map);
L.control.layers(null,overlays).addTo(map);

var info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };

info.addTo(map);

