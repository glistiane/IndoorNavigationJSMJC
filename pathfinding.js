// Dictionary of pre-defined hallway paths (with corner nodes)
const hallwayPaths = {
    // Format: "StartName_DestinationName"
    "Front Gate_Room 101 (SHS)": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],   // 2. Hallway corner turn 1
        [1749.03, 2444.50],  // 3. Hallway corner turn 2
        [1763.10, 2115.00],
        [1708.09, 2059.00],
        [1716.02, 2003.00],
        [1456.27, 1708.00],
        [1331.03, 450.50],
        [2107.88, 456.00],
        [2078.30, 254.00]   // 4. Room 101 (SHS)
    ],
    
    "Front Gate_Room 102 (SHS)": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],   // 2. Hallway corner turn 1
        [1749.03, 2444.50],  // 3. Hallway corner turn 2
        [1763.10, 2115.00],
        [1708.09, 2059.00],
        [1716.02, 2003.00],
        [1456.27, 1708.00],
        [1331.03, 450.50],
        [2370.97, 450.00],
        [2375.03, 241.00]  // 4. Room 102 (SHS)
    ],

     "Front Gate_SHS Registrar": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],   // 2. Hallway corner turn 1
        [1749.03, 2444.50],  // 3. Hallway corner turn 2
        [1763.10, 2115.00],
        [1708.09, 2059.00],
        [1716.02, 2003.00],
        [1456.27, 1708.00],
        [1331.03, 450.50],
         [1751.06, 457.00],
        [1766.09, 236.00]  // 4. Room 102 (SHS)
    ],

    "Front Gate_SHS Canteen": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],   // 2. Hallway corner turn 1
        [1749.03, 2444.50],  // 3. Hallway corner turn 2
        [1763.10, 2115.00],
        [1708.09, 2059.00],
        [1716.02, 2003.00],
        [1456.27, 1708.00],
        [1331.03, 450.50],
        [2556.05, 454.00]  // 4. Room 102 (SHS)
    ],

    "Front Gate_Stage": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],   // 2. Hallway corner turn 1
        [1749.03, 2444.50],  // 3. Hallway corner turn 2
        [1763.10, 2115.00],
        [1708.09, 2059.00],
        [1716.02, 2003.00],
        [1884.44, 1814.00],
        [1869.06, 1694.00],
        [1764.23, 1342.00]
        
    ],

    "Front Gate_Clinic": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],
        [1749.03, 2444.50],   // 2. Hallway corner turn 1
        [1792.55, 2277.00],
        [1956.03, 2256.50],
        [1963.16, 2386.00]
        
    ],

    "Front Gate_School Supplies": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],
        [1749.03, 2444.50],   // 2. Hallway corner turn 1
        [1792.55, 2277.00],
        [2203.96, 2279.00],
        [2212.34, 2408.00]
        
    ],

    "Front Gate_JHS Canteen": [
        [111.36, 2586.00],  // 1. Front Gate
        [222.14, 2457.00],
        [1749.03, 2444.50],   // 2. Hallway corner turn 1
        [1792.55, 2277.00],
        [2604.26, 2220.00]
        
    ],

    "Front Gate_Covered Court": [
        [111.36, 2586.00],
        [2527.05, 2626.50],
        [2539.15, 2804.00]
        
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