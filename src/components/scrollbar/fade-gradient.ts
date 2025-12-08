/**
 * Fade Gradient Component
 * Creates gradient overlays to indicate scrollable content.
 */

import { COLORS, NAVBAR } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Gradient position. */
export type GradientPosition = 'top' | 'bottom';

/** Fade gradient configuration. */
export interface FadeGradientConfig {
    position: GradientPosition;
    width: number;
    parentHeight: number;
}

/**
 * Creates a fade gradient definition for use in SVG defs.
 * @param id - Unique ID for the gradient.
 * @param position - Whether this is a top or bottom gradient.
 * @returns The gradient element.
 */
export function createFadeGradientDef(id: string, position: GradientPosition): SVGLinearGradientElement {
    const gradient = createSvgElement('linearGradient', {
        id,
        x1: '0',
        y1: position === 'top' ? '0' : '1',
        x2: '0',
        y2: position === 'top' ? '1' : '0',
    });

    // Solid color at the edge
    const stopSolid = createSvgElement('stop', {
        offset: '0%',
        'stop-color': COLORS.navbarBackground,
        'stop-opacity': '1',
    });

    // Transparent at the content
    const stopTransparent = createSvgElement('stop', {
        offset: '100%',
        'stop-color': COLORS.navbarBackground,
        'stop-opacity': '0',
    });

    gradient.appendChild(stopSolid);
    gradient.appendChild(stopTransparent);

    return gradient;
}

/**
 * Creates a fade gradient overlay.
 * @param config - The gradient configuration.
 * @param gradientId - The ID of the gradient definition to use.
 * @returns The gradient overlay group.
 */
export function createFadeGradient(config: FadeGradientConfig, gradientId: string): SVGGElement {
    const { position, width, parentHeight } = config;
    const height = NAVBAR.scrollbar.fadeHeight;

    const group = createSvgElement('g', {
        'data-name': `fade-gradient-${position}`,
        opacity: '0',
    });

    const y = position === 'top' ? 0 : parentHeight - height;

    const rect = createSvgElement('rect', {
        x: '0',
        y: String(y),
        width: String(width),
        height: String(height),
        fill: `url(#${gradientId})`,
        'pointer-events': 'none',
    });

    group.appendChild(rect);

    return group;
}

/**
 * Updates a fade gradient's visibility.
 * @param group - The gradient group element.
 * @param visible - Whether the gradient should be visible.
 */
export function updateFadeGradientVisibility(group: SVGGElement, visible: boolean): void {
    group.setAttribute('opacity', visible ? '1' : '0');
}

/**
 * Updates a fade gradient's dimensions.
 * @param group - The gradient group element.
 * @param config - The new configuration.
 */
export function updateFadeGradient(group: SVGGElement, config: FadeGradientConfig): void {
    const { position, width, parentHeight } = config;
    const height = NAVBAR.scrollbar.fadeHeight;
    const y = position === 'top' ? 0 : parentHeight - height;

    const rect = group.querySelector('rect');
    if (rect) {
        rect.setAttribute('y', String(y));
        rect.setAttribute('width', String(width));
        rect.setAttribute('height', String(height));
    }
}
