/**
 * BathroomVisualizer Module
 * Handles the canvas-based visualization of the bathroom layout
 */

const BathroomVisualizer = {
    canvas: null,
    ctx: null,
    scale: 1,
    padding: 40,
    zoomLevel: 1,
    currentData: null,

    /**
     * Initialize the canvas
     * @param {string} canvasId - ID of the canvas element
     */
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupZoomControls();
    },

    /**
     * Initialize the canvas
     * @param {string} canvasId - ID of the canvas element
     */
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupZoomControls();
    },

    /**
     * Setup zoom controls
     */
    setupZoomControls() {
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const resetZoomBtn = document.getElementById('resetZoom');

        zoomInBtn.addEventListener('click', () => this.zoom(1.2));
        zoomOutBtn.addEventListener('click', () => this.zoom(0.8));
        resetZoomBtn.addEventListener('click', () => this.resetZoom());

        // Mouse wheel zoom
        const container = document.getElementById('canvasContainer');
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom(zoomFactor);
        });
    },

    /**
     * Zoom the canvas
     * @param {number} factor - Zoom factor
     */
    zoom(factor) {
        this.zoomLevel *= factor;
        
        // Limit zoom range
        if (this.zoomLevel < 0.3) this.zoomLevel = 0.3;
        if (this.zoomLevel > 3) this.zoomLevel = 3;

        this.updateZoomDisplay();
        
        if (this.currentData) {
            this.draw(this.currentData);
        }
    },

    /**
     * Reset zoom to default
     */
    resetZoom() {
        this.zoomLevel = 1;
        this.updateZoomDisplay();
        
        if (this.currentData) {
            this.draw(this.currentData);
        }
    },

    /**
     * Update zoom level display
     */
    updateZoomDisplay() {
        const zoomLevelElement = document.getElementById('zoomLevel');
        zoomLevelElement.textContent = Math.round(this.zoomLevel * 100) + '%';
    },

    /**
     * Draw the complete bathroom visualization
     * @param {object} data - Calculation data including dimensions
     */
    draw(data) {
        this.currentData = data;
        const { formData, floor, walls } = data;

        // Calculate canvas dimensions and scale
        this.calculateScale(formData);

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw title
        this.drawTitle();

        // Calculate positions for floor and walls layout
        const floorY = 80 * this.zoomLevel;
        const wallsY = floorY + (formData.floorLength * this.scale) + 60 * this.zoomLevel;

        // Draw floor plan
        this.drawFloor(formData, floor, this.padding * this.zoomLevel, floorY);

        // Draw walls unfolded
        this.drawWalls(formData, walls, wallsY);

        // Draw legend
        this.drawLegend();
    },

    /**
     * Calculate appropriate scale for the canvas
     * @param {object} formData - Form input data
     */
    calculateScale(formData) {
        // Calculate base scale (without zoom)
        const baseScale = 0.12;
        this.scale = baseScale * this.zoomLevel;

        // Calculate the total width needed for all 4 walls
        // Wall 1 (width) + Wall 2 (length) + Wall 3 (width) + Wall 4 (length) + gaps
        const totalWallsWidth = (formData.floorWidth * 2 + formData.floorLength * 2) * this.scale + (30 * this.zoomLevel * 3); // 3 gaps between 4 walls
        
        // Calculate floor width
        const floorWidth = formData.floorWidth * this.scale;
        
        // Canvas width should accommodate the wider of: floor or all walls
        const contentWidth = Math.max(floorWidth, totalWallsWidth);
        const canvasWidth = contentWidth + (this.padding * 2 * this.zoomLevel);

        // Set canvas dimensions
        const canvasHeight = 
            (80 * this.zoomLevel) + // Title space
            (formData.floorLength * this.scale) + // Floor height
            (60 * this.zoomLevel) + // Gap between floor and walls
            (formData.wallHeight * this.scale) + // Wall height
            (100 * this.zoomLevel); // Legend space

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
    },

    /**
     * Draw title
     */
    drawTitle() {
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = `bold ${20 * this.zoomLevel}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Bathroom Layout Blueprint', this.canvas.width / 2, 30 * this.zoomLevel);
    },

    /**
     * Draw floor plan with tiles
     * @param {object} formData - Form input data
     * @param {object} floor - Floor calculation results
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    drawFloor(formData, floor, x, y) {
        const width = formData.floorWidth * this.scale;
        const height = formData.floorLength * this.scale;

        // Draw label
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = `bold ${14 * this.zoomLevel}px Arial`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Floor Plan (Top View)', x, y - 10 * this.zoomLevel);

        // Draw floor background
        this.ctx.fillStyle = '#fef3c7';
        this.ctx.fillRect(x, y, width, height);

        // Draw floor tiles grid
        const tileWidth = formData.floorTileWidth * this.scale;
        const tileHeight = formData.floorTileLength * this.scale;

        this.ctx.strokeStyle = '#d97706';
        this.ctx.lineWidth = 1 * this.zoomLevel;

        // Vertical lines
        for (let i = 0; i <= width; i += tileWidth) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + i, y);
            this.ctx.lineTo(x + i, y + height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let j = 0; j <= height; j += tileHeight) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + j);
            this.ctx.lineTo(x + width, y + j);
            this.ctx.stroke();
        }

        // Draw floor border
        this.ctx.strokeStyle = '#92400e';
        this.ctx.lineWidth = 3 * this.zoomLevel;
        this.ctx.strokeRect(x, y, width, height);

        // Draw dimensions
        this.drawDimension(
            x,
            y + height + 15 * this.zoomLevel,
            width,
            `${formData.floorWidth} mm`,
            true
        );
        this.drawDimension(
            x - 25 * this.zoomLevel,
            y,
            height,
            `${formData.floorLength} mm`,
            false
        );
    },

    /**
     * Draw walls unfolded with tiles
     * @param {object} formData - Form input data
     * @param {object} walls - Wall calculation results
     * @param {number} startY - Starting Y position
     */
    drawWalls(formData, walls, startY) {
        // Draw label
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = `bold ${14 * this.zoomLevel}px Arial`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Walls Unfolded (Elevation View)', this.padding * this.zoomLevel, startY - 10 * this.zoomLevel);

        const wallHeight = formData.wallHeight * this.scale;
        const wall1Width = formData.floorWidth * this.scale;
        const wall2Width = formData.floorLength * this.scale;
        const wallGap = 10 * this.zoomLevel;

        let currentX = this.padding * this.zoomLevel;

        // Draw Wall 1 (Front - with door)
        this.drawWall(
            'Wall 1 (Front)',
            currentX,
            startY,
            wall1Width,
            wallHeight,
            formData,
            true
        );
        currentX += wall1Width + wallGap;

        // Draw Wall 2 (Side)
        this.drawWall(
            'Wall 2 (Side)',
            currentX,
            startY,
            wall2Width,
            wallHeight,
            formData,
            false
        );
        currentX += wall2Width + wallGap;

        // Draw Wall 3 (Back)
        this.drawWall(
            'Wall 3 (Back)',
            currentX,
            startY,
            wall1Width,
            wallHeight,
            formData,
            false
        );
        currentX += wall1Width + wallGap;

        // Draw Wall 4 (Side)
        this.drawWall(
            'Wall 4 (Side)',
            currentX,
            startY,
            wall2Width,
            wallHeight,
            formData,
            false
        );
    },

    /**
     * Draw a single wall with tiles
     * @param {string} label - Wall label
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Wall width
     * @param {number} height - Wall height
     * @param {object} formData - Form data
     * @param {boolean} hasDoor - Whether this wall has a door
     */
    drawWall(label, x, y, width, height, formData, hasDoor) {
        // Draw wall background
        this.ctx.fillStyle = '#d1fae5';
        this.ctx.fillRect(x, y, width, height);

        // Draw wall tiles grid
        const tileWidth = formData.wallTileWidth * this.scale;
        const tileHeight = formData.wallTileHeight * this.scale;

        this.ctx.strokeStyle = '#059669';
        this.ctx.lineWidth = 0.5 * this.zoomLevel;

        // Vertical lines
        for (let i = 0; i <= width; i += tileWidth) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + i, y);
            this.ctx.lineTo(x + i, y + height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let j = 0; j <= height; j += tileHeight) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + j);
            this.ctx.lineTo(x + width, y + j);
            this.ctx.stroke();
        }

        // Draw door if applicable
        if (hasDoor) {
            const doorWidth = formData.doorWidth * this.scale;
            const doorHeight = formData.doorHeight * this.scale;
            const doorX = x + (width - doorWidth) / 2; // Center the door
            const doorY = y + height - doorHeight; // Door at bottom

            // Draw door
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
            this.ctx.strokeStyle = '#7c3aed';
            this.ctx.lineWidth = 2 * this.zoomLevel;
            this.ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);

            // Draw door label
            this.ctx.fillStyle = '#7c3aed';
            this.ctx.font = `${10 * this.zoomLevel}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('DOOR', doorX + doorWidth / 2, doorY + doorHeight / 2 + 3 * this.zoomLevel);
        }

        // Draw wall border
        this.ctx.strokeStyle = '#065f46';
        this.ctx.lineWidth = 3 * this.zoomLevel;
        this.ctx.strokeRect(x, y, width, height);

        // Draw wall label
        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = `bold ${11 * this.zoomLevel}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, x + width / 2, y - 5 * this.zoomLevel);
    },

    /**
     * Draw dimension line with text
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} length - Length of dimension line
     * @param {string} text - Dimension text
     * @param {boolean} horizontal - Whether dimension is horizontal
     */
    drawDimension(x, y, length, text, horizontal) {
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 1 * this.zoomLevel;
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = `${10 * this.zoomLevel}px Arial`;
        this.ctx.textAlign = 'center';

        if (horizontal) {
            // Draw line
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + length, y);
            this.ctx.stroke();

            // Draw arrows
            this.drawArrow(x, y, -5 * this.zoomLevel, 0);
            this.drawArrow(x + length, y, 5 * this.zoomLevel, 0);

            // Draw text
            this.ctx.fillText(text, x + length / 2, y - 5 * this.zoomLevel);
        } else {
            // Draw line
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + length);
            this.ctx.stroke();

            // Draw arrows
            this.drawArrow(x, y, 0, -5 * this.zoomLevel);
            this.drawArrow(x, y + length, 0, 5 * this.zoomLevel);

            // Draw text (rotated)
            this.ctx.save();
            this.ctx.translate(x - 10 * this.zoomLevel, y + length / 2);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(text, 0, 0);
            this.ctx.restore();
        }
    },

    /**
     * Draw arrow head
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} dx - X direction
     * @param {number} dy - Y direction
     */
    drawArrow(x, y, dx, dy) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + dx, y + dy);
        this.ctx.stroke();
    },

    /**
     * Draw legend
     */
    drawLegend() {
        const legendY = this.canvas.height - 60 * this.zoomLevel;
        const legendX = this.padding * this.zoomLevel;

        this.ctx.fillStyle = '#1e293b';
        this.ctx.font = `bold ${12 * this.zoomLevel}px Arial`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Legend:', legendX, legendY);

        const boxSize = 20 * this.zoomLevel;
        const boxY = legendY + 10 * this.zoomLevel;

        // Floor tiles
        this.ctx.fillStyle = '#fef3c7';
        this.ctx.fillRect(legendX, boxY, boxSize, boxSize);
        this.ctx.strokeStyle = '#d97706';
        this.ctx.lineWidth = 2 * this.zoomLevel;
        this.ctx.strokeRect(legendX, boxY, boxSize, boxSize);
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = `${11 * this.zoomLevel}px Arial`;
        this.ctx.fillText('Floor Tiles', legendX + boxSize + 10 * this.zoomLevel, legendY + 24 * this.zoomLevel);

        // Wall tiles
        this.ctx.fillStyle = '#d1fae5';
        this.ctx.fillRect(legendX + 120 * this.zoomLevel, boxY, boxSize, boxSize);
        this.ctx.strokeStyle = '#059669';
        this.ctx.lineWidth = 2 * this.zoomLevel;
        this.ctx.strokeRect(legendX + 120 * this.zoomLevel, boxY, boxSize, boxSize);
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillText('Wall Tiles', legendX + 120 * this.zoomLevel + boxSize + 10 * this.zoomLevel, legendY + 24 * this.zoomLevel);

        // Door
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(legendX + 240 * this.zoomLevel, boxY, boxSize, boxSize);
        this.ctx.strokeStyle = '#7c3aed';
        this.ctx.lineWidth = 2 * this.zoomLevel;
        this.ctx.strokeRect(legendX + 240 * this.zoomLevel, boxY, boxSize, boxSize);
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillText('Door', legendX + 240 * this.zoomLevel + boxSize + 10 * this.zoomLevel, legendY + 24 * this.zoomLevel);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BathroomVisualizer;
}
