/**
 * NavBar Divider Component
 * Visual separator between navbar sections.
 */

import { COLORS, NAVBAR } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/**
 * Creates a navbar divider line.
 * @param x - X position.
 * @param y - Y position.
 * @param width - Divider width.
 * @returns SVG group element containing the divider.
 */
export function createNavBarDivider(x: number, y: number, width: number): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'navbar-divider',
        transform: `translate(${x}, ${y})`,
    });

    const lineWidth = width - NAVBAR.divider.marginHorizontal * 2;
    const lineX = NAVBAR.divider.marginHorizontal;

    const line = createSvgElement('line', {
        x1: String(lineX),
        y1: '0',
        x2: String(lineX + lineWidth),
        y2: '0',
        stroke: COLORS.navbarDivider,
        'stroke-width': String(NAVBAR.divider.height),
        'data-name': 'divider-line',
    });

    group.appendChild(line);
    return group;
}

/**
 * Gets the total height of a divider including margins.
 * @returns The total height in pixels.
 */
export function getDividerTotalHeight(): number {
    return NAVBAR.divider.height + NAVBAR.divider.marginVertical * 2;
}

/**
 * Updates an existing navbar divider.
 * @param group - The existing SVG group element.
 * @param x - New X position.
 * @param y - New Y position.
 * @param width - New width.
 */
export function updateNavBarDivider(group: SVGGElement, x: number, y: number, width: number): void {
    group.setAttribute('transform', `translate(${x}, ${y})`);

    const line = group.querySelector('[data-name="divider-line"]');
    if (line) {
        const lineWidth = width - NAVBAR.divider.marginHorizontal * 2;
        const lineX = NAVBAR.divider.marginHorizontal;
        line.setAttribute('x1', String(lineX));
        line.setAttribute('x2', String(lineX + lineWidth));
    }
}
