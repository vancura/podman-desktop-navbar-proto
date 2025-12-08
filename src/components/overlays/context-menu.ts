/**
 * Context Menu Component
 * Dropdown menu with items, separators, and submenus.
 */

import { t } from '../../i18n/i18n.js';
import { isRtl } from '../../i18n/i18n.js';
import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';
import {
    createMenuItem,
    getMenuItemHeight,
    MENU_ITEM_CONFIG,
    setMenuItemHovered,
    type MenuItemConfig,
} from './context-menu-item.js';
import { createMenuSeparator, getSeparatorHeight } from './context-menu-separator.js';

/** Menu item definition. */
export interface MenuItemDef {
    id: string;
    labelKey: string;
    shortcut?: string | undefined;
    icon?: string | undefined;
    disabled?: boolean | undefined;
    isDestructive?: boolean | undefined;
    isSeparator?: boolean | undefined;
    submenu?: MenuItemDef[] | undefined;
}

/** Context menu configuration. */
export interface ContextMenuConfig {
    items: MenuItemDef[];
    x: number;
    y: number;
    minWidth?: number | undefined;
}

/** Menu dimensions. */
const MENU_CONFIG = {
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 180,
    maxWidth: 280,
    submenuOffset: -4,
} as const;

/**
 * Measures text width for menu width calculation.
 */
function measureTextWidth(text: string, fontSize: number, fontFamily: string): number {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.visibility = 'hidden';
    svg.style.pointerEvents = 'none';
    document.body.appendChild(svg);

    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('font-size', String(fontSize));
    textElement.setAttribute('font-family', fontFamily);
    textElement.textContent = text;
    svg.appendChild(textElement);

    const bbox = textElement.getBBox();
    document.body.removeChild(svg);

    return bbox.width;
}

/**
 * Calculates the required menu width based on content.
 */
function calculateMenuWidth(items: MenuItemDef[], minWidth: number): number {
    let maxWidth = minWidth;

    for (const item of items) {
        if (item.isSeparator) continue;

        const label = t(item.labelKey);
        let itemWidth = MENU_ITEM_CONFIG.paddingHorizontal * 2;

        // Add icon space if any item has an icon
        if (item.icon) {
            itemWidth += MENU_ITEM_CONFIG.iconSize + MENU_ITEM_CONFIG.iconGap;
        }

        // Add label width
        itemWidth += measureTextWidth(label, TYPOGRAPHY.menuFontSize, TYPOGRAPHY.menuFontFamily);

        // Add shortcut or submenu arrow space
        if (item.shortcut) {
            itemWidth += MENU_ITEM_CONFIG.shortcutGap;
            itemWidth += measureTextWidth(item.shortcut, TYPOGRAPHY.shortcutFontSize, TYPOGRAPHY.shortcutFontFamily);
        } else if (item.submenu) {
            itemWidth += MENU_ITEM_CONFIG.shortcutGap;
            itemWidth += MENU_ITEM_CONFIG.submenuArrowWidth;
        }

        maxWidth = Math.max(maxWidth, itemWidth);
    }

    return Math.min(maxWidth, MENU_CONFIG.maxWidth);
}

/**
 * Calculates the menu height based on items.
 */
function calculateMenuHeight(items: MenuItemDef[]): number {
    let height = MENU_CONFIG.paddingVertical * 2;

    for (const item of items) {
        if (item.isSeparator) {
            height += getSeparatorHeight();
        } else {
            height += getMenuItemHeight();
        }
    }

    return height;
}

/**
 * Adjusts menu position to stay within viewport.
 */
function adjustMenuPosition(
    x: number,
    y: number,
    width: number,
    height: number,
    viewportWidth: number,
    viewportHeight: number,
): { x: number; y: number } {
    let adjustedX = x;
    let adjustedY = y;

    // Adjust horizontal position
    if (isRtl()) {
        // In RTL, menu opens to the left
        if (adjustedX - width < 0) {
            adjustedX = width;
        }
    } else {
        // In LTR, menu opens to the right
        if (adjustedX + width > viewportWidth) {
            adjustedX = viewportWidth - width;
        }
    }

    // Adjust vertical position
    if (adjustedY + height > viewportHeight) {
        adjustedY = Math.max(0, viewportHeight - height);
    }

    return { x: adjustedX, y: adjustedY };
}

/**
 * Creates a context menu.
 * @param config - The menu configuration.
 * @param viewportWidth - The viewport width for positioning.
 * @param viewportHeight - The viewport height for positioning.
 * @returns The menu group element.
 */
export function createContextMenu(
    config: ContextMenuConfig,
    viewportWidth: number,
    viewportHeight: number,
): SVGGElement {
    const { items, x, y, minWidth = MENU_CONFIG.minWidth } = config;

    const menuWidth = calculateMenuWidth(items, minWidth);
    const menuHeight = calculateMenuHeight(items);

    // Adjust position to fit in viewport
    const adjustedPos = adjustMenuPosition(x, y, menuWidth, menuHeight, viewportWidth, viewportHeight);

    // Create menu group
    const group = createSvgElement('g', {
        'data-name': 'context-menu',
        transform: `translate(${adjustedPos.x}, ${adjustedPos.y})`,
    });

    // Background with border
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(menuWidth),
        height: String(menuHeight),
        fill: COLORS.menuBackground,
        stroke: COLORS.menuBorder,
        'stroke-width': String(MENU_CONFIG.borderWidth),
        rx: String(MENU_CONFIG.borderRadius),
        ry: String(MENU_CONFIG.borderRadius),
        'data-name': 'menu-background',
    });
    group.appendChild(background);

    // Create items
    let currentY = MENU_CONFIG.paddingVertical;

    for (const itemDef of items) {
        if (itemDef.isSeparator) {
            const separator = createMenuSeparator(menuWidth);
            separator.setAttribute('transform', `translate(0, ${currentY})`);
            group.appendChild(separator);
            currentY += getSeparatorHeight();
        } else {
            const itemConfig: MenuItemConfig = {
                id: itemDef.id,
                label: t(itemDef.labelKey),
                shortcut: itemDef.shortcut,
                icon: itemDef.icon,
                disabled: itemDef.disabled ?? false,
                hasSubmenu: (itemDef.submenu?.length ?? 0) > 0,
                isDestructive: itemDef.isDestructive ?? false,
            };

            const menuItem = createMenuItem(itemConfig, menuWidth);
            menuItem.setAttribute('transform', `translate(0, ${currentY})`);
            group.appendChild(menuItem);
            currentY += getMenuItemHeight();
        }
    }

    return group;
}

/**
 * Context Menu Manager for handling menu display and interactions.
 */
export class ContextMenuManager {
    private container: SVGGElement;
    private menuGroup: SVGGElement | null = null;
    private submenuGroup: SVGGElement | null = null;
    private items: MenuItemDef[] = [];
    private hoveredItemId: string | null = null;
    private submenuTimeout: number | null = null;
    private onItemSelect: ((itemId: string) => void) | null = null;
    private onClose: (() => void) | null = null;
    private viewportWidth = 0;
    private viewportHeight = 0;
    private boundHandleMouseMove: ((e: MouseEvent) => void) | null = null;
    private boundHandleClick: ((e: MouseEvent) => void) | null = null;
    private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;

    constructor(container: SVGGElement) {
        this.container = container;
    }

    /**
     * Shows a context menu.
     * @param config - The menu configuration.
     * @param viewportWidth - The viewport width.
     * @param viewportHeight - The viewport height.
     * @param onItemSelect - Callback when an item is selected.
     * @param onClose - Callback when the menu is closed.
     */
    show(
        config: ContextMenuConfig,
        viewportWidth: number,
        viewportHeight: number,
        onItemSelect: (itemId: string) => void,
        onClose: () => void,
    ): void {
        this.close();

        this.items = config.items;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.onItemSelect = onItemSelect;
        this.onClose = onClose;

        this.menuGroup = createContextMenu(config, viewportWidth, viewportHeight);
        this.container.appendChild(this.menuGroup);

        // Setup event handlers
        this.setupEventHandlers();
    }

    /**
     * Closes the context menu.
     */
    close(): void {
        this.removeEventHandlers();
        this.clearSubmenuTimeout();

        if (this.submenuGroup) {
            this.submenuGroup.remove();
            this.submenuGroup = null;
        }

        if (this.menuGroup) {
            this.menuGroup.remove();
            this.menuGroup = null;
        }

        this.items = [];
        this.hoveredItemId = null;
        this.onItemSelect = null;
        this.onClose = null;
    }

    /**
     * Sets up event handlers.
     */
    private setupEventHandlers(): void {
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);

        document.addEventListener('mousemove', this.boundHandleMouseMove);
        document.addEventListener('click', this.boundHandleClick);
        document.addEventListener('keydown', this.boundHandleKeyDown);
    }

    /**
     * Removes event handlers.
     */
    private removeEventHandlers(): void {
        if (this.boundHandleMouseMove) {
            document.removeEventListener('mousemove', this.boundHandleMouseMove);
            this.boundHandleMouseMove = null;
        }
        if (this.boundHandleClick) {
            document.removeEventListener('click', this.boundHandleClick);
            this.boundHandleClick = null;
        }
        if (this.boundHandleKeyDown) {
            document.removeEventListener('keydown', this.boundHandleKeyDown);
            this.boundHandleKeyDown = null;
        }
    }

    /**
     * Handles mouse move for hover states.
     */
    private handleMouseMove(e: MouseEvent): void {
        if (!this.menuGroup) return;

        const target = e.target as Element;
        const menuItem = target.closest('[data-name="menu-item"]') as SVGGElement | null;

        // Clear previous hover
        if (this.hoveredItemId) {
            const prevItem = this.menuGroup.querySelector(`[data-item-id="${this.hoveredItemId}"]`) as SVGGElement;
            if (prevItem) {
                setMenuItemHovered(prevItem, false);
            }
        }

        if (menuItem && this.menuGroup.contains(menuItem)) {
            const itemId = menuItem.getAttribute('data-item-id');
            if (itemId) {
                this.hoveredItemId = itemId;
                setMenuItemHovered(menuItem, true);

                // Handle submenu
                const itemDef = this.items.find((i) => i.id === itemId);
                if (itemDef?.submenu && itemDef.submenu.length > 0) {
                    this.scheduleSubmenu(itemDef, menuItem);
                } else {
                    this.hideSubmenu();
                }
            }
        } else if (!this.submenuGroup?.contains(target)) {
            this.hoveredItemId = null;
            this.hideSubmenu();
        }
    }

    /**
     * Handles click events.
     */
    private handleClick(e: MouseEvent): void {
        if (!this.menuGroup) return;

        const target = e.target as Element;
        const menuItem = target.closest('[data-name="menu-item"]') as SVGGElement | null;

        if (menuItem) {
            const itemId = menuItem.getAttribute('data-item-id');
            const itemDef = this.items.find((i) => i.id === itemId);

            if (itemId && itemDef && !itemDef.disabled && !itemDef.submenu) {
                this.onItemSelect?.(itemId);
                this.close();
                return;
            }
        }

        // Click outside menu closes it
        if (!this.menuGroup.contains(target) && !this.submenuGroup?.contains(target)) {
            this.onClose?.();
            this.close();
        }
    }

    /**
     * Handles keyboard events.
     */
    private handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.onClose?.();
            this.close();
        }
    }

    /**
     * Schedules showing a submenu.
     */
    private scheduleSubmenu(itemDef: MenuItemDef, menuItem: SVGGElement): void {
        this.clearSubmenuTimeout();

        this.submenuTimeout = window.setTimeout(() => {
            this.showSubmenu(itemDef, menuItem);
        }, 200);
    }

    /**
     * Shows a submenu.
     */
    private showSubmenu(itemDef: MenuItemDef, menuItem: SVGGElement): void {
        if (!itemDef.submenu || !this.menuGroup) return;

        this.hideSubmenu();

        // Get menu item position
        const menuTransform = this.menuGroup.getAttribute('transform') ?? '';
        const menuMatch = menuTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const menuX = menuMatch?.[1] ? parseFloat(menuMatch[1]) : 0;
        const menuY = menuMatch?.[2] ? parseFloat(menuMatch[2]) : 0;

        const itemTransform = menuItem.getAttribute('transform') ?? '';
        const itemMatch = itemTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const itemY = itemMatch?.[2] ? parseFloat(itemMatch[2]) : 0;

        const menuBackground = this.menuGroup.querySelector('[data-name="menu-background"]');
        const menuWidth = menuBackground ? parseFloat(menuBackground.getAttribute('width') ?? '0') : 180;

        // Calculate submenu position
        const submenuX = menuX + menuWidth + MENU_CONFIG.submenuOffset;
        const submenuY = menuY + itemY;

        const submenuConfig: ContextMenuConfig = {
            items: itemDef.submenu,
            x: submenuX,
            y: submenuY,
        };

        this.submenuGroup = createContextMenu(submenuConfig, this.viewportWidth, this.viewportHeight);
        this.container.appendChild(this.submenuGroup);
    }

    /**
     * Hides the submenu.
     */
    private hideSubmenu(): void {
        this.clearSubmenuTimeout();
        if (this.submenuGroup) {
            this.submenuGroup.remove();
            this.submenuGroup = null;
        }
    }

    /**
     * Clears the submenu timeout.
     */
    private clearSubmenuTimeout(): void {
        if (this.submenuTimeout !== null) {
            window.clearTimeout(this.submenuTimeout);
            this.submenuTimeout = null;
        }
    }

    /**
     * Destroys the menu manager.
     */
    destroy(): void {
        this.close();
    }
}
