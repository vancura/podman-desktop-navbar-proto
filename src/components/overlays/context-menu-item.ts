/**
 * Context Menu Item Component
 * Individual menu item with optional submenu indicator.
 */

import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';
import { createIcon, type IconName } from '../../icons/icons.js';

/** Menu item configuration. */
export interface MenuItemConfig {
    id: string;
    label: string;
    shortcut: string | undefined;
    icon: string | undefined;
    disabled: boolean;
    hasSubmenu: boolean;
    isDestructive: boolean;
}

/** Menu item dimensions. */
export const MENU_ITEM_CONFIG = {
    height: 28,
    paddingHorizontal: 12,
    iconSize: 16,
    iconGap: 8,
    shortcutGap: 24,
    submenuArrowWidth: 16,
    borderRadius: 4,
} as const;

/**
 * Creates a menu item element.
 * @param config - The menu item configuration.
 * @param width - The width of the menu item.
 * @returns The menu item group element.
 */
export function createMenuItem(config: MenuItemConfig, width: number): SVGGElement {
    const { id, label, shortcut, icon, disabled, hasSubmenu, isDestructive } = config;

    const group = createSvgElement('g', {
        'data-name': 'menu-item',
        'data-item-id': id,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? '0.5' : '1',
    });

    // Background (for hover state)
    const background = createSvgElement('rect', {
        x: String(MENU_ITEM_CONFIG.paddingHorizontal / 2),
        y: '0',
        width: String(width - MENU_ITEM_CONFIG.paddingHorizontal),
        height: String(MENU_ITEM_CONFIG.height),
        fill: 'transparent',
        rx: String(MENU_ITEM_CONFIG.borderRadius),
        ry: String(MENU_ITEM_CONFIG.borderRadius),
        'data-name': 'menu-item-background',
    });
    group.appendChild(background);

    let contentX = MENU_ITEM_CONFIG.paddingHorizontal;

    // Icon (if present)
    if (icon) {
        const iconGroup = createIcon(icon as IconName, 'outline', MENU_ITEM_CONFIG.iconSize);
        iconGroup.setAttribute(
            'transform',
            `translate(${contentX}, ${(MENU_ITEM_CONFIG.height - MENU_ITEM_CONFIG.iconSize) / 2})`,
        );

        // Set icon color
        const iconPath = iconGroup.querySelector('path');
        if (iconPath) {
            iconPath.setAttribute('fill', isDestructive ? '#f85149' : COLORS.menuItemText);
        }

        group.appendChild(iconGroup);
        contentX += MENU_ITEM_CONFIG.iconSize + MENU_ITEM_CONFIG.iconGap;
    }

    // Label
    const textY = MENU_ITEM_CONFIG.height / 2 + TYPOGRAPHY.menuFontSize * 0.35;
    const labelText = createSvgElement('text', {
        x: String(contentX),
        y: String(textY),
        fill: isDestructive ? '#f85149' : COLORS.menuItemText,
        'font-family': TYPOGRAPHY.menuFontFamily,
        'font-size': String(TYPOGRAPHY.menuFontSize),
        'font-weight': TYPOGRAPHY.menuFontWeight,
        'pointer-events': 'none',
    });
    labelText.textContent = label;
    group.appendChild(labelText);

    // Shortcut (if present and no submenu)
    if (shortcut && !hasSubmenu) {
        const shortcutText = createSvgElement('text', {
            x: String(width - MENU_ITEM_CONFIG.paddingHorizontal),
            y: String(textY),
            fill: COLORS.tooltipShortcut,
            'font-family': TYPOGRAPHY.shortcutFontFamily,
            'font-size': String(TYPOGRAPHY.shortcutFontSize),
            'font-weight': TYPOGRAPHY.shortcutFontWeight,
            'text-anchor': 'end',
            'pointer-events': 'none',
        });
        shortcutText.textContent = shortcut;
        group.appendChild(shortcutText);
    }

    // Submenu arrow (if has submenu)
    if (hasSubmenu) {
        const arrowX = width - MENU_ITEM_CONFIG.paddingHorizontal - MENU_ITEM_CONFIG.submenuArrowWidth / 2;
        const arrowY = MENU_ITEM_CONFIG.height / 2;

        // Simple chevron right arrow
        const arrow = createSvgElement('path', {
            d: 'M5 3l4 4-4 4',
            transform: `translate(${arrowX - 6}, ${arrowY - 5})`,
            fill: 'none',
            stroke: COLORS.menuSubmenuArrow,
            'stroke-width': '1.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'pointer-events': 'none',
        });
        group.appendChild(arrow);
    }

    return group;
}

/**
 * Sets the hover state for a menu item.
 * @param group - The menu item group element.
 * @param hovered - Whether the item is hovered.
 */
export function setMenuItemHovered(group: SVGGElement, hovered: boolean): void {
    const background = group.querySelector('[data-name="menu-item-background"]');
    if (background) {
        background.setAttribute('fill', hovered ? COLORS.menuItemHover : 'transparent');
    }
}

/**
 * Gets the height of a menu item.
 */
export function getMenuItemHeight(): number {
    return MENU_ITEM_CONFIG.height;
}
