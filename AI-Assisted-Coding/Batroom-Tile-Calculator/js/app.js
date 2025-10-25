/**
 * Main App Controller
 * Coordinates form handling, calculation, and visualization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    const form = document.getElementById('tileForm');
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        handleCalculation();
    });

    // Initialize visualizer
    BathroomVisualizer.init('bathroomCanvas');
}

/**
 * Handle the calculation process
 */
function handleCalculation() {
    // Get form data
    const formData = getFormData();

    // Validate form data
    if (!validateFormData(formData)) {
        alert('Please ensure all measurements are positive numbers.');
        return;
    }

    // Perform calculations
    const results = TileCalculator.calculate(formData);

    // Display results
    displayResults(results);

    // Draw visualization
    BathroomVisualizer.draw(results);

    // Show results section with smooth scroll
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Get form data from all input fields
 * @returns {object} Form data object
 */
function getFormData() {
    return {
        floorWidth: parseFloat(document.getElementById('floorWidth').value),
        floorLength: parseFloat(document.getElementById('floorLength').value),
        floorTileWidth: parseFloat(document.getElementById('floorTileWidth').value),
        floorTileLength: parseFloat(document.getElementById('floorTileLength').value),
        wallHeight: parseFloat(document.getElementById('wallHeight').value),
        wallTileWidth: parseFloat(document.getElementById('wallTileWidth').value),
        wallTileHeight: parseFloat(document.getElementById('wallTileHeight').value),
        doorWidth: parseFloat(document.getElementById('doorWidth').value),
        doorHeight: parseFloat(document.getElementById('doorHeight').value)
    };
}

/**
 * Validate form data
 * @param {object} data - Form data to validate
 * @returns {boolean} Whether data is valid
 */
function validateFormData(data) {
    for (const key in data) {
        if (isNaN(data[key]) || data[key] < 0) {
            return false;
        }
    }
    return true;
}

/**
 * Display calculation results in the UI
 * @param {object} results - Calculation results
 */
function displayResults(results) {
    const { floor, walls } = results;

    // Display floor tiles
    document.getElementById('floorTilesResult').textContent = floor.totalTiles;
    
    const floorDetails = `
        <strong>Surface Area:</strong> ${floor.surfaceArea.toFixed(2)} m²<br>
        <strong>Tiles (exact):</strong> ${floor.tilesNeededExact}<br>
        <strong>With ${floor.wastePercentage}% waste:</strong> ${floor.tilesWithWaste}<br>
        <strong>Grid:</strong> ${floor.tilesPerRow} × ${floor.tilesPerColumn} tiles
    `;
    document.getElementById('floorDetails').innerHTML = floorDetails;

    // Display wall tiles
    document.getElementById('wallTilesResult').textContent = walls.totalTiles;
    
    const wallDetails = `
        <strong>Total Wall Area:</strong> ${walls.totalWallArea.toFixed(2)} m²<br>
        <strong>Door Area:</strong> ${walls.doorArea.toFixed(2)} m²<br>
        <strong>Net Area:</strong> ${walls.netWallArea.toFixed(2)} m²<br>
        <strong>Tiles (exact):</strong> ${walls.tilesNeededExact}<br>
        <strong>With ${walls.wastePercentage}% waste:</strong> ${walls.tilesWithWaste}
    `;
    document.getElementById('wallDetails').innerHTML = wallDetails;
}

/**
 * Format number to fixed decimal places
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
function formatNumber(num, decimals = 2) {
    return num.toFixed(decimals);
}
