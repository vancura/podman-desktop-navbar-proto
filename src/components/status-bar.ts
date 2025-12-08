/**
 * Status Bar Component
 */

import { COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';

const STATUS_BAR_CONFIG = {
    height: 32,
} as const;

/** Exported height for external calculations. */
export const STATUS_BAR_HEIGHT = STATUS_BAR_CONFIG.height;

/**
 * Calculates the status bar dimensions based on window size and offset.
 * @param offsetX - X offset for positioning (typically border padding).
 * @param width - Total window width.
 * @param height - Total window height.
 * @returns Object with x, y, width, and height for the status bar.
 */
function calculateStatusBarDimensions(
    offsetX: number,
    width: number,
    height: number,
): { x: number; y: number; width: number; height: number } {
    return {
        x: offsetX,
        y: height - offsetX - STATUS_BAR_CONFIG.height,
        width: width - offsetX * 2,
        height: STATUS_BAR_CONFIG.height,
    };
}

/**
 * Creates the status bar SVG group positioned at the bottom of the window.
 * @param offsetX - X offset for positioning (typically border padding).
 * @param width - Total window width.
 * @param height - Total window height.
 * @returns The SVG group element containing the status bar.
 */
export function createStatusBar(offsetX: number, width: number, height: number): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'status-bar-group',
    });

    const dimensions = calculateStatusBarDimensions(offsetX, width, height);

    // Status bar background.
    const background = createSvgElement('rect', {
        x: String(dimensions.x),
        y: String(dimensions.y),
        width: String(dimensions.width),
        height: String(dimensions.height),
        fill: COLORS.statusBarBackground,
        'data-name': 'status-bar',
    });

    group.appendChild(background);

    return group;
}

/**
 * Updates the status bar dimensions and position on resize.
 * @param svg - The SVG element containing the status bar.
 * @param offsetX - X offset for positioning.
 * @param width - New window width.
 * @param height - New window height.
 */
export function updateStatusBar(svg: SVGSVGElement, offsetX: number, width: number, height: number): void {
    const group = svg.querySelector<SVGGElement>('g[data-name="status-bar-group"]');

    if (!group) {
        return;
    }

    const background = group.querySelector<SVGRectElement>('rect[data-name="status-bar"]');

    if (background) {
        const dimensions = calculateStatusBarDimensions(offsetX, width, height);

        background.setAttribute('y', String(dimensions.y));
        background.setAttribute('width', String(dimensions.width));
    }
}
