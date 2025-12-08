/**
 * Window Frame Component
 * macOS-style window frame with title bar, status bar, and drop shadow.
 */

import { COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';
import { assert } from '../utils/utils.js';
import { createContentArea, updateContentArea } from './content-area.js';
import { createDropShadowFilter, DROP_SHADOW_FILTER_ID } from './drop-shadow.js';
import { createStatusBar, updateStatusBar } from './status-bar.js';
import { createTitleBar, updateTitleBar } from './title-bar.js';

/** Shadow padding exported for external calculations. */
export const SHADOW_PADDING = 100;

const WINDOW_CONFIG = {
    borderWidth: 2,

    padding: {
        top: 54,
        right: 40,
        bottom: 40,
        left: 40,
    },
} as const;

/**
 * Calculates the window dimensions based on browser viewport and configuration.
 * @returns Object with width and height for the window frame.
 */
function calculateWindowDimensions(): { width: number; height: number } {
    return {
        width: Math.max(550, window.innerWidth - WINDOW_CONFIG.padding.left - WINDOW_CONFIG.padding.right),
        height: Math.max(200, window.innerHeight - WINDOW_CONFIG.padding.top - WINDOW_CONFIG.padding.bottom),
    };
}

/**
 * Calculates the SVG container dimensions including shadow padding.
 * @param width - Window frame width.
 * @param height - Window frame height.
 * @returns Object with SVG width, height, and position offsets.
 */
function calculateSvgDimensions(
    width: number,
    height: number,
): { width: number; height: number; top: number; left: number } {
    return {
        width: width + SHADOW_PADDING * 2,
        height: height + SHADOW_PADDING * 2,
        top: WINDOW_CONFIG.padding.top - SHADOW_PADDING,
        left: WINDOW_CONFIG.padding.left - SHADOW_PADDING,
    };
}

/**
 * Creates the main window group container with shadow filter.
 * @returns The window group SVG element.
 */
function createWindowGroup(): SVGGElement {
    return createSvgElement('g', {
        transform: `translate(${SHADOW_PADDING}, ${SHADOW_PADDING})`,
        filter: `url(#${DROP_SHADOW_FILTER_ID})`,
    });
}

/**
 * Creates the window background rectangle.
 * @param width - Width of the background.
 * @param height - Height of the background.
 * @returns The background SVG rect element.
 */
function createWindowBackground(width: number, height: number): SVGRectElement {
    return createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        fill: COLORS.windowBackground,
        'data-name': 'background',
    });
}

/**
 * Creates the window border rectangle.
 * @param width - Width of the window.
 * @param height - Height of the window.
 * @returns The border SVG rect element.
 */
function createWindowBorder(width: number, height: number): SVGRectElement {
    return createSvgElement('rect', {
        x: String(WINDOW_CONFIG.borderWidth / 2),
        y: String(WINDOW_CONFIG.borderWidth / 2),
        width: String(width - WINDOW_CONFIG.borderWidth),
        height: String(height - WINDOW_CONFIG.borderWidth),
        fill: 'none',
        stroke: COLORS.windowBorder,
        'stroke-width': String(WINDOW_CONFIG.borderWidth),
        'data-name': 'border',
    });
}

/**
 * Creates the window frame SVG structure.
 * @param container - The container element to append the SVG to.
 * @param width - Width of the window frame.
 * @param height - Height of the window frame.
 * @returns The created SVG element.
 */
function createWindowFrame(container: HTMLElement, width: number, height: number): SVGSVGElement {
    const svgDimensions = calculateSvgDimensions(width, height);

    const svg = createSvgElement('svg', {
        width: String(svgDimensions.width),
        height: String(svgDimensions.height),
        viewBox: `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
        'data-node-id': '1:2',
        'data-name': 'WF window',
    });

    // Padding from border for all inner elements.
    const borderPadding = WINDOW_CONFIG.borderWidth;

    // Drop shadow filter.
    svg.appendChild(createDropShadowFilter());

    // Window group with all content.
    const windowGroup = createWindowGroup();

    windowGroup.appendChild(createWindowBackground(width, height));
    windowGroup.appendChild(createWindowBorder(width, height));
    windowGroup.appendChild(createTitleBar(borderPadding, borderPadding, width, 'Search'));
    windowGroup.appendChild(createStatusBar(borderPadding, width, height));
    windowGroup.appendChild(createContentArea(borderPadding, width, height));

    svg.appendChild(windowGroup);

    // Position SVG with padding (account for shadow padding offset).
    svg.style.position = 'absolute';
    svg.style.top = `${svgDimensions.top}px`;
    svg.style.left = `${svgDimensions.left}px`;

    container.appendChild(svg);

    return svg;
}

/**
 * Updates the SVG element dimensions and position.
 * @param svg - The SVG element to update.
 * @param width - New window width.
 * @param height - New window height.
 */
function updateSvgDimensions(svg: SVGSVGElement, width: number, height: number): void {
    const svgDimensions = calculateSvgDimensions(width, height);

    svg.setAttribute('width', String(svgDimensions.width));
    svg.setAttribute('height', String(svgDimensions.height));
    svg.setAttribute('viewBox', `0 0 ${svgDimensions.width} ${svgDimensions.height}`);

    svg.style.top = `${svgDimensions.top}px`;
    svg.style.left = `${svgDimensions.left}px`;
}

/**
 * Updates the window background dimensions.
 * @param svg - The SVG element containing the background.
 * @param width - New width.
 * @param height - New height.
 */
function updateWindowBackground(svg: SVGSVGElement, width: number, height: number): void {
    const background = assert(svg.querySelector('rect[data-name="background"]'), 'Background element not found');

    background.setAttribute('width', String(width));
    background.setAttribute('height', String(height));
}

/**
 * Updates the window border dimensions.
 * @param svg - The SVG element containing the border.
 * @param width - New width.
 * @param height - New height.
 */
function updateWindowBorder(svg: SVGSVGElement, width: number, height: number): void {
    const border = assert(svg.querySelector('rect[data-name="border"]'), 'Border element not found');

    border.setAttribute('width', String(width - WINDOW_CONFIG.borderWidth));
    border.setAttribute('height', String(height - WINDOW_CONFIG.borderWidth));
}

/**
 * Handles window resize events and updates the SVG accordingly.
 * @param svg - The SVG element to update.
 */
function handleResize(svg: SVGSVGElement): void {
    const { width, height } = calculateWindowDimensions();
    const borderPadding = WINDOW_CONFIG.borderWidth;

    updateSvgDimensions(svg, width, height);
    updateWindowBackground(svg, width, height);
    updateWindowBorder(svg, width, height);

    updateTitleBar(svg, borderPadding, width);
    updateStatusBar(svg, borderPadding, width, height);
    updateContentArea(svg, borderPadding, width, height);
}

/**
 * Window Frame Component
 * Manages a macOS-style window frame with responsive sizing and drop shadow.
 */
export class WindowFrame {
    private svg: SVGSVGElement;
    private resizeAnimationFrame = 0;
    private resizeHandler: () => void;

    /**
     * Creates a new window frame instance.
     * @param container - The container element to append the window to.
     */
    constructor(container: HTMLElement) {
        const { width, height } = calculateWindowDimensions();

        this.svg = createWindowFrame(container, width, height);

        this.resizeHandler = (): void => {
            cancelAnimationFrame(this.resizeAnimationFrame);
            this.resizeAnimationFrame = requestAnimationFrame(() => handleResize(this.svg));
        };

        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Gets the SVG element representing the window frame.
     * @returns The SVG element.
     */
    getSvg(): SVGSVGElement {
        return this.svg;
    }

    /**
     * Gets the content area element where child content can be added.
     * @returns The content area rectangle element.
     */
    getContentArea(): SVGRectElement {
        return assert(
            this.svg.querySelector<SVGRectElement>('rect[data-name="content-area"]'),
            'Content area element not found',
        );
    }

    /**
     * Destroys the window frame instance and cleans up event listeners.
     */
    destroy(): void {
        window.removeEventListener('resize', this.resizeHandler);
        cancelAnimationFrame(this.resizeAnimationFrame);
        this.svg.remove();
    }
}
