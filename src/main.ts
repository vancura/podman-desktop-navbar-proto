/**
 * Podman Desktop Navigation Bar Prototype
 * Entry point for the dynamic SVG navigation bar.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Creates an SVG element with the specified attributes.
 * @param tag - The SVG element tag name.
 * @param attrs - Attributes to set on the element.
 * @returns The created SVG element.
 */
function createSvgElement<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string> = {},
): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
    }
    return element;
}

/**
 * Initializes the navigation bar SVG.
 * @param container - The container element to append the SVG to.
 * @param width - Width of the SVG viewport.
 * @param height - Height of the SVG viewport.
 * @returns The created SVG element.
 */
function initNavbarSvg(container: HTMLElement, width: number, height: number): SVGSVGElement {
    const svg = createSvgElement('svg', {
        width: String(width),
        height: String(height),
        viewBox: `0 0 ${width} ${height}`,
    });

    container.appendChild(svg);
    return svg;
}

/**
 * Main application entry point.
 * Sets up the SVG navigation bar prototype.
 */
function main() {
    const container = document.getElementById('navbar-container');

    if (!container) {
        showError('Container element not found');
        return;
    }

    // Initialize SVG with placeholder dimensions
    const svg = initNavbarSvg(container, 800, 60);

    // Add a placeholder rectangle to verify SVG is working
    const placeholder = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: '800',
        height: '60',
        fill: '#292929',
        rx: '4',
    });
    svg.appendChild(placeholder);

    // Add placeholder text
    const text = createSvgElement('text', {
        x: '400',
        y: '35',
        fill: '#666',
        'font-family': 'system-ui, -apple-system, sans-serif',
        'font-size': '14',
        'text-anchor': 'middle',
    });
    text.textContent = 'Navigation Bar Placeholder';
    svg.appendChild(text);

    // Update info
    const info = document.getElementById('info');
    if (info) {
        info.textContent = 'Podman Desktop Navigation Bar Prototype — SVG initialized';
    }
}

/**
 * Displays an error message to the user.
 * Shows in both the page error div and console.
 * @param message - Error description to display.
 */
function showError(message: string) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.textContent = `Error: ${message}`;
    }
    console.error(message);
}

// Start the application
main();
