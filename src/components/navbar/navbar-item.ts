/**
 * NavBar Item Component
 * Individual navigation item with icon and optional title.
 */

import type { IconMode } from '../../state/app-state.js';
import { createIcon, type IconName, type IconVariant } from '../../icons/icons.js';
import type { NavItem } from '../../state/navigation-items.js';
import { COLORS, NAVBAR, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** NavBar item configuration. */
export interface NavBarItemConfig {
    item: NavItem;
    x: number;
    y: number;
    width: number;
    displayMode: IconMode;
    isActive?: boolean;
    isFocused?: boolean;
    isHovered?: boolean;
    translatedLabel: string;
}

/**
 * Calculates the item height based on display mode.
 * @param displayMode - The display mode.
 * @returns The item height in pixels.
 */
export function getItemHeight(displayMode: IconMode): number {
    return displayMode === 'icons-only' ? NAVBAR.item.heightIconOnly : NAVBAR.item.height;
}

/**
 * Truncates text to fit within a given width.
 * @param text - The text to truncate.
 * @param maxWidth - Maximum width in pixels.
 * @param fontSize - Font size in pixels.
 * @returns Object with truncated text and whether truncation occurred.
 */
function truncateText(text: string, maxWidth: number, fontSize: number): { text: string; truncated: boolean } {
    // Approximate character width (will vary by font)
    const avgCharWidth = fontSize * 0.6;
    const ellipsisWidth = avgCharWidth * 3;
    const maxChars = Math.floor((maxWidth - ellipsisWidth) / avgCharWidth);

    if (text.length * avgCharWidth <= maxWidth) {
        return { text, truncated: false };
    }

    return {
        text: text.slice(0, Math.max(0, maxChars)) + '...',
        truncated: true,
    };
}

/**
 * Creates a NavBar item SVG group.
 * @param config - Item configuration.
 * @returns SVG group element.
 */
export function createNavBarItem(config: NavBarItemConfig): SVGGElement {
    const { item, x, y, width, displayMode, isActive, isFocused, isHovered, translatedLabel } = config;
    const height = getItemHeight(displayMode);

    const group = createSvgElement('g', {
        'data-name': 'navbar-item',
        'data-item-id': item.id,
        'data-item-category': item.originalCategory,
        transform: `translate(${x}, ${y})`,
    });

    // Background/hit area - use 'visible' to capture clicks even when fill is transparent
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        rx: String(NAVBAR.item.borderRadius),
        ry: String(NAVBAR.item.borderRadius),
        fill: isActive ? COLORS.navbarItemSelected : isHovered ? COLORS.navbarItemHover : 'transparent',
        'data-name': 'item-background',
        cursor: 'pointer',
        'pointer-events': 'visible',
    });
    group.appendChild(background);

    // Focus ring
    if (isFocused) {
        const focusRing = createSvgElement('rect', {
            x: '-2',
            y: '-2',
            width: String(width + 4),
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

    // Icon container
    const iconSize = displayMode === 'icons-only' ? NAVBAR.item.iconSizeDense : NAVBAR.item.iconSize;
    const iconColor = isActive ? COLORS.navbarTextActive : COLORS.navbarText;

    if (displayMode === 'icons-only') {
        // Center icon vertically and horizontally
        const iconX = (width - iconSize) / 2;
        const iconY = (height - iconSize) / 2;

        const iconGroup = createSvgElement('g', {
            transform: `translate(${iconX}, ${iconY})`,
            'data-name': 'item-icon',
        });

        const icon = createIcon(item.icon as IconName, item.iconVariant as IconVariant, iconSize, iconColor);
        iconGroup.appendChild(icon);
        group.appendChild(iconGroup);
    } else {
        // Icon on top, title below
        const iconX = (width - iconSize) / 2;
        const iconY = NAVBAR.item.paddingVertical;

        const iconGroup = createSvgElement('g', {
            transform: `translate(${iconX}, ${iconY})`,
            'data-name': 'item-icon',
        });

        const icon = createIcon(item.icon as IconName, item.iconVariant as IconVariant, iconSize, iconColor);
        iconGroup.appendChild(icon);
        group.appendChild(iconGroup);

        // Title
        const titleY = iconY + iconSize + NAVBAR.item.gap + TYPOGRAPHY.navbarItemFontSize;
        const maxTextWidth = width - NAVBAR.item.paddingHorizontal * 2;
        const { text: displayText, truncated } = truncateText(
            translatedLabel,
            maxTextWidth,
            TYPOGRAPHY.navbarItemFontSize,
        );

        const title = createSvgElement('text', {
            x: String(width / 2),
            y: String(titleY),
            'text-anchor': 'middle',
            'font-family': TYPOGRAPHY.navbarItemFontFamily,
            'font-size': String(TYPOGRAPHY.navbarItemFontSize),
            'font-weight': TYPOGRAPHY.navbarItemFontWeight,
            fill: isActive ? COLORS.navbarTextActive : COLORS.navbarText,
            'data-name': 'item-title',
            'data-truncated': truncated ? 'true' : 'false',
        });
        title.textContent = displayText;
        group.appendChild(title);
    }

    return group;
}

/**
 * Updates an existing NavBar item.
 * @param group - The existing SVG group element.
 * @param config - Updated configuration.
 */
export function updateNavBarItem(group: SVGGElement, config: NavBarItemConfig): void {
    const { x, y, width, displayMode, isActive, isFocused, isHovered, translatedLabel } = config;
    const height = getItemHeight(displayMode);

    group.setAttribute('transform', `translate(${x}, ${y})`);

    // Update background
    const background = group.querySelector('[data-name="item-background"]');
    if (background) {
        background.setAttribute('width', String(width));
        background.setAttribute('height', String(height));
        background.setAttribute(
            'fill',
            isActive ? COLORS.navbarItemSelected : isHovered ? COLORS.navbarItemHover : 'transparent',
        );
    }

    // Update or add/remove focus ring
    let focusRing = group.querySelector('[data-name="focus-ring"]');
    if (isFocused && !focusRing) {
        focusRing = createSvgElement('rect', {
            x: '-2',
            y: '-2',
            width: String(width + 4),
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
        focusRing.setAttribute('width', String(width + 4));
        focusRing.setAttribute('height', String(height + 4));
    }

    // Update icon position
    const iconSize = displayMode === 'icons-only' ? NAVBAR.item.iconSizeDense : NAVBAR.item.iconSize;
    const iconGroup = group.querySelector('[data-name="item-icon"]');
    const iconColor = isActive ? COLORS.navbarTextActive : COLORS.navbarText;

    if (iconGroup) {
        if (displayMode === 'icons-only') {
            const iconX = (width - iconSize) / 2;
            const iconY = (height - iconSize) / 2;
            iconGroup.setAttribute('transform', `translate(${iconX}, ${iconY})`);
        } else {
            const iconX = (width - iconSize) / 2;
            const iconY = NAVBAR.item.paddingVertical;
            iconGroup.setAttribute('transform', `translate(${iconX}, ${iconY})`);
        }

        // Update icon color
        const iconPath = iconGroup.querySelector('path');
        if (iconPath) {
            const variant = iconPath.getAttribute('fill') === 'none' ? 'outline' : 'filled';
            if (variant === 'outline') {
                iconPath.setAttribute('stroke', iconColor);
            } else {
                iconPath.setAttribute('fill', iconColor);
            }
        }
    }

    // Update or add/remove title
    let title = group.querySelector('[data-name="item-title"]') as SVGTextElement | null;

    if (displayMode === 'icons-titles') {
        const titleY = NAVBAR.item.paddingVertical + iconSize + NAVBAR.item.gap + TYPOGRAPHY.navbarItemFontSize;
        const maxTextWidth = width - NAVBAR.item.paddingHorizontal * 2;
        const { text: displayText, truncated } = truncateText(
            translatedLabel,
            maxTextWidth,
            TYPOGRAPHY.navbarItemFontSize,
        );

        if (!title) {
            title = createSvgElement('text', {
                x: String(width / 2),
                y: String(titleY),
                'text-anchor': 'middle',
                'font-family': TYPOGRAPHY.navbarItemFontFamily,
                'font-size': String(TYPOGRAPHY.navbarItemFontSize),
                'font-weight': TYPOGRAPHY.navbarItemFontWeight,
                fill: isActive ? COLORS.navbarTextActive : COLORS.navbarText,
                'data-name': 'item-title',
                'data-truncated': truncated ? 'true' : 'false',
            }) as SVGTextElement;
            title.textContent = displayText;
            group.appendChild(title);
        } else {
            title.setAttribute('x', String(width / 2));
            title.setAttribute('y', String(titleY));
            title.setAttribute('fill', isActive ? COLORS.navbarTextActive : COLORS.navbarText);
            title.setAttribute('data-truncated', truncated ? 'true' : 'false');
            title.textContent = displayText;
        }
    } else if (title) {
        title.remove();
    }
}

/**
 * Creates a simple item for the More menu dropdown.
 * @param item - The navigation item.
 * @param x - X position.
 * @param y - Y position.
 * @param width - Item width.
 * @param translatedLabel - The translated label.
 * @returns SVG group element.
 */
export function createSimpleNavBarItem(
    item: NavItem,
    x: number,
    y: number,
    width: number,
    translatedLabel: string,
): SVGGElement {
    const height = 32;

    const group = createSvgElement('g', {
        'data-name': 'navbar-item-simple',
        'data-item-id': item.id,
        transform: `translate(${x}, ${y})`,
    });

    // Background
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        rx: '4',
        ry: '4',
        fill: 'transparent',
        'data-name': 'item-background',
        cursor: 'pointer',
    });
    group.appendChild(background);

    // Icon
    const iconSize = 16;
    const iconX = 8;
    const iconY = (height - iconSize) / 2;

    const iconGroup = createSvgElement('g', {
        transform: `translate(${iconX}, ${iconY})`,
    });

    const icon = createIcon(item.icon as IconName, 'outline', iconSize, COLORS.navbarText);
    iconGroup.appendChild(icon);
    group.appendChild(iconGroup);

    // Title
    const title = createSvgElement('text', {
        x: String(iconX + iconSize + 8),
        y: String(height / 2 + 4),
        'font-family': TYPOGRAPHY.menuFontFamily,
        'font-size': String(TYPOGRAPHY.menuFontSize),
        'font-weight': TYPOGRAPHY.menuFontWeight,
        fill: COLORS.navbarText,
        'data-name': 'item-title',
    });
    title.textContent = translatedLabel;
    group.appendChild(title);

    return group;
}
