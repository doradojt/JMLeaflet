var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    minZoom: 3,
    id: "mapbox.dark",
    accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  minZoom: 3,
  id: "mapbox.light",
  accessToken: API_KEY
});

var layers = {
    MAJOR_QUAKES: new L.LayerGroup(),
    AVG_QUAKES: new L.LayerGroup(),
    COMMON_QUAKES: new L.LayerGroup()
};

var overlays = {
"Major Earthquakes": layers.MAJOR_QUAKES,
"Average Earthquakes": layers.AVG_QUAKES,
"Common Earthquakes": layers.COMMON_QUAKES
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
    COMMON_QUAKES: L.ExtraMarkers.icon({
        iconUrl: "greenbullseye.png"
        //iconColor: "green",
        //markerColor: "yellow",
        //shape: "star"
    })
};
function updateLegend(time, earthquakeCount) {
    document.querySelector(".legend").innerHTML = [ 
        "<hr> <id='legend-title'> LEGEND </hr>",
        "<p> <class ='major-quakes' id='major-quakes'> Earthquakes over 5.0: " + earthquakeCount.MAJOR_QUAKES + "</p>",
        "<p> <class ='avg-quakes' id ='avg-quakes'>  Earthquakes between 2.5 and 5.0: " + earthquakeCount.AVG_QUAKES + "</p>",
        "<p> <class ='common-quakes' id = 'common-quakes'>  Earthquakes under 2.5: " + earthquakeCount.COMMON_QUAKES + "</p>"].join("");
    }

    function getColor(d) {
        return d > 1.0 ? '#800026' :
               d > 2.0  ? '#BD0026' :
               d > 3.0  ? '#E31A1C' :
               d > 4.0  ? '#FC4E2A' :
               d > 5.0   ? '#FD8D3C' :
               d > 6.0   ? '#FEB24C' :
               d > 7.0   ? '#FED976' :
                          '#FFEDA0';
    }

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(infoRes) { 
    var quakeInfo = infoRes.features;
    var updatedAt = infoRes.metadata.generated;
    //console.log(quakeInfo)
    
    var coordinateinfo = infoRes.features;

    

    var earthquakeCount ={
        MAJOR_QUAKES: 0,
        AVG_QUAKES: 0,
        COMMON_QUAKES: 0
    };

    var earthquakeStatusCode;
    
    

    for (var i = 0; i < quakeInfo.length; i++) {
        quake = quakeInfo[i]
        coordinates = coordinateinfo[i].geometry

        var markerOptions = {
            radius: quakeInfo[i].properties.mag*6,
            fillColor: getColor(quakeInfo[i].properties.mag),
            color: '#636363',
            weight:1,
            fillOpacity:.6, 
    
        }
        //Originally was going off a traditional Earthquake scale but I wanted to highlight the multiple layers

        if(quake.properties.mag < 2.5) {
            earthquakeStatusCode = "COMMON_QUAKES";
            
            
        }
        else if (quake.properties.mag < 5.0 && quake.properties.mag  >= 2.5) {
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
        layers.COMMON_QUAKES,
        darkmap
    ]
    });


var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

L.control.layers(baseMaps,overlays,{collapsed: false}).addTo(map);
L.control.scale({position: "bottomleft"}).addTo(map);

var info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };

info.addTo(map);

