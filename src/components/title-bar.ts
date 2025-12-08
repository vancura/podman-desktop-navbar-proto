/**
 * Title Bar Component
 * macOS-style window title bar with traffic lights and centered title.
 */

import { COLORS, TYPOGRAPHY } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';
import { createTrafficLights } from './traffic-lights.js';

const TITLE_BAR_CONFIG = {
    height: 32,

    text: {
        top: 16,
    },
} as const;

/** Exported height for external calculations. */
export const TITLE_BAR_HEIGHT = TITLE_BAR_CONFIG.height;

/**
 * Calculates the title bar dimensions based on window size and offset.
 * @param offsetX - X offset for positioning (typically border padding).
 * @param offsetY - Y offset for positioning (typically border padding).
 * @param width - Total window width.
 * @returns Object with x, y, width, height, and titleX for the title bar.
 */
function calculateTitleBarDimensions(
    offsetX: number,
    offsetY: number,
    width: number,
): { x: number; y: number; width: number; height: number; titleX: number } {
    return {
        x: offsetX,
        y: offsetY,
        width: width - offsetX * 2,
        height: TITLE_BAR_CONFIG.height,
        titleX: width / 2,
    };
}

/**
 * Creates the title bar SVG group.
 * @param offsetX - X offset for positioning (typically border padding).
 * @param offsetY - Y offset for positioning (typically border padding).
 * @param width - Total window width.
 * @param title - Window title text.
 * @returns The SVG group element containing the title bar.
 */
export function createTitleBar(offsetX: number, offsetY: number, width: number, title: string): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'title-bar-group',
    });

    const dimensions = calculateTitleBarDimensions(offsetX, offsetY, width);

    // Title bar background.
    const background = createSvgElement('rect', {
        x: String(dimensions.x),
        y: String(dimensions.y),
        width: String(dimensions.width),
        height: String(dimensions.height),
        fill: COLORS.titleBarBackground,
        'data-name': 'title-bar',
    });

    group.appendChild(background);

    // Traffic lights.
    const trafficLights = createTrafficLights(offsetX, offsetY);

    group.appendChild(trafficLights);

    // Title text.
    const titleText = createSvgElement('text', {
        x: String(dimensions.titleX),
        y: String(dimensions.y + TITLE_BAR_CONFIG.text.top),
        fill: COLORS.textPrimary,
        'font-family': TYPOGRAPHY.fontFamily,
        'font-size': String(TYPOGRAPHY.titleFontSize),
        'font-weight': TYPOGRAPHY.titleFontWeight,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'data-node-id': '1:7',
        'data-name': 'title-text',
    });

    titleText.textContent = title;

    group.appendChild(titleText);

    return group;
}

/**
 * Updates the title bar dimensions on resize.
 * @param svg - The SVG element containing the title bar.
 * @param offsetX - X offset for positioning.
 * @param width - New window width.
 */
export function updateTitleBar(svg: SVGSVGElement, offsetX: number, width: number): void {
    const group = svg.querySelector<SVGGElement>('g[data-name="title-bar-group"]');

    if (!group) {
        return;
    }

    const dimensions = calculateTitleBarDimensions(offsetX, 0, width);
    const background = group.querySelector<SVGRectElement>('rect[data-name="title-bar"]');
    const titleText = group.querySelector<SVGTextElement>('text[data-name="title-text"]');

    if (background) {
        background.setAttribute('width', String(dimensions.width));
    }

    if (titleText) {
        titleText.setAttribute('x', String(dimensions.titleX));
    }
}
