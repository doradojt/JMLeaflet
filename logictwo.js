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
zoom: 12,
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

info.addTo(map);

var icons ={
    MAJOR_QUAKES: L.ExtraMarkers.icon({
        icon: "beer",
        iconColor: "red",
        markerColor: "white",
        shape:"circle"
    }),
    AVG_QUAKES: L.ExtraMarkers.icon({ 
        icon: "beer",
        iconColor: "blue",
        markerColor: "orange",
        shape: "penta"
    }),
    MINOR_QUAKES: L.ExtraMarkers.icon({
        icon: "beer",
        iconColor: "green",
        markerColor: "white",
        shape: "star"
    })
};

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(infoRes) { 
    var quakeTime = infoRes.features.time;
    var magnitude = infoRes.features.mag;
    var quakeTitle = infoRes.features.title;
    var coordinates = infoRes.geometry;

    var earthquakeCount ={
        MAJOR_QUAKES: 0,
        AVG_QUAKES: 0,
        MINOR_QUAKES: 0
    };

    var earthquakeStatusCode;

    for (var i = 0; i < magnitude.length; i++) {
        var quake = Object.assign({}, quakeTitle[i], magnitude[i], quakeTime[i]);

        if(quake.mag >= 6.00) {
            earthquakeStatusCode = "MAJOR_QUAKES";
        }
        else if (quake.mag < 6.00 && quake.mag >= 4.00) {
            earthquakeStatusCode = "AVG_QUAKES";
        }
        else {
            earthquakeStatusCode = "MINOR_QUAKES";
        }
        
        earthquakeCount[earthquakeStatusCode]++;

        var newMarker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {
            icon: icons[earthquakeStatusCode]
        });

        newMarker.addTo(layers[earthquakeStatusCode]);

        newMarker.bindPopup(features.title + "<br> Magnitude:" + features.mag + "<br> Type:" + features.type);
    }
        updateLegend(quakeTime, earthquakeCount);
});

function updateLegend(quakeTime, earthquakeCount) {
    document.querySelector(".legend").innerHTML = [
        "<p>Updated: " + MediaStreamErrorEvent.unix(time).format("h:mm:ss A") + "</p>", 
        "<p> class ='major-quakes'> Major Earthquakes: " + earthquakeCount.MAJOR_QUAKES + "</p>",
        "<p> class ='average-quakes'> Average Earthquakes: " + earthquakeCount.AVG_QUAKES + "</p>",
        "<p> class ='minor-quakes' > Minor Earthquakes: " + earthquakeCount.MINOR_QUAKES + "</p>"].join("");
    }
