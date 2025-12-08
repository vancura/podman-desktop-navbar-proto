/**
 * Content Area Component
 * Main content area within the window frame.
 */

import { COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';

const CONTENT_AREA_CONFIG = {
    padding: {
        top: 34,
        right: 0,
        bottom: 34,
        left: 80,
    },
} as const;

/** Exported padding for external calculations. */
export const CONTENT_AREA_PADDING = CONTENT_AREA_CONFIG.padding;

/**
 * Calculates the content area dimensions based on window size and border padding.
 * @param borderPadding - Border padding value.
 * @param windowWidth - Total window width.
 * @param windowHeight - Total window height.
 * @returns Object with x, y, width, and height for the content area.
 */
function calculateContentAreaDimensions(
    borderPadding: number,
    windowWidth: number,
    windowHeight: number,
): { x: number; y: number; width: number; height: number } {
    const x = borderPadding + CONTENT_AREA_CONFIG.padding.left;
    const y = borderPadding + CONTENT_AREA_CONFIG.padding.top;

    return {
        x,
        y,
        width: windowWidth - x - CONTENT_AREA_CONFIG.padding.right - borderPadding,
        height: windowHeight - y - CONTENT_AREA_CONFIG.padding.bottom - borderPadding,
    };
}

/**
 * Creates the content area SVG group.
 * @param borderPadding - Border padding value.
 * @param width - Total window width.
 * @param height - Total window height.
 * @returns The SVG group element containing the content area.
 */
export function createContentArea(borderPadding: number, width: number, height: number): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'content-area-group',
    });

    const dimensions = calculateContentAreaDimensions(borderPadding, width, height);

    // Content area background.
    const background = createSvgElement('rect', {
        x: String(dimensions.x),
        y: String(dimensions.y),
        width: String(dimensions.width),
        height: String(dimensions.height),
        fill: COLORS.contentAreaBackground,
        'data-node-id': '1:8',
        'data-name': 'content-area',
    });

    group.appendChild(background);

    return group;
}

/**
 * Updates the content area dimensions and position on resize.
 * @param svg - The SVG element containing the content area.
 * @param borderPadding - Border padding value.
 * @param width - New window width.
 * @param height - New window height.
 */
export function updateContentArea(svg: SVGSVGElement, borderPadding: number, width: number, height: number): void {
    const group = svg.querySelector<SVGGElement>('g[data-name="content-area-group"]');

    if (!group) {
        return;
    }

    const background = group.querySelector<SVGRectElement>('rect[data-name="content-area"]');

    if (background) {
        const dimensions = calculateContentAreaDimensions(borderPadding, width, height);

        background.setAttribute('x', String(dimensions.x));
        background.setAttribute('y', String(dimensions.y));
        background.setAttribute('width', String(dimensions.width));
        background.setAttribute('height', String(dimensions.height));
    }
}
