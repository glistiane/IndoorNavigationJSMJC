// Group everything neatly into categories in one file
const markerReferences = {};

const campusData = {
    shsRooms: [
        { 
            name: "Room 101 (SHS)", 
            coords: [2078.30, 254.00], 
            type: "room", 
            description: "Main Computer Laboratory - PC Units 1-40" 
        },
        { 
            name: "Room 102 (SHS)", 
            coords: [2320.31, 248.00], 
            type: "room", 
            description: "Research Advisers & Department Heads" 
        }
    ],
    // INSERTION 1: Add your JHS Rooms array right here!
    jhsRooms: [
        { 
            name: "Room 201 (JHS)", 
            coords: [1594.18, 2236.00], 
            type: "room", 
            description: "Junior High School Classroom" 
        }
    ],
    facilities: [
        { 
            name: "SHS Registrar", 
            coords: [1712.29, 230.00], 
            type: "facility", 
            description: "Ground floor comfort rooms" 
        },
        { 
            name: "SHS Canteen", 
            coords: [2556.05, 454.00], 
            type: "facility", 
            description: "Senior high school Student dining and food area" 
        }
    ],
    landmarks: [
        { 
            name: "Front Gate", 
            coords: [111.36, 2586.00], 
            type: "landmark", 
            description: "Gate 1 - Main Gate entry point" 
        },
        { 
            name: "Back Gate", 
            coords: [3064.20, 2648.00], 
            type: "landmark", 
            description: "Gate 2 - Back Gate entry point" 
        }
    ]
};

// Function to render all data onto the map
function renderAllMarkers() {
    // INSERTION 2: Make sure to include ...campusData.jhsRooms in the combined list!
    const allLocations = [
        ...campusData.shsRooms,
        ...campusData.jhsRooms, 
        ...campusData.facilities, 
        ...campusData.landmarks
    ];

    const dataList = document.getElementById('room-options');
    if (dataList) dataList.innerHTML = ''; // Clear previous options to prevent duplicates

    allLocations.forEach(item => {
        // Pick an emoji or style based on the type
        let iconSymbol = "📍";
        if (item.type === "facility") iconSymbol = "📍";
        if (item.type === "landmark") iconSymbol = "❎";
        if (item.type === "room") iconSymbol = "🚪";

        var textIcon = L.divIcon({
            className: `room-label`,
            html: `<span>${iconSymbol} ${item.name}</span>`,
            iconSize: [120, 20],
            iconAnchor: [60, 10]
        });

        var marker = L.marker(item.coords, { icon: textIcon }).addTo(map);

        // Build a string of all options for the starting point dropdown
        let roomOptionsHTML = allLocations.map(loc => `<option value="${loc.name}">${loc.name}</option>`).join('');

        marker.bindPopup(`
            <div style="font-family: sans-serif; min-width: 200px;">
                <h3 style="margin: 0 0 5px 0; color: #1a365d;">${item.name}</h3>
                <p style="margin: 0 0 8px 0; font-size: 13px;">${item.description}</p>
                
                <div style="margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                    <label style="font-size: 11px; font-weight: bold; color: #4a5568;">📍 Starting From:</label>
                    <select id="start-select-${item.name.replace(/[^a-zA-Z0-9]/g, '')}" style="width: 100%; margin: 4px 0 8px 0; padding: 4px; font-size: 12px; border: 1px solid #cbd5e0; border-radius: 4px;">
                        ${roomOptionsHTML}
                    </select>
                    <button onclick="calculateCustomRoute('${item.name}', document.getElementById('start-select-${item.name.replace(/[^a-zA-Z0-9]/g, '')}').value)" style="background: #3182ce; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold; font-size: 12px;">Get Directions</button>
                </div>
            </div>
        `);

        // 1. SAVE THE MARKER REFERENCE HERE
        markerReferences[item.name] = { marker: marker, coords: item.coords };

        // 2. ADD TO DATALIST ONCE PER ITEM
        if (dataList) {
            var option = document.createElement('option');
            option.value = item.name;
            dataList.appendChild(option);
        }
    });

    // Handle search dropdown selection
    const searchInput = document.getElementById('room-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            var typedName = e.target.value;
            
            // Check if the typed text matches a real room
            var targetData = markerReferences[typedName];
            if (targetData) {
                map.setView(targetData.coords, 0, {
                    animate: true,
                    duration: 0.8
                });
                targetData.marker.openPopup();
            }
        });
    }
}

// Run the function once the script loads
renderAllMarkers();

// Keep track of the user's chosen starting point from the modal menu
let selectedStartLocation = "Front Gate"; // Default fallback start point

function showCategory(categoryKey) {
    // Update active tab buttons safely
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // If triggered by a button click, highlight that button
    if (typeof event !== 'undefined' && event && event.target && event.target.classList) {
        event.target.classList.add('active');
    } else {
        // Fallback: highlight the first tab button matching the categoryKey
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(categoryKey)) {
                btn.classList.add('active');
            }
        });
    }

    const grid = document.getElementById('location-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let items = [];
    if (categoryKey === 'shsRooms') items = campusData.shsRooms;
    if (categoryKey === 'jhsRooms') items = campusData.jhsRooms;
    if (categoryKey === 'facilities') items = campusData.facilities;
    if (categoryKey === 'landmarks') items = campusData.landmarks;

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'location-card';

        const imgHTML = item.image 
            ? `<img src="${item.image}" class="card-img-placeholder" alt="${item.name}">`
            : `<div class="card-img-placeholder">📷 Photo Coming Soon</div>`;

        card.innerHTML = `
            ${imgHTML}
            <div class="card-body">
                <h4 class="card-title">${item.name}</h4>
                <p class="card-desc">${item.description}</p>
                <div style="display: flex; gap: 6px; margin-top: auto;">
                    <button class="card-btn" style="background: #4a5568; flex: 1;" onclick="setCustomStart('${item.name}')">Set Start</button>
                    <button class="card-btn" style="background: #3182ce; flex: 1;" onclick="navigateFromModal('${item.name}')">Navigate</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Triggered when clicking "Set Start" on any modal card
function setCustomStart(name) {
    selectedStartLocation = name;
    alert(`Starting point set to: ${name}. Now choose a destination to navigate!`);
}

// Triggered when clicking "Navigate" on any modal card
function navigateFromModal(destinationName) {
    const modal = document.getElementById('location-modal');
    if (modal) modal.style.display = 'none';

    if (typeof calculateCustomRoute === 'function') {
        calculateCustomRoute(destinationName, selectedStartLocation);
    } else {
        var targetData = markerReferences[destinationName];
        if (targetData) {
            map.setView(targetData.coords, 0, { animate: true, duration: 0.8 });
            targetData.marker.openPopup();
        }
    }
}

// --- MODAL OPEN/CLOSE & INITIAL LOAD LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('location-modal');
    const openBtn = document.getElementById('open-menu-btn');
    const closeBtn = document.getElementById('close-modal-btn');

    if (openBtn && modal) {
        openBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
            showCategory('shsRooms'); // Automatically load SHS rooms when opened
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal if user clicks outside the white box area
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});