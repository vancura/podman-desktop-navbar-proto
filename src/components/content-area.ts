/**
 * Content Area Component
 * Main content area within the window frame, positioned next to the navbar.
 */

import { COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';

/** Content area padding configuration. */
const CONTENT_AREA_CONFIG = {
    padding: {
        top: 34,
        right: 8,
        bottom: 34,
    },
} as const;

/** Exported padding for external calculations. */
export const CONTENT_AREA_PADDING = CONTENT_AREA_CONFIG.padding;

/**
 * Calculates the content area dimensions based on window size and navbar state.
 * @param borderPadding - Border padding value.
 * @param windowWidth - Total window width.
 * @param windowHeight - Total window height.
 * @param navbarWidth - Current navbar width.
 * @param isRtl - Whether RTL mode is enabled.
 * @returns Object with x, y, width, and height for the content area.
 */
function calculateContentAreaDimensions(
    borderPadding: number,
    windowWidth: number,
    windowHeight: number,
    navbarWidth: number,
    isRtl: boolean,
): { x: number; y: number; width: number; height: number } {
    const y = borderPadding + CONTENT_AREA_CONFIG.padding.top;

    // In RTL mode, content area is on the left, navbar on the right
    const x = isRtl ? borderPadding + CONTENT_AREA_CONFIG.padding.right : borderPadding + navbarWidth;

    const availableWidth = windowWidth - navbarWidth - CONTENT_AREA_CONFIG.padding.right - borderPadding * 2;

    return {
        x,
        y,
        width: Math.max(0, availableWidth),
        height: windowHeight - y - CONTENT_AREA_CONFIG.padding.bottom - borderPadding,
    };
}

/**
 * Creates the content area SVG group.
 * @param borderPadding - Border padding value.
 * @param width - Total window width.
 * @param height - Total window height.
 * @param navbarWidth - Current navbar width.
 * @param isRtl - Whether RTL mode is enabled.
 * @returns The SVG group element containing the content area.
 */
export function createContentArea(
    borderPadding: number,
    width: number,
    height: number,
    navbarWidth: number,
    isRtl: boolean,
): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'content-area-group',
    });

    const dimensions = calculateContentAreaDimensions(borderPadding, width, height, navbarWidth, isRtl);

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
 * @param navbarWidth - Current navbar width.
 * @param isRtl - Whether RTL mode is enabled.
 */
export function updateContentArea(
    svg: SVGSVGElement,
    borderPadding: number,
    width: number,
    height: number,
    navbarWidth: number,
    isRtl: boolean,
): void {
    const group = svg.querySelector<SVGGElement>('g[data-name="content-area-group"]');

    if (!group) {
        return;
    }

    const background = group.querySelector<SVGRectElement>('rect[data-name="content-area"]');

    if (background) {
        const dimensions = calculateContentAreaDimensions(borderPadding, width, height, navbarWidth, isRtl);

        background.setAttribute('x', String(dimensions.x));
        background.setAttribute('y', String(dimensions.y));
        background.setAttribute('width', String(dimensions.width));
        background.setAttribute('height', String(dimensions.height));
    }
}

/**
 * Gets the content area bounds from the SVG element.
 * @param svg - The SVG element containing the content area.
 * @returns The bounds or null if not found.
 */
export function getContentAreaBounds(
    svg: SVGSVGElement,
): { x: number; y: number; width: number; height: number } | null {
    const background = svg.querySelector<SVGRectElement>('rect[data-name="content-area"]');

    if (!background) {
        return null;
    }

    return {
        x: parseFloat(background.getAttribute('x') ?? '0'),
        y: parseFloat(background.getAttribute('y') ?? '0'),
        width: parseFloat(background.getAttribute('width') ?? '0'),
        height: parseFloat(background.getAttribute('height') ?? '0'),
    };
}
