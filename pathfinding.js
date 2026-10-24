// Dictionary of pre-defined hallway paths (with corner nodes)
const hallwayPaths = {
    // Format: "StartName_DestinationName"
    "Front Gate_Room 101 (SHS)": [
        [111.36, 2586.00],  // 1. Front Gate
        [250.57, 2384.50],   // 2. Hallway corner turn 1
        [1671.96, 2432.00],  // 3. Hallway corner turn 2
        [1727.03, 2361.50],
        [1709.53, 2038.75],
        [1410.25, 1634.00],
        [1284.25, 472.00],
        [2085.99, 460.00],
        [2078.30, 254.00]   // 4. Room 101 (SHS)
    ],
    
    "Front Gate_Room 102 (SHS)": [
        [111.36, 2586.00],  // 1. Front Gate
        [111.36, 400.00],   // 2. Hallway corner turn 1
        [2320.31, 400.00],  // 3. Hallway corner turn 2
        [2320.31, 248.00]   // 4. Room 102 (SHS)
    ]
};



let currentRouteLine = null;

function calculateCustomRoute(destinationName, startName) {
    if (!startName) {
        alert("Please select where you are starting from!");
        return;
    }

    var startLocation = markerReferences[startName];
    var destLocation = markerReferences[destinationName];

    if (!startLocation || !destLocation) {
        alert("Could not find coordinates for the selected route.");
        return;
    }

    // Remove any previous route line from the map
    if (currentRouteLine) {
        map.removeLayer(currentRouteLine);
    }

    // Create a lookup key
    var routeKey = `${startName}_destinationName`;
    var reverseKey = `${destinationName}_${startName}`;

    let latlngs = [];

    // Check if we have pre-defined hallway corner nodes for this route
    if (hallwayPaths[routeKey]) {
        latlngs = hallwayPaths[routeKey];
    } else if (hallwayPaths[reverseKey]) {
        // If they chose the route in reverse, reverse the coordinate array!
        latlngs = [...hallwayPaths[reverseKey]].reverse();
    } else {
        // Fallback: Direct line if no hallway path is mapped yet
        latlngs = [
            startLocation.coords,
            destLocation.coords
        ];
    }

    // Draw the multi-point polyline route with corners
    currentRouteLine = L.polyline(latlngs, {
        color: '#3182ce',    // Clean blue path
        weight: 5,           // Thick line width
        opacity: 0.8,
        dashArray: '10, 10'  // Dashed walking path style
    }).addTo(map);

    // Zoom and pan the map to frame the full route
    map.fitBounds(currentRouteLine.getBounds(), {
        padding: [50, 50],
        maxZoom: 1
    });

    console.log(`Routing with corners from [${startName}] to [${destinationName}]`);
}