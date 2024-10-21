export default class DimensionsManager {
    constructor(initialWidth) {
        this.width = initialWidth;
    }

    updateWidth(newWidth) {
        this.width = newWidth;
    }

    calculateGridDimensions() {
        return {
            margin: { top: 0.0956 * this.width, left: 0.169 * this.width },
            padding: { top: 0.0282 * this.width, left: 0.044 * this.width },
            size: 0.0974 * this.width
        };
    }

    calculateProgressTextDimensions() {
        return {
            style: {
                margin: 0,
                fontSize: 0.014 * this.width,
                letterSpacing: 0.6,
                fontWeight: 500,
                fill: '#fef9a9',
                stroke: '#000000',
                align: 'center'
            },
            margin: { left: 0.1756 * this.width, top: 0.035 * this.width },
            gap: 0.1535 * this.width
        };
    }

    calculateProgressBarsDimensions() {
        return {
            margin: { top: 0.012 * this.width, left: 0.12 * this.width },
            size: { width: 0.154 * this.width, height: 0.0668 * this.width },
        };
    }

    calculateMiniCrystalsDimensions() {
        return {
            size: { width: 0.012 * this.width, height: 0.012 * this.width },
            margin: { top: 0.01585 * this.width, left: 0.1935 * this.width },
            padding: { left: 0.00945 * this.width, between: 0.154 * this.width }
        };
    }
}
