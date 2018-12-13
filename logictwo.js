var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
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

var map = L.map("map", {
center: [37.09, -95.71],
zoom: 6,
layers: [
    layers.MAJOR_QUAKES,
    layers.AVG_QUAKES,
    layers.MINOR_QUAKES
]
});

streetmap.addTo(map);

var overlays = {
"Major Earthquakes": layers.MAJOR_QUAKES,
"Average Earthquakes": layers.AVG_QUAKES,
"Minor Earthquakes": layers.MINOR_QUAKES
};

L.control.layers(null,overlays).addTo(map);

var info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };

info.addTo(map);

var icons ={
    MAJOR_QUAKES: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "yellow",
        shape: "star"
    }),
    AVG_QUAKES: L.ExtraMarkers.icon({ 
        iconUrl: 'yellowbull.png',
        iconColor: "blue",
        markerColor: "orange",
        shape: "penta"
    }),
    MINOR_QUAKES: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "green",
        markerColor: "yellow",
        shape: "star"
    })
};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(infoRes) { 
    var quakeInfo = infoRes.features;
    var updatedAt = infoRes.metadata.generated;
    //var quakeTitle = infoRes.features.properties.title;
    var coordinates = infoRes.features.geometry;

    var earthquakeCount ={
        MAJOR_QUAKES: 0,
        AVG_QUAKES: 0,
        MINOR_QUAKES: 0
    };

    var earthquakeStatusCode;
    //problem with this forloop
    

    for (var i = 0; i < quakeInfo.length; i++) {
        var quake = Object.assign({}, quakeInfo[i], coordinates[i]);

        if(quake.feature.properties.mag < 3.5) {
            earthquakeStatusCode = "MINOR_QUAKES";
        }
        else if (quake.feature.properties.mag < 3.5 < 6.00 && quake.feature.properties.mag < 3.5 >= 4.00) {
            earthquakeStatusCode = "AVG_QUAKES";
        }
        else {
            earthquakeStatusCode = "MAJOR_QUAKES";
        }
        
        earthquakeCount[earthquakeStatusCode]++;

        var newMarker = L.marker([coordinates.coordinates[1], coordinates.coordinates[0]], {
            icon: icons[earthquakeStatusCode]
        });

        newMarker.addTo(layers[earthquakeStatusCode]);

        newMarker.bindPopup(properties.title + "<br> Magnitude:" + properties.mag + "<br> Type:" + properties.type);
    }
        updateLegend(updatedAt, earthquakeCount);
});

function updateLegend(time, earthquakeCount) {
    document.querySelector(".legend").innerHTML = [
        "<p>Updated: " + MediaStreamErrorEvent.unix(time).format("h:mm:ss A") + "</p>", 
        "<p> class ='major-quakes'> Major Earthquakes: " + earthquakeCount.MAJOR_QUAKES + "</p>",
        "<p> class ='average-quakes'> Average Earthquakes: " + earthquakeCount.AVG_QUAKES + "</p>",
        "<p> class ='minor-quakes' > Minor Earthquakes: " + earthquakeCount.MINOR_QUAKES + "</p>"].join("");
    }
