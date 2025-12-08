/**
 * More Button Component
 * Shows hidden items when clicked. Only visible when there are hidden items.
 */

import { t } from '../../i18n/i18n.js';
import { COLORS, NAVBAR, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** More button configuration. */
export interface MoreButtonConfig {
    x: number;
    y: number;
    width: number;
    hiddenCount: number;
    isHovered?: boolean;
    isFocused?: boolean;
}

/**
 * Creates a More button element.
 * @param config - Button configuration.
 * @returns SVG group element, or null if not needed (no hidden items).
 */
export function createMoreButton(config: MoreButtonConfig): SVGGElement | null {
    const { x, y, width, hiddenCount, isHovered, isFocused } = config;

    if (hiddenCount === 0) {
        return null;
    }

    const height = NAVBAR.moreButton.height;

    const group = createSvgElement('g', {
        'data-name': 'more-button',
        transform: `translate(${x}, ${y})`,
    });

    // Background
    const paddingH = NAVBAR.panel.paddingHorizontal;
    const buttonWidth = width - paddingH * 2;

    const background = createSvgElement('rect', {
        x: String(paddingH),
        y: '0',
        width: String(buttonWidth),
        height: String(height),
        rx: String(NAVBAR.item.borderRadius),
        ry: String(NAVBAR.item.borderRadius),
        fill: isHovered ? COLORS.navbarItemHover : 'transparent',
        cursor: 'pointer',
        'data-name': 'more-button-background',
    });
    group.appendChild(background);

    // Focus ring
    if (isFocused) {
        const focusRing = createSvgElement('rect', {
            x: String(paddingH - 2),
            y: '-2',
            width: String(buttonWidth + 4),
            height: String(height + 4),
            rx: String(NAVBAR.item.borderRadius + 2),
            ry: String(NAVBAR.item.borderRadius + 2),
            fill: 'none',
            stroke: COLORS.focusRing,
            'stroke-width': '2',
            'data-name': 'focus-ring',
        });
        group.appendChild(focusRing);
    }

    // Text
    const text = createSvgElement('text', {
        x: String(width / 2),
        y: String(height / 2 + 4),
        'text-anchor': 'middle',
        'font-family': TYPOGRAPHY.navbarItemFontFamily,
        'font-size': String(TYPOGRAPHY.navbarItemFontSize),
        'font-weight': TYPOGRAPHY.navbarItemFontWeight,
        fill: COLORS.navbarText,
        cursor: 'pointer',
        'data-name': 'more-button-text',
    });
    text.textContent = `${t('nav.more')} (${hiddenCount})`;
    group.appendChild(text);

    return group;
}

/**
 * Updates a More button.
 * @param group - The existing SVG group.
 * @param config - New configuration.
 */
export function updateMoreButton(group: SVGGElement, config: MoreButtonConfig): void {
    const { x, y, width, hiddenCount, isHovered, isFocused } = config;

    group.setAttribute('transform', `translate(${x}, ${y})`);

    const height = NAVBAR.moreButton.height;
    const paddingH = NAVBAR.panel.paddingHorizontal;
    const buttonWidth = width - paddingH * 2;

    // Update background
    const background = group.querySelector('[data-name="more-button-background"]');
    if (background) {
        background.setAttribute('width', String(buttonWidth));
        background.setAttribute('fill', isHovered ? COLORS.navbarItemHover : 'transparent');
    }

    // Update or add/remove focus ring
    let focusRing = group.querySelector('[data-name="focus-ring"]');
    if (isFocused && !focusRing) {
        focusRing = createSvgElement('rect', {
            x: String(paddingH - 2),
            y: '-2',
            width: String(buttonWidth + 4),
            height: String(height + 4),
            rx: String(NAVBAR.item.borderRadius + 2),
            ry: String(NAVBAR.item.borderRadius + 2),
            fill: 'none',
            stroke: COLORS.focusRing,
            'stroke-width': '2',
            'data-name': 'focus-ring',
        });
        group.insertBefore(focusRing, group.firstChild);
    } else if (!isFocused && focusRing) {
        focusRing.remove();
    } else if (isFocused && focusRing) {
        focusRing.setAttribute('width', String(buttonWidth + 4));
    }

    // Update text
    const text = group.querySelector('[data-name="more-button-text"]');
    if (text) {
        text.setAttribute('x', String(width / 2));
        text.textContent = `${t('nav.more')} (${hiddenCount})`;
    }
}

/**
 * Gets the height of the More button.
 * @returns The height in pixels.
 */
export function getMoreButtonHeight(): number {
    return NAVBAR.moreButton.height + NAVBAR.moreButton.paddingVertical * 2;
}
