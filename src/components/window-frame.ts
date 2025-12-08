/**
 * Window Frame Component
 * macOS-style window frame with title bar, traffic lights, and drop shadow.
 */

import { BORDER_RADIUS, COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';
import { assert } from '../utils/utils.js';
import { createDropShadowFilter, DROP_SHADOW_FILTER_ID } from './drop-shadow.js';
import { createTitleBar, updateTitleBar } from './title-bar.js';

/** Shadow padding exported for external calculations. */
export const SHADOW_PADDING = 100;

const WINDOW_CONFIG = {
    contentPadding: {
        top: 34,
        right: 20,
        bottom: 20,
        left: 20,
    },

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
 * Creates the window frame SVG structure.
 * @param container - The container element to append the SVG to.
 * @param width - Width of the window frame.
 * @param height - Height of the window frame.
 * @returns The created SVG element.
 */
function createWindowFrame(container: HTMLElement, width: number, height: number): SVGSVGElement {
    const svgWidth = width + SHADOW_PADDING * 2;
    const svgHeight = height + SHADOW_PADDING * 2;

    const svg = createSvgElement('svg', {
        width: String(svgWidth),
        height: String(svgHeight),
        viewBox: `0 0 ${svgWidth} ${svgHeight}`,
        'data-node-id': '1:2',
        'data-name': 'WF window',
    });

    // Padding from border for all inner elements.
    const titleBarPadding = WINDOW_CONFIG.borderWidth;

    // Drop shadow filter.
    const defs = createDropShadowFilter();

    svg.appendChild(defs);

    // Group for window content (offset by shadow padding).
    const windowGroup = createSvgElement('g', {
        transform: `translate(${SHADOW_PADDING}, ${SHADOW_PADDING})`,
        filter: `url(#${DROP_SHADOW_FILTER_ID})`,
    });

    // Window background.
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        fill: COLORS.windowBackground,
        rx: BORDER_RADIUS,
        'data-name': 'background',
    });

    windowGroup.appendChild(background);

    // Window border (around the whole window).
    const border = createSvgElement('rect', {
        x: String(WINDOW_CONFIG.borderWidth / 2),
        y: String(WINDOW_CONFIG.borderWidth / 2),
        width: String(width - WINDOW_CONFIG.borderWidth),
        height: String(height - WINDOW_CONFIG.borderWidth),
        fill: 'none',
        stroke: COLORS.windowBorder,
        'stroke-width': String(WINDOW_CONFIG.borderWidth),
        rx: BORDER_RADIUS,
        'data-name': 'border',
    });

    windowGroup.appendChild(border);

    // Title bar (includes background, traffic lights, and title text).
    const titleBarGroup = createTitleBar(titleBarPadding, titleBarPadding, width, 'Window Title');

    windowGroup.appendChild(titleBarGroup);

    // Content area (for future navigation bar, padded from border).
    const contentAreaX = titleBarPadding + WINDOW_CONFIG.contentPadding.left;
    const contentAreaY = titleBarPadding + WINDOW_CONFIG.contentPadding.top;
    const contentArea = createSvgElement('rect', {
        x: String(contentAreaX),
        y: String(contentAreaY),
        width: String(width - contentAreaX - WINDOW_CONFIG.contentPadding.right - titleBarPadding),
        height: String(height - contentAreaY - WINDOW_CONFIG.contentPadding.bottom - titleBarPadding),
        fill: 'transparent',
        'data-node-id': '1:8',
        'data-name': 'content',
    });

    windowGroup.appendChild(contentArea);

    // Add window group to SVG.
    svg.appendChild(windowGroup);

    // Position SVG with padding (account for shadow padding offset).
    svg.style.position = 'absolute';
    svg.style.top = `${WINDOW_CONFIG.padding.top - SHADOW_PADDING}px`;
    svg.style.left = `${WINDOW_CONFIG.padding.left - SHADOW_PADDING}px`;

    container.appendChild(svg);

    return svg;
}

/**
 * Handles window resize events and updates the SVG accordingly.
 * @param svg - The SVG element to update.
 */
function handleResize(svg: SVGSVGElement): void {
    const { width, height } = calculateWindowDimensions();
    const svgWidth = width + SHADOW_PADDING * 2;
    const svgHeight = height + SHADOW_PADDING * 2;

    svg.setAttribute('width', String(svgWidth));
    svg.setAttribute('height', String(svgHeight));
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    svg.style.top = `${WINDOW_CONFIG.padding.top - SHADOW_PADDING}px`;
    svg.style.left = `${WINDOW_CONFIG.padding.left - SHADOW_PADDING}px`;

    // Update all elements that depend on dimensions.
    const background = assert(svg.querySelector('rect[data-name="background"]'), 'Background element not found');

    background.setAttribute('width', String(width));
    background.setAttribute('height', String(height));

    const border = assert(svg.querySelector('rect[data-name="border"]'), 'Border element not found');

    border.setAttribute('width', String(width - WINDOW_CONFIG.borderWidth));
    border.setAttribute('height', String(height - WINDOW_CONFIG.borderWidth));

    const titleBarPadding = WINDOW_CONFIG.borderWidth;
    const titleBarGroup = assert(
        svg.querySelector<SVGGElement>('g[data-name="title-bar-group"]'),
        'Title bar group not found',
    );

    updateTitleBar(titleBarGroup, titleBarPadding, width);

    const contentAreaX = titleBarPadding + WINDOW_CONFIG.contentPadding.left;
    const contentAreaY = titleBarPadding + WINDOW_CONFIG.contentPadding.top;
    const contentArea = assert(svg.querySelector('rect[data-name="content"]'), 'Content area element not found');

    contentArea.setAttribute('x', String(contentAreaX));
    contentArea.setAttribute('y', String(contentAreaY));
    contentArea.setAttribute(
        'width',
        String(width - contentAreaX - WINDOW_CONFIG.contentPadding.right - titleBarPadding),
    );
    contentArea.setAttribute(
        'height',
        String(height - contentAreaY - WINDOW_CONFIG.contentPadding.bottom - titleBarPadding),
    );
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
            this.svg.querySelector<SVGRectElement>('rect[data-name="content"]'),
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
