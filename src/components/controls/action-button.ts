/**
 * Action Button Component
 * Button for content area controls.
 */

import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Action button configuration. */
export interface ActionButtonConfig {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height?: number | undefined;
}

const BUTTON_CONFIG = {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 6,
} as const;

/**
 * Creates an action button.
 * @param config - The button configuration.
 * @param onClick - Click handler.
 * @returns The button group element.
 */
export function createActionButton(config: ActionButtonConfig, onClick: () => void): SVGGElement {
    const { id, label, x, y, width, height = BUTTON_CONFIG.height } = config;

    const group = createSvgElement('g', {
        'data-name': `action-button-${id}`,
        transform: `translate(${x}, ${y})`,
        cursor: 'pointer',
    });

    // Background
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        fill: COLORS.buttonBackground,
        rx: String(BUTTON_CONFIG.borderRadius),
        ry: String(BUTTON_CONFIG.borderRadius),
        'data-name': 'button-background',
    });
    group.appendChild(background);

    // Label
    const textElement = createSvgElement('text', {
        x: String(width / 2),
        y: String(height / 2 + TYPOGRAPHY.buttonFontSize * 0.35),
        fill: COLORS.buttonText,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.buttonFontSize),
        'font-weight': TYPOGRAPHY.buttonFontWeight,
        'text-anchor': 'middle',
        'pointer-events': 'none',
    });
    textElement.textContent = label;
    group.appendChild(textElement);

    // Hover effects
    group.addEventListener('mouseenter', () => {
        background.setAttribute('fill', COLORS.buttonBackgroundHover);
    });

    group.addEventListener('mouseleave', () => {
        background.setAttribute('fill', COLORS.buttonBackground);
    });

    group.addEventListener('mousedown', () => {
        background.setAttribute('fill', COLORS.buttonBackgroundActive);
    });

    group.addEventListener('mouseup', () => {
        background.setAttribute('fill', COLORS.buttonBackgroundHover);
    });

    // Click handler
    group.addEventListener('click', onClick);

    return group;
}

/**
 * Creates a button group with label.
 * @param label - Group label.
 * @param buttons - Button configurations.
 * @param x - X position.
 * @param y - Y position.
 * @param onButtonClick - Click handler with button id.
 * @returns The group element.
 */
export function createButtonGroup(
    label: string,
    buttons: Array<{ id: string; label: string }>,
    x: number,
    y: number,
    onButtonClick: (buttonId: string) => void,
): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'button-group',
        transform: `translate(${x}, ${y})`,
    });

    // Group label
    const labelElement = createSvgElement('text', {
        x: '0',
        y: '0',
        fill: COLORS.textSecondary,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': '11',
        'font-weight': '600',
        'text-transform': 'uppercase',
    });
    labelElement.textContent = label;
    group.appendChild(labelElement);

    // Buttons
    let currentY = 16;
    const buttonWidth = 140;
    const buttonGap = 6;

    for (const buttonConfig of buttons) {
        const button = createActionButton(
            {
                id: buttonConfig.id,
                label: buttonConfig.label,
                x: 0,
                y: currentY,
                width: buttonWidth,
            },
            () => onButtonClick(buttonConfig.id),
        );
        group.appendChild(button);
        currentY += BUTTON_CONFIG.height + buttonGap;
    }

    return group;
}

/**
 * Gets the height of a button.
 */
export function getButtonHeight(): number {
    return BUTTON_CONFIG.height;
}
