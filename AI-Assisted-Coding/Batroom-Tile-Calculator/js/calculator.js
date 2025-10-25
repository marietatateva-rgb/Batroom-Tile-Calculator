/**
 * TileCalculator Module
 * Handles all tile calculation logic with waste allowance
 */

const TileCalculator = {
    // Standard waste allowance percentage (10%)
    WASTE_ALLOWANCE: 0.10,

    /**
     * Calculate the number of tiles needed for a given area
     * @param {number} surfaceWidth - Width of the surface in mm
     * @param {number} surfaceLength - Length of the surface in mm
     * @param {number} tileWidth - Width of tile in mm
     * @param {number} tileLength - Length of tile in mm
     * @returns {object} Calculation results
     */
    calculateTilesForArea(surfaceWidth, surfaceLength, tileWidth, tileLength) {
        // Calculate surface area
        const surfaceArea = surfaceWidth * surfaceLength;

        // Calculate tile area
        const tileArea = tileWidth * tileLength;

        // Calculate number of tiles without waste
        const tilesNeededExact = surfaceArea / tileArea;

        // Add waste allowance
        const tilesWithWaste = tilesNeededExact * (1 + this.WASTE_ALLOWANCE);

        // Round up to get whole tiles
        const totalTiles = Math.ceil(tilesWithWaste);

        // Calculate tiles per row and column
        const tilesPerRow = Math.ceil(surfaceWidth / tileWidth);
        const tilesPerColumn = Math.ceil(surfaceLength / tileLength);

        return {
            surfaceArea: surfaceArea / 1000000, // Convert to square meters
            tileArea: tileArea / 1000000, // Convert to square meters
            tilesNeededExact: Math.round(tilesNeededExact),
            tilesWithWaste: Math.round(tilesWithWaste),
            totalTiles: totalTiles,
            wastePercentage: this.WASTE_ALLOWANCE * 100,
            tilesPerRow: tilesPerRow,
            tilesPerColumn: tilesPerColumn
        };
    },

    /**
     * Calculate floor tiles needed
     * @param {object} params - Floor parameters
     * @returns {object} Floor tile calculation results
     */
    calculateFloorTiles(params) {
        const { floorWidth, floorLength, floorTileWidth, floorTileLength } = params;

        return this.calculateTilesForArea(
            floorWidth,
            floorLength,
            floorTileWidth,
            floorTileLength
        );
    },

    /**
     * Calculate wall tiles needed for all 4 walls, accounting for door
     * @param {object} params - Wall and door parameters
     * @returns {object} Wall tile calculation results
     */
    calculateWallTiles(params) {
        const {
            floorWidth,
            floorLength,
            wallHeight,
            wallTileWidth,
            wallTileHeight,
            doorWidth,
            doorHeight
        } = params;

        // Calculate area of each wall
        const wall1Area = floorWidth * wallHeight; // Front wall
        const wall2Area = floorLength * wallHeight; // Side wall
        const wall3Area = floorWidth * wallHeight; // Back wall
        const wall4Area = floorLength * wallHeight; // Side wall

        // Total wall area
        const totalWallArea = wall1Area + wall2Area + wall3Area + wall4Area;

        // Subtract door area (assuming door is on one wall)
        const doorArea = doorWidth * doorHeight;
        const netWallArea = totalWallArea - doorArea;

        // Calculate tile area
        const tileArea = wallTileWidth * wallTileHeight;

        // Calculate number of tiles without waste
        const tilesNeededExact = netWallArea / tileArea;

        // Add waste allowance
        const tilesWithWaste = tilesNeededExact * (1 + this.WASTE_ALLOWANCE);

        // Round up to get whole tiles
        const totalTiles = Math.ceil(tilesWithWaste);

        return {
            totalWallArea: totalWallArea / 1000000, // Convert to square meters
            doorArea: doorArea / 1000000, // Convert to square meters
            netWallArea: netWallArea / 1000000, // Convert to square meters
            tileArea: tileArea / 1000000,
            tilesNeededExact: Math.round(tilesNeededExact),
            tilesWithWaste: Math.round(tilesWithWaste),
            totalTiles: totalTiles,
            wastePercentage: this.WASTE_ALLOWANCE * 100,
            // Calculate approximate tiles per wall for visualization
            wall1: this.calculateTilesForArea(floorWidth, wallHeight, wallTileWidth, wallTileHeight),
            wall2: this.calculateTilesForArea(floorLength, wallHeight, wallTileWidth, wallTileHeight),
            wall3: this.calculateTilesForArea(floorWidth, wallHeight, wallTileWidth, wallTileHeight),
            wall4: this.calculateTilesForArea(floorLength, wallHeight, wallTileWidth, wallTileHeight)
        };
    },

    /**
     * Main calculation function
     * @param {object} formData - All form input data
     * @returns {object} Complete calculation results
     */
    calculate(formData) {
        const floorResults = this.calculateFloorTiles(formData);
        const wallResults = this.calculateWallTiles(formData);

        return {
            floor: floorResults,
            walls: wallResults,
            formData: formData
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TileCalculator;
}
