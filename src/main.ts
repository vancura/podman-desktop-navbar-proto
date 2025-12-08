/**
 * Podman Desktop Navigation Bar Prototype
 * Entry point for the dynamic SVG navigation bar.
 */

import { SHADOW_PADDING as _SHADOW_PADDING, WindowFrame as _WindowFrame } from './components/window-frame.js';
import { assert } from './utils/utils.js';

let WindowFrame = _WindowFrame;
let SHADOW_PADDING = _SHADOW_PADDING;
let windowFrame: InstanceType<typeof WindowFrame> | null = null;
let resizeHandler: (() => void) | null = null;

/**
 * Updates the info display with the current window dimensions.
 */
function updateInfo(): void {
    const svg = assert(windowFrame, 'WindowFrame not initialized').getSvg();

    const svgWidth = parseFloat(assert(svg.getAttribute('width'), 'SVG missing width attribute'));
    const svgHeight = parseFloat(assert(svg.getAttribute('height'), 'SVG missing height attribute'));

    const width = svgWidth - SHADOW_PADDING * 2;
    const height = svgHeight - SHADOW_PADDING * 2;

    const info = assert(document.getElementById('info'), 'Info element not found');

    info.textContent = `Podman Desktop Navigation Bar Prototype — Window Frame (${Math.round(width)} × ${Math.round(height)} px)`;
}

/**
 * Main application entry point.
 * Sets up the SVG window frame prototype.
 */
function main(): void {
    const container = assert(document.getElementById('prototype-container'), 'Container element not found');

    // Clean up existing instance if any (for HMR).
    if (windowFrame) {
        windowFrame.destroy();
    }

    // Remove previous resize listener if any (for HMR).
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
    }

    // Clear container for HMR.
    container.innerHTML = '';

    // Create window frame component.
    windowFrame = new WindowFrame(container);

    // Set up resize handler for info updates.
    resizeHandler = () => updateInfo();
    window.addEventListener('resize', resizeHandler);

    // Initial info update.
    updateInfo();
}

// Start the application.
main();

// Handle HMR updates.
if (import.meta.hot) {
    import.meta.hot.accept('./components/window-frame.ts', (newModule) => {
        if (newModule) {
            WindowFrame = newModule.WindowFrame;
            SHADOW_PADDING = newModule.SHADOW_PADDING;
            main();
        }
    });

    import.meta.hot.accept();

    import.meta.hot.dispose(() => {
        if (resizeHandler) {
            window.removeEventListener('resize', resizeHandler);

            resizeHandler = null;
        }

        if (windowFrame) {
            windowFrame.destroy();

            windowFrame = null;
        }
    });
}
