// 1. Initialize map with simple coordinate system for custom images
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2
});

// 2. Define image bounds for your 4K floor plan layout
var bounds = [[0, 0], [4032, 3024]]; 

// 3. Add your floor plan image as an overlay
var image = L.imageOverlay('FirstFloor.png', bounds).addTo(map);

// 4. Fit map view to the image bounds
map.fitBounds(bounds);

// ==========================================
// 6. CLICK COORDINATE LOGGER
// ==========================================
map.on('click', function(e) {
    var lat = e.latlng.lat.toFixed(2);
    var lng = e.latlng.lng.toFixed(2);
    console.log(`Clicked Coordinates: [${lat}, ${lng}]`);
    
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`Coordinates: [${lat}, ${lng}]`)
        .openOn(map);
});