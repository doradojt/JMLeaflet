var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var queryUrlTwo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
d3.json(queryUrl, function(response) {
  
  createFeatures(response.features);
  //Trying to actually get a circle that is sized to the magnitude
  // var markers = L.markerClusterGroup();

  // for (var i =0; i < response.length; i++) {
    
  //   var location = response[i].geometry;

  //   if (location) {
  //     L.circle(geometry.coordinates, {
  //       fillOpacity: .75,
  //       color: "white",
  //       fillcolor: "red",
  //       radius: markerSize(response[i].properties.mag)})
  //       .bindPopup("<h1>" + response[i].properties.place + "</h1>");
  //   }
  // }

  // myMap.addLayer(markers);
});

d3.json(queryUrlTwo, function(response) {
  createFeaturesTwo(response.features);

});



function createFeatures(earthquakeData) {
    
  function onEachFeature(feature, layer) {
       layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time)+ "</p>");
  }

   var earthquakes = L.geoJSON(earthquakeData, {
       onEachFeature: onEachFeature
   });

   createMap(earthquakes);
}

// function markerSize(magnitude) {
//   return magnitude / .5;
// }

function createFeaturesTwo(earthquakeDataTwo) {
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time)+ "</p>");
  }
  var earthquakestwo = L.geoJSON(earthquakeDataTwo, {
    onEachFeature: onEachFeature
});

createMap(earthquakestwo);
}

function createMap(earthquakes, earthquakestwo) {

  // Create the tile layer that will be the background of our map
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Major Earthquakes": earthquakestwo
  };

  // Create the map object with options
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 10,
    layers: [streetmap, earthquakes]
  });

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// function createMarkers(response) {

//   // Pull the "stations" property off of response.date
//   var test = response.features;

//   // Initialize an array to hold bike markers
//   var quakeMarkers = [];

//   // Loop through the stations array
//   for (var i = 0; i < test.length; i++) {
//     var quakeMark = test.geometry[i];
//     var quakeProp = test.properties[i];

//     // For each station, create a marker and bind a popup with the station's name
//     var quakeMarker = L.marker([quakeMark.coordinates[1],  quakeMark.coordinates[0]]).bindPopup("<h3>" + quakeProp.place + "</h3><h3> Magnitude:" + quakeProp.mag + "</h3>");


//     // Add the marker to the bikeMarkers array
   
//     quakeMarkers.push(quakeMarker);
//   }

//   // Create a layer group made from the bike markers array, pass it into the createMap function
  
//   createMap(L.layerGroup(quakeMarkers));
// }


// // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
//d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", createMarkers);




