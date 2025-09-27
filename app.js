// Application State
let map;
let busMarkers = {};
let routeLayers = {};
let selectedBus = null;
let currentLanguage = 'en';
let searchTimeout;
let userLocation = null;
let occupancyInterval = null;

// Bus Data
const busData = {
    'AC101': {
        route: 'AC-101',
        destination: 'Golden Temple → Railway Station',
        status: 'running',
        position: [31.6340, 74.8723],
        eta: '5 mins',
        stops: ['Golden Temple', 'Hall Gate', 'Ghanta Ghar', 'Bus Stand', 'Railway Station'],
        routeCoords: [
            [31.6340, 74.8723], [31.6298, 74.8756], [31.6256, 74.8789], [31.6214, 74.8823], [31.6172, 74.8856]
        ]
    },
    'AC102': {
        route: 'AC-102',
        destination: 'Mall Road → Guru Nanak Dev University',
        status: 'running',
        position: [31.6167, 74.8723],
        eta: '8 mins',
        stops: ['Mall Road', 'Company Bagh', 'Civil Lines', 'Putlighar', 'GNDU'],
        routeCoords: [
            [31.6167, 74.8723], [31.6189, 74.8756], [31.6211, 74.8789], [31.6233, 74.8823], [31.6255, 74.8856]
        ]
    },
    'AC103': {
        route: 'AC-103',
        destination: 'Airport → City Center',
        status: 'delayed',
        position: [31.7090, 74.7973],
        eta: '12 mins',
        stops: ['Airport', 'Bypass Road', 'Medical College', 'Clock Tower', 'City Center'],
        routeCoords: [
            [31.7090, 74.7973], [31.6890, 74.8173], [31.6690, 74.8373], [31.6490, 74.8573], [31.6290, 74.8773]
        ]
    },
    'AC104': {
        route: 'AC-104',
        destination: 'Cantonment → Ranjit Avenue',
        status: 'running',
        position: [31.6400, 74.8600],
        eta: '6 mins',
        stops: ['Cantonment', 'Lawrence Road', 'Civil Hospital', 'District Courts', 'Ranjit Avenue'],
        routeCoords: [
            [31.6400, 74.8600], [31.6350, 74.8650], [31.6300, 74.8700], [31.6250, 74.8750], [31.6200, 74.8800]
        ]
    },
    'AC105': {
        route: 'AC-105',
        destination: 'Bus Stand → Green Avenue',
        status: 'running',
        position: [31.6100, 74.8900],
        eta: '3 mins',
        stops: ['Bus Stand', 'Novelty Bridge', 'Majitha Road', 'C Block', 'Green Avenue'],
        routeCoords: [
            [31.6100, 74.8900], [31.6150, 74.8850], [31.6200, 74.8800], [31.6250, 74.8750], [31.6300, 74.8700]
        ]
    },
    'ORD201': {
        route: 'ORD-201',
        destination: 'Chheharta → Amritsar Junction',
        status: 'running',
        position: [31.6800, 74.8400],
        eta: '10 mins',
        stops: ['Chheharta', 'Guru Bazaar', 'Katra Jaimal Singh', 'Town Hall', 'Railway Station'],
        routeCoords: [
            [31.6800, 74.8400], [31.6700, 74.8500], [31.6600, 74.8600], [31.6500, 74.8700], [31.6400, 74.8800]
        ]
    },
    'ORD202': {
        route: 'ORD-202',
        destination: 'Islamabad → Medical College',
        status: 'stopped',
        position: [31.5900, 74.9100],
        eta: '15 mins',
        stops: ['Islamabad', 'GT Road', 'Guru Teg Bahadur Hospital', 'Medical College'],
        routeCoords: [
            [31.5900, 74.9100], [31.6000, 74.9000], [31.6100, 74.8900], [31.6200, 74.8800]
        ]
    },
    'ORD203': {
        route: 'ORD-203',
        destination: 'Jandiala → Beas River',
        status: 'running',
        position: [31.5500, 74.9500],
        eta: '20 mins',
        stops: ['Jandiala', 'Lopoke', 'Rayya', 'Mehta', 'Beas River'],
        routeCoords: [
            [31.5500, 74.9500], [31.5600, 74.9400], [31.5700, 74.9300], [31.5800, 74.9200], [31.5900, 74.9100]
        ]
    },
    'EXP301': {
        route: 'EXP-301',
        destination: 'Tarn Taran → Amritsar Express',
        status: 'running',
        position: [31.4500, 74.9300],
        eta: '25 mins',
        stops: ['Tarn Taran', 'Patti', 'Khadoor Sahib', 'Goindwal', 'Amritsar'],
        routeCoords: [
            [31.4500, 74.9300], [31.5000, 74.9200], [31.5500, 74.9100], [31.6000, 74.9000], [31.6340, 74.8723]
        ]
    },
    'EXP302': {
        route: 'EXP-302',
        destination: 'Batala → Golden Temple Express',
        status: 'delayed',
        position: [31.8200, 75.2100],
        eta: '35 mins',
        stops: ['Batala', 'Fatehgarh Churian', 'Dera Baba Nanak', 'Kala Afghana', 'Golden Temple'],
        routeCoords: [
            [31.8200, 75.2100], [31.7800, 75.1500], [31.7400, 75.0900], [31.7000, 75.0300], [31.6340, 74.8723]
        ]
    }
};

// Language translations
const translations = {
    en: {
        subtitle: 'Real-time Bus Tracking System',
        searchPlaceholder: 'Search buses by route number or destination...',
        findNearby: 'Find Nearby',
        centerMap: 'Center Map',
        toggleRoutes: 'Show All Routes',
        availableBuses: 'Available Buses',
        running: 'Running',
        delayed: 'Delayed',
        stopped: 'Stopped',
        routeInfo: 'Route Information',
        selectRoute: 'Select a bus to view route details',
        setAlert: 'Set Alert',
        addFavorite: 'Add to Favorites',
        alerts: 'Service Alerts',
        emergency: 'Emergency Services',
        emergencySubtitle: '24/7 Support Available',
        emergencyHelpline: 'Emergency Helpline',
        medical: 'Medical Emergency',
        police: 'Police',
        fire: 'Fire Department',
        reportIncident: 'Report Incident',
        requestAssistance: 'Request Assistance',
        highContrast: 'High Contrast',
        lowData: 'Low Data Mode',
        occupancy: 'Occupancy',
        eta: 'ETA',
        status: 'Status',
        stops: 'Stops',
        selectStop: 'Select a stop',
        notifyBefore: 'Notify me',
        minutesBefore: 'minutes before',
        alertSet: 'Alert set! You\'ll be notified {{time}} minutes before {{route}} reaches {{stopName}}.',
        locationError: 'Unable to get your location. Please check your browser settings.',
        geolocationNotSupported: 'Geolocation is not supported by this browser.',
        foundNearbyBuses: 'Found {{count}} nearby buses. Showing closest: {{route}}',
        noNearbyBuses: 'No buses found within 2km of your location.',
        showAllRoutes: 'Show All Routes',
        hideAllRoutes: 'Hide All Routes',
        normalContrast: 'Normal Contrast',
        normalMode: 'Normal Mode',
        pleaseSelectStop: 'Please select a stop.',
        gettingLocation: 'Getting location...',
        yourLocation: 'Your Location',
        incidentReported: 'Emergency incident reporting feature activated. Help is on the way!',
        assistanceRequested: 'Emergency assistance has been requested. Please stay calm and wait for help.'
    },
    pa: {
        subtitle: 'ਰੀਅਲ-ਟਾਈਮ ਬਸ ਟਰੈਕਿੰਗ ਸਿਸਟਮ',
        searchPlaceholder: 'ਰੂਟ ਨੰਬਰ ਜਾਂ ਮੰਜ਼ਿਲ ਦੁਆਰਾ ਬੱਸਾਂ ਦੀ ਖੋਜ ਕਰੋ...',
        findNearby: 'ਨਜ਼ਦੀਕੀ ਲੱਭੋ',
        centerMap: 'ਕੇਂਦਰ ਨਕਸ਼ਾ',
        toggleRoutes: 'ਸਾਰੇ ਰੂਟ ਦਿਖਾਓ',
        availableBuses: 'ਉਪਲਬਧ ਬੱਸਾਂ',
        running: 'ਚੱਲ ਰਹੀ',
        delayed: 'ਦੇਰੀ',
        stopped: 'ਰੁਕੀ ਹੋਈ',
        routeInfo: 'ਰੂਟ ਜਾਣਕਾਰੀ',
        emergency: 'ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ',
        emergencySubtitle: '24/7 ਸਹਾਇਤਾ ਉਪਲਬਧ',
        occupancy: 'ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ',
        eta: 'ਅਨੁਮਾਨਿਤ ਸਮਾਂ',
        status: 'ਸਥਿਤੀ',
        stops: 'ਸਟਾਪਸ',
        selectStop: 'ਇੱਕ ਸਟਾਪ ਚੁਣੋ',
        notifyBefore: 'ਮੈਨੂੰ ਸੂਚਿਤ ਕਰੋ',
        minutesBefore: 'ਮਿੰਟ ਪਹਿਲਾਂ',
        alertSet: 'ਅਲਰਟ ਸੈੱਟ ਕੀਤਾ ਗਿਆ! ਤੁਹਾਨੂੰ {{route}} ਦੇ {{stopName}} ਪਹੁੰਚਣ ਤੋਂ {{time}} ਮਿੰਟ ਪਹਿਲਾਂ ਸੂਚਿਤ ਕੀਤਾ ਜਾਵੇਗਾ।',
        locationError: 'ਤੁਹਾਡਾ ਟਿਕਾਣਾ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀਆਂ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।',
        geolocationNotSupported: 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਦੁਆਰਾ ਭੂ-ਸਥਾਨ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।',
        foundNearbyBuses: '{{count}} ਨਜ਼ਦੀਕੀ ਬੱਸਾਂ ਮਿਲੀਆਂ। ਸਭ ਤੋਂ ਨਜ਼ਦੀਕੀ ਦਿਖਾ ਰਿਹਾ ਹੈ: {{route}}',
        noNearbyBuses: 'ਤੁਹਾਡੇ ਟਿਕਾਣੇ ਦੇ 2 ਕਿਲੋਮੀਟਰ ਦੇ ਅੰਦਰ ਕੋਈ ਬੱਸ ਨਹੀਂ ਮਿਲੀ।',
        showAllRoutes: 'ਸਾਰੇ ਰੂਟ ਦਿਖਾਓ',
        hideAllRoutes: 'ਸਾਰੇ ਰੂਟ ਲੁਕਾਓ',
        normalContrast: 'ਸਧਾਰਨ ਕੰਟ੍ਰਾਸਟ',
        normalMode: 'ਸਧਾਰਨ ਮੋਡ',
        pleaseSelectStop: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਸਟਾਪ ਚੁਣੋ।',
        gettingLocation: 'ਟਿਕਾਣਾ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀਆਂ ਬ੍ਰਾਉਜ਼ਰ ਸੈਟਿੰਗਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।',
        yourLocation: 'ਤੁਹਾਡਾ ਟਿਕਾਣਾ',
        incidentReported: 'ਐਮਰਜੈਂਸੀ ਘਟਨਾ ਦੀ ਰਿਪੋਰਟਿੰਗ ਵਿਸ਼ੇਸ਼ਤਾ ਕਿਰਿਆਸ਼ੀਲ ਹੋ ਗਈ ਹੈ। ਮਦਦ ਆ ਰਹੀ ਹੈ!',
        assistanceRequested: 'ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ ਦੀ ਬੇਨਤੀ ਕੀਤੀ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਮਦਦ ਦੀ ਉਡੀਕ ਕਰੋ।'
    },
    hi: {
        subtitle: 'रीयल-टाइम बस ट्रैकिंग सिस्टम',
        searchPlaceholder: 'रूट नंबर या गंतव्य द्वारा बसों की खोज करें...',
        findNearby: 'नज़दीकी खोजें',
        centerMap: 'केंद्र मैप',
        toggleRoutes: 'सभी रूट दिखाएं',
        availableBuses: 'उपलब्ध बसें',
        running: 'चल रही',
        delayed: 'देरी',
        stopped: 'रुकी हुई',
        routeInfo: 'रूट जानकारी',
        emergency: 'आपातकालीन सेवाएं',
        emergencySubtitle: '24/7 सहायता उपलब्ध',
        occupancy: 'लोगों की संख्या',
        eta: 'अनुमानित समय',
        status: 'स्थिति',
        stops: 'स्टॉप',
        selectStop: 'एक स्टॉप चुनें',
        notifyBefore: 'मुझे सूचित करें',
        minutesBefore: 'मिनट पहले',
        alertSet: 'अलर्ट सेट! आपको {{route}} के {{stopName}} पहुंचने से {{time}} मिनट पहले सूचित किया जाएगा।',
        locationError: 'आपका स्थान प्राप्त करने में असमर्थ। कृपया अपनी ब्राउज़र सेटिंग्स जांचें।',
        geolocationNotSupported: 'इस ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।',
        foundNearbyBuses: '{{count}} आस-पास की बसें मिलीं। सबसे करीब दिखा रहा है: {{route}}',
        noNearbyBuses: 'आपके स्थान के 2 किमी के भीतर कोई बस नहीं मिली।',
        showAllRoutes: 'सभी रूट दिखाएं',
        hideAllRoutes: 'सभी रूट छिपाएं',
        normalContrast: 'सामान्य कंट्रास्ट',
        normalMode: 'सामान्य मोड',
        pleaseSelectStop: 'कृपया एक स्टॉप चुनें।',
        gettingLocation: 'आपका स्थान प्राप्त करने में असमर्थ। कृपया अपनी ब्राउज़र सेटिंग्स जांचें।',
        yourLocation: 'आपका स्थान',
        incidentReported: 'आपातकालीन घटना रिपोर्टिंग सुविधा सक्रिय हो गई है। मदद रास्ते में है!',
        assistanceRequested: 'आपातकालीन सहायता का अनुरोध किया गया है। कृपया शांत रहें और मदद की प्रतीक्षा करें।'
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    // Show loading screen for exactly 2 seconds
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainApp.classList.remove('hidden');
            initializeApp();
        }, 500);
    }, 2000);
});

function initializeApp() {
    initializeMap();
    initializeBuses();
    initializeEventListeners();
    initializeAlerts();
    updateLanguage();

    // Start real-time updates
    setInterval(updateBusPositions, 30000);
    setInterval(updateETAs, 10000);
}

function initializeMap() {
    map = L.map('map').setView([31.6340, 74.8723], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Add click handler to close route info
    map.on('click', function () {
        if (selectedBus) {
            clearSelection();
        }
    });
}

function initializeBuses() {
    const busList = document.getElementById('bus-list');
    busList.innerHTML = '';

    Object.entries(busData).forEach(([busId, bus]) => {
        // Add bus to list
        const busItem = createBusItem(busId, bus);
        busList.appendChild(busItem);

        // Add bus marker to map
        addBusMarker(busId, bus);

        // Add route to map (hidden initially)
        addRoute(busId, bus);
    });
}

function createBusItem(busId, bus) {
    const busItem = document.createElement('div');
    busItem.className = `bus-item ${bus.status}`;
    busItem.dataset.busId = busId;

    busItem.innerHTML = `
        <div class="bus-header">
            <div class="bus-route">${bus.route}</div>
            <div class="bus-status ${bus.status}" data-lang="${bus.status}">${getStatusText(bus.status)}</div>
        </div>
        <div class="bus-destination">${bus.destination}</div>
        <div class="bus-eta" data-lang="eta">${translations[currentLanguage]['eta']}: ${bus.eta}</div>
    `;

    busItem.addEventListener('click', (e) => {
        e.stopPropagation();
        selectBus(busId);
    });

    return busItem;
}

function getStatusText(status) {
    return translations[currentLanguage][status] || status.charAt(0).toUpperCase() + status.slice(1);
}

function addBusMarker(busId, bus) {
    const busIcon = L.divIcon({
        className: 'bus-marker',
        html: `<div class="bus-marker-icon" style="background: ${getStatusColor(bus.status)};">🚌</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });

    const marker = L.marker(bus.position, { icon: busIcon })
        .addTo(map)
        .bindPopup(`
            <div class="bus-popup">
                <strong>${bus.route}</strong><br>
                <small>${bus.destination}</small><br>
                <span style="color: ${getStatusColor(bus.status)};">●</span> ${getStatusText(bus.status)}<br>
                <strong>${translations[currentLanguage]['eta']}: ${bus.eta}</strong>
            </div>
        `);

    marker.on('click', () => selectBus(busId));
    busMarkers[busId] = marker;
}

function addRoute(busId, bus) {
    const routeColor = getRouteColor(busId);

    const route = L.polyline(bus.routeCoords, {
        color: routeColor,
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1
    }).addTo(map);

    routeLayers[busId] = route;
}

function selectBus(busId) {
    // Clear previous selection
    clearSelection();

    // Mark as selected
    selectedBus = busId;
    const bus = busData[busId];

    // Update UI
    const busItem = document.querySelector(`[data-bus-id="${busId}"]`);
    if (busItem) {
        busItem.classList.add('selected');
    }

    // Highlight route with thick, animated line
    const route = routeLayers[busId];
    if (route) {
        route.setStyle({
            color: '#1FB8CD',
            weight: 8,
            opacity: 0.9
        });
        route.getElement().classList.add('route-highlighted');
    }

    // Center map on bus
    map.setView(bus.position, 14);

    // Show route information
    showRouteInfo(busId, bus);

    // Start random occupancy updates
    if (occupancyInterval) {
        clearInterval(occupancyInterval);
    }
    updateOccupancyDisplay(busId);
    occupancyInterval = setInterval(() => updateOccupancyDisplay(busId), 5000); // Update every 5 seconds

    // Enable action buttons
    const setAlertBtn = document.getElementById('set-alert');
    const addFavoriteBtn = document.getElementById('add-favorite');
    if (setAlertBtn) setAlertBtn.disabled = false;
    if (addFavoriteBtn) addFavoriteBtn.disabled = false;
}

function clearSelection() {
    if (selectedBus) {
        // Remove selection styling
        const selectedItem = document.querySelector(`[data-bus-id="${selectedBus}"]`);
        if (selectedItem) {
            selectedItem.classList.remove('selected');
        }

        // Reset route styling
        const route = routeLayers[selectedBus];
        if (route) {
            route.setStyle({
                color: getRouteColor(selectedBus),
                weight: 3,
                opacity: 0.7
            });
            const element = route.getElement();
            if (element) {
                element.classList.remove('route-highlighted');
            }
        }

        selectedBus = null;
    }

    // Stop occupancy updates
    if (occupancyInterval) {
        clearInterval(occupancyInterval);
        occupancyInterval = null;
        const occupancyValueElement = document.getElementById('occupancy-value');
        if (occupancyValueElement) {
            occupancyValueElement.textContent = '--';
        }
    }

    // Hide route info
    const routePanel = document.getElementById('route-info-panel');
    if (routePanel) {
        routePanel.classList.remove('show');
    }

    // Disable action buttons
    const setAlertBtn = document.getElementById('set-alert');
    const addFavoriteBtn = document.getElementById('add-favorite');
    if (setAlertBtn) setAlertBtn.disabled = true;
    if (addFavoriteBtn) addFavoriteBtn.disabled = true;
}

function showRouteInfo(busId, bus) {
    const panel = document.getElementById('route-info-panel');
    const details = document.getElementById('route-details');

    if (panel && details) {
        details.innerHTML = `
            <div style="margin-bottom: 16px;">
                <h5>${bus.route} - ${bus.destination}</h5>
                <p><strong>${translations[currentLanguage]['status']}:</strong> <span style="color: ${getStatusColor(bus.status)};">●</span> ${getStatusText(bus.status)}</p>
                <p><strong>${translations[currentLanguage]['eta']}:</strong> ${bus.eta}</p>
            </div>
            <div>
                <h6>${translations[currentLanguage]['stops']}:</h6>
                <ul style="margin: 8px 0; padding-left: 20px;">
                    ${bus.stops.map(stop => `<li>${stop}</li>`).join('')}
                </ul>
            </div>
        `;
        const occupancyElement = details.querySelector('#bus-occupancy');
        if (occupancyElement) {
            occupancyElement.style.display = 'block';
        }

        panel.classList.add('show');
    }
}

function generateRandomOccupancy() {
    return Math.floor(Math.random() * 50) + 1; // Random number between 1 and 50
}

function updateOccupancyDisplay(busId) {
    const occupancyValueElement = document.getElementById('occupancy-value');
    if (occupancyValueElement) {
        occupancyValueElement.textContent = generateRandomOccupancy();
    }
}

function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('bus-search');
    const suggestionsContainer = document.getElementById('search-suggestions');

    if (searchInput && suggestionsContainer) {
        searchInput.addEventListener('input', function (e) {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim().toLowerCase();

            if (query.length === 0) {
                hideSuggestions();
                showAllBuses();
                return;
            }

            // Add loading state
            searchInput.classList.add('loading');

            searchTimeout = setTimeout(() => {
                searchInput.classList.remove('loading');

                const suggestions = searchBuses(query);
                showSuggestions(suggestions);
                filterBusList(query);
            }, 300);
        });

        searchInput.addEventListener('blur', function () {
            setTimeout(() => hideSuggestions(), 200);
        });
    }

    // Location button
    const locationBtn = document.getElementById('location-btn');
    if (locationBtn) {
        locationBtn.addEventListener('click', getUserLocation);
    }

    // Map controls
    const centerMapBtn = document.getElementById('center-map');
    if (centerMapBtn) {
        centerMapBtn.addEventListener('click', () => {
            if (selectedBus) {
                map.setView(busData[selectedBus].position, 14);
            } else {
                map.setView([31.6340, 74.8723], 12);
            }
        });
    }

    const toggleRoutesBtn = document.getElementById('toggle-routes');
    if (toggleRoutesBtn) {
        toggleRoutesBtn.addEventListener('click', toggleAllRoutes);
    }

    // Route info close
    const closeRouteInfoBtn = document.getElementById('close-route-info');
    if (closeRouteInfoBtn) {
        closeRouteInfoBtn.addEventListener('click', clearSelection);
    }

    // Modal handlers
    const setAlertBtn = document.getElementById('set-alert');
    if (setAlertBtn) {
        setAlertBtn.addEventListener('click', openAlertModal);
    }

    const closeAlertModalBtn = document.getElementById('close-alert-modal');
    if (closeAlertModalBtn) {
        closeAlertModalBtn.addEventListener('click', closeAlertModal);
    }

    const cancelAlertBtn = document.getElementById('cancel-alert');
    if (cancelAlertBtn) {
        cancelAlertBtn.addEventListener('click', closeAlertModal);
    }

    const confirmAlertBtn = document.getElementById('confirm-alert');
    if (confirmAlertBtn) {
        confirmAlertBtn.addEventListener('click', setAlert);
    }

    // Language selector - Fix for dropdown functionality
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function (e) {
            currentLanguage = e.target.value;
            updateLanguage();
            updateBusStatuses();
        });

        // Ensure the select element can be clicked
        languageSelect.style.pointerEvents = 'auto';
        languageSelect.style.zIndex = '1001';
    }

    // Theme toggles
    const highContrastBtn = document.getElementById('high-contrast-toggle');
    if (highContrastBtn) {
        highContrastBtn.addEventListener('click', toggleHighContrast);
    }

    const lowDataBtn = document.getElementById('low-data-toggle');
    if (lowDataBtn) {
        lowDataBtn.addEventListener('click', toggleLowDataMode);
    }

    // Emergency buttons
    const reportIncidentBtn = document.getElementById('report-incident');
    if (reportIncidentBtn) {
        reportIncidentBtn.addEventListener('click', () => {
            showNotification(translations[currentLanguage]['incidentReported']);
        });
    }

    const requestAssistanceBtn = document.getElementById('request-assistance');
    if (requestAssistanceBtn) {
        requestAssistanceBtn.addEventListener('click', () => {
            showNotification(translations[currentLanguage]['assistanceRequested']);
        });
    }
}

function searchBuses(query) {
    const results = [];

    Object.entries(busData).forEach(([busId, bus]) => {
        if (bus.route.toLowerCase().includes(query) ||
            bus.destination.toLowerCase().includes(query) ||
            bus.stops.some(stop => stop.toLowerCase().includes(query))) {
            results.push({ busId, bus });
        }
    });

    return results;
}

function showSuggestions(suggestions) {
    const container = document.getElementById('search-suggestions');
    if (!container) return;

    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }

    container.innerHTML = suggestions.slice(0, 5).map(({ busId, bus }) => `
        <div class="suggestion-item" data-bus-id="${busId}">
            <strong>${bus.route}</strong> - ${bus.destination}
        </div>
    `).join('');

    container.style.display = 'block';

    // Add click handlers
    container.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('mousedown', function (e) {
            e.preventDefault(); // Prevent blur event
            const busId = this.dataset.busId;
            selectBus(busId);
            document.getElementById('bus-search').value = busData[busId].route;
            hideSuggestions();
        });
    });
}

function hideSuggestions() {
    const container = document.getElementById('search-suggestions');
    if (container) {
        container.style.display = 'none';
    }
}

function filterBusList(query) {
    const busItems = document.querySelectorAll('.bus-item');

    busItems.forEach(item => {
        const busId = item.dataset.busId;
        const bus = busData[busId];

        const matches = bus.route.toLowerCase().includes(query) ||
            bus.destination.toLowerCase().includes(query) ||
            bus.stops.some(stop => stop.toLowerCase().includes(query));

        item.style.display = matches ? 'block' : 'none';
    });
}

function showAllBuses() {
    document.querySelectorAll('.bus-item').forEach(item => {
        item.style.display = 'block';
    });
}

function updateBusStatuses() {
    document.querySelectorAll('.bus-status').forEach(statusEl => {
        const status = statusEl.classList.contains('running') ? 'running' :
            statusEl.classList.contains('delayed') ? 'delayed' : 'stopped';
        statusEl.textContent = getStatusText(status);
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        const btn = document.getElementById('location-btn');
        const originalText = btn.textContent;
        btn.textContent = translations[currentLanguage]['gettingLocation'] || 'Getting location...';
        btn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = [position.coords.latitude, position.coords.longitude];
                map.setView(userLocation, 15);

                // Add user marker
                if (window.userMarker) {
                    map.removeLayer(window.userMarker);
                }

                window.userMarker = L.marker(userLocation)
                    .addTo(map)
                    .bindPopup(translations[currentLanguage]['yourLocation'] || 'Your Location')
                    .openPopup();

                btn.textContent = originalText;
                btn.disabled = false;

                // Find nearby buses
                findNearbyBuses();
            },
            (error) => {
                showNotification(translations[currentLanguage]['locationError']);
                btn.textContent = originalText;
                btn.disabled = false;
            }
        );
    } else {
        showNotification(translations[currentLanguage]['geolocationNotSupported']);
    }
}

function findNearbyBuses() {
    if (!userLocation) return;

    const nearbyBuses = [];
    const maxDistance = 2000; // 2km

    Object.entries(busData).forEach(([busId, bus]) => {
        const distance = calculateDistance(userLocation, bus.position);
        if (distance <= maxDistance) {
            nearbyBuses.push({ busId, bus, distance });
        }
    });

    nearbyBuses.sort((a, b) => a.distance - b.distance);

    if (nearbyBuses.length > 0) {
        const closestBus = nearbyBuses[0];
        selectBus(closestBus.busId);

        // Show notification
        showNotification(translations[currentLanguage]['foundNearbyBuses']
            .replace('{{count}}', nearbyBuses.length)
            .replace('{{route}}', closestBus.bus.route));
    } else {
        showNotification(translations[currentLanguage]['noNearbyBuses']);
    }
}

function calculateDistance(pos1, pos2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1[0] * Math.PI / 180;
    const φ2 = pos2[0] * Math.PI / 180;
    const Δφ = (pos2[0] - pos1[0]) * Math.PI / 180;
    const Δλ = (pos2[1] - pos1[1]) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function toggleAllRoutes() {
    const btn = document.getElementById('toggle-routes');
    if (!btn) return;

    const isShowing = btn.textContent.includes('Hide');

    Object.entries(routeLayers).forEach(([busId, route]) => {
        if (busId !== selectedBus) {
            route.setStyle({
                opacity: isShowing ? 0.3 : 0.7,
                weight: isShowing ? 2 : 3
            });
        }
    });

    btn.textContent = isShowing ? translations[currentLanguage]['showAllRoutes'] : translations[currentLanguage]['hideAllRoutes'];
}

function openAlertModal() {
    if (!selectedBus) return;

    const modal = document.getElementById('alert-modal');
    const stopSelect = document.getElementById('stop-select');
    const bus = busData[selectedBus];

    if (modal && stopSelect) {
        // Populate stops
        stopSelect.innerHTML = `<option value="">${translations[currentLanguage]['selectStop']}</option>` +
            bus.stops.map(stop => `<option value="${stop}">${stop}</option>`).join('');

        modal.classList.remove('hidden');
    }
}

function closeAlertModal() {
    const modal = document.getElementById('alert-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function setAlert() {
    const stopSelect = document.getElementById('stop-select');
    const notificationTime = document.getElementById('notification-time');

    if (!stopSelect || !notificationTime) return;

    const stopName = stopSelect.value;
    const time = notificationTime.value;

    if (!stopName) {
        showNotification('Please select a stop.');
        return;
    }

    // In a real app, this would set up push notifications
    showNotification(translations[currentLanguage]['alertSet']
        .replace('{{time}}', time)
        .replace('{{route}}', busData[selectedBus].route)
        .replace('{{stopName}}', stopName));
    closeAlertModal();
}

function initializeAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;

    const sampleAlerts = [
        {
            title: 'Route AC-101 Delay',
            message: 'Due to heavy traffic, Route AC-101 is experiencing 10-minute delays.',
            type: 'warning'
        },
        {
            title: 'New Route Launch',
            message: 'New Express Route EXP-303 to Jalandhar starting next week.',
            type: 'info'
        }
    ];

    alertsContainer.innerHTML = sampleAlerts.map(alert => `
        <div class="alert-item">
            <div class="alert-title">${alert.title}</div>
            <p class="alert-message">${alert.message}</p>
        </div>
    `).join('');
}

function updateLanguage() {
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[currentLanguage][key];
            } else if (element.tagName === 'TITLE') {
                document.title = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

function updateBusPositions() {
    Object.entries(busData).forEach(([busId, bus]) => {
        // Simulate movement
        const newLat = bus.position[0] + (Math.random() - 0.5) * 0.001;
        const newLng = bus.position[1] + (Math.random() - 0.5) * 0.001;
        bus.position = [newLat, newLng];

        // Update marker
        if (busMarkers[busId]) {
            busMarkers[busId].setLatLng(bus.position);
        }
    });
}

function updateETAs() {
    Object.entries(busData).forEach(([busId, bus]) => {
        // Simulate ETA updates
        const currentETA = parseInt(bus.eta);
        const newETA = Math.max(1, currentETA + Math.floor(Math.random() * 3) - 1);
        bus.eta = `${newETA} mins`;

        // Update display
        const busItem = document.querySelector(`[data-bus-id="${busId}"]`);
        if (busItem) {
            const etaElement = busItem.querySelector('.bus-eta');
            if (etaElement) {
                etaElement.textContent = `${translations[currentLanguage]['eta']}: ${bus.eta}`;
            }
        }
    });
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const btn = document.getElementById('high-contrast-toggle');
    if (btn) {
        btn.textContent = document.body.classList.contains('high-contrast') ? translations[currentLanguage]['normalContrast'] : translations[currentLanguage]['highContrast'];
    }
}

function toggleLowDataMode() {
    document.body.classList.toggle('low-data');
    const btn = document.getElementById('low-data-toggle');
    if (btn) {
        btn.textContent = document.body.classList.contains('low-data') ? translations[currentLanguage]['normalMode'] : translations[currentLanguage]['lowData'];
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'running': return '#21C55D';
        case 'delayed': return '#F59E0B';
        case 'stopped': return '#EF4444';
        default: return '#6B7280';
    }
}

function getRouteColor(busId) {
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454'];
    const index = Object.keys(busData).indexOf(busId);
    return colors[index % colors.length];
}

function showNotification(message) {
    // Simple notification implementation
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('notification-exit');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
