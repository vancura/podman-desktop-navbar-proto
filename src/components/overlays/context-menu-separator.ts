/**
 * Context Menu Separator Component
 * Horizontal divider line for menu sections.
 */

import { COLORS } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Separator dimensions. */
export const SEPARATOR_CONFIG = {
    height: 9,
    lineHeight: 1,
    marginHorizontal: 12,
} as const;

/**
 * Creates a menu separator element.
 * @param width - The width of the menu.
 * @returns The separator group element.
 */
export function createMenuSeparator(width: number): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'menu-separator',
    });

    const lineY = (SEPARATOR_CONFIG.height - SEPARATOR_CONFIG.lineHeight) / 2;

    const line = createSvgElement('line', {
        x1: String(SEPARATOR_CONFIG.marginHorizontal),
        y1: String(lineY),
        x2: String(width - SEPARATOR_CONFIG.marginHorizontal),
        y2: String(lineY),
        stroke: COLORS.menuSeparator,
        'stroke-width': String(SEPARATOR_CONFIG.lineHeight),
    });

    group.appendChild(line);

    return group;
}

/**
 * Gets the height of a separator.
 */
export function getSeparatorHeight(): number {
    return SEPARATOR_CONFIG.height;
}
