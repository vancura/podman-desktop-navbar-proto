/**
 * Traffic Lights Component
 * macOS-style window control buttons (close, minimize, maximize).
 */

import { COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';

const TRAFFIC_LIGHTS_CONFIG = {
    left: 9,
    top: 9,
    spacing: 6,
    circleRadius: 6,
} as const;

/**
 * Creates the traffic lights SVG group.
 * @param offsetX - X offset for positioning (typically border padding).
 * @param offsetY - Y offset for positioning (typically border padding).
 * @returns The SVG group element containing the traffic lights.
 */
export function createTrafficLights(offsetX: number, offsetY: number): SVGGElement {
    const group = createSvgElement('g', {
        'data-node-id': '1:9',
        'data-name': 'traffic lights',
    });

    const { circleRadius, spacing, left, top } = TRAFFIC_LIGHTS_CONFIG;
    const circleDiameter = circleRadius * 2;
    const startX = offsetX + left + circleRadius;
    const centerY = offsetY + top + circleRadius;

    // Close button (red).
    const closeCircle = createSvgElement('circle', {
        cx: String(startX),
        cy: String(centerY),
        r: String(circleRadius),
        fill: COLORS.trafficLightClose,
        'data-name': 'close',
    });

    group.appendChild(closeCircle);

    // Minimize button (orange).
    const minimizeCircle = createSvgElement('circle', {
        cx: String(startX + circleDiameter + spacing),
        cy: String(centerY),
        r: String(circleRadius),
        fill: COLORS.trafficLightMinimize,
        'data-name': 'minimize',
    });

    group.appendChild(minimizeCircle);

    // Maximize button (green).
    const maximizeCircle = createSvgElement('circle', {
        cx: String(startX + (circleDiameter + spacing) * 2),
        cy: String(centerY),
        r: String(circleRadius),
        fill: COLORS.trafficLightMaximize,
        'data-name': 'maximize',
    });

    group.appendChild(maximizeCircle);

    return group;
}
