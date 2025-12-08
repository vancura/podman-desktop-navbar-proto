/**
 * Drop Shadow Filter Component
 * macOS-style drop shadow SVG filter definition.
 */

import { COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';

const DROP_SHADOW_CONFIG = {
    id: 'window-drop-shadow',
    offsetY: 4,
    blur: 12,
    opacity: 0.2,
} as const;

/** Filter ID for referencing in other elements. */
export const DROP_SHADOW_FILTER_ID = DROP_SHADOW_CONFIG.id;

/**
 * Creates the drop shadow SVG filter definition.
 * @returns The SVG defs element containing the filter.
 */
export function createDropShadowFilter(): SVGDefsElement {
    const defs = createSvgElement('defs');

    const filter = createSvgElement('filter', {
        id: DROP_SHADOW_CONFIG.id,
        x: '-50%',
        y: '-50%',
        width: '200%',
        height: '200%',
    });

    // Shadow offset (downward).
    const feOffset = createSvgElement('feOffset', {
        dx: '0',
        dy: String(DROP_SHADOW_CONFIG.offsetY),
        in: 'SourceAlpha',
        result: 'offset',
    });

    filter.appendChild(feOffset);

    // Shadow blur.
    const feGaussianBlur = createSvgElement('feGaussianBlur', {
        in: 'offset',
        stdDeviation: String(DROP_SHADOW_CONFIG.blur),
        result: 'blur',
    });

    filter.appendChild(feGaussianBlur);

    // Shadow color and opacity.
    const feFlood = createSvgElement('feFlood', {
        'flood-color': COLORS.shadowColor,
        'flood-opacity': String(DROP_SHADOW_CONFIG.opacity),
        result: 'shadowColor',
    });

    filter.appendChild(feFlood);

    // Composite shadow color with blur.
    const feComposite1 = createSvgElement('feComposite', {
        in: 'shadowColor',
        in2: 'blur',
        operator: 'in',
        result: 'shadow',
    });

    filter.appendChild(feComposite1);

    // Composite shadow with original.
    const feComposite2 = createSvgElement('feComposite', {
        in: 'SourceGraphic',
        in2: 'shadow',
        operator: 'over',
    });

    filter.appendChild(feComposite2);

    defs.appendChild(filter);

    return defs;
}
