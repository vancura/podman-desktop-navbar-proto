/**
 * Title Bar Component
 * macOS-style window title bar with traffic lights and centered title.
 */

import { BORDER_RADIUS, COLORS, TYPOGRAPHY } from '../utils/design-tokens.js';
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

    // Title bar background.
    const background = createSvgElement('rect', {
        x: String(offsetX),
        y: String(offsetY),
        width: String(width - offsetX * 2),
        height: String(TITLE_BAR_CONFIG.height),
        fill: COLORS.titleBarBackground,
        rx: BORDER_RADIUS,
        'data-name': 'title-bar',
    });

    group.appendChild(background);

    // Traffic lights.
    const trafficLights = createTrafficLights(offsetX, offsetY);

    group.appendChild(trafficLights);

    // Title text.
    const titleText = createSvgElement('text', {
        x: String(width / 2),
        y: String(offsetY + TITLE_BAR_CONFIG.text.top),
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
 * @param group - The title bar group element.
 * @param offsetX - X offset for positioning.
 * @param width - New window width.
 */
export function updateTitleBar(group: SVGGElement, offsetX: number, width: number): void {
    const background = group.querySelector<SVGRectElement>('rect[data-name="title-bar"]');
    const titleText = group.querySelector<SVGTextElement>('text[data-name="title-text"]');

    if (background) {
        background.setAttribute('width', String(width - offsetX * 2));
    }

    if (titleText) {
        titleText.setAttribute('x', String(width / 2));
    }
}
