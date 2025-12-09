/**
 * Context Menu Component
 * Dropdown menu with items, separators, and submenus.
 */

import { isRtl, t } from '../../i18n/i18n.js';
import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { disableKeyboardHandling, enableKeyboardHandling } from '../../utils/keyboard-utils.js';
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

    // Stop click propagation at menu group level to prevent bubbling to navbar
    group.addEventListener('click', (e) => {
        e.stopPropagation();
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
    private hoveredSubmenuItemId: string | null = null;
    private submenuTimeout: number | null = null;
    private onItemSelect: ((itemId: string) => void) | null = null;
    private onClose: (() => void) | null = null;
    private viewportWidth = 0;
    private viewportHeight = 0;
    private boundHandleMouseMove: ((e: MouseEvent) => void) | null = null;
    private boundHandleClick: ((e: MouseEvent) => void) | null = null;
    private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;
    private focusedIndex = -1;
    private submenuFocusedIndex = -1;
    private isSubmenuActive = false;
    private currentSubmenuItems: MenuItemDef[] = [];

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
        this.focusedIndex = -1;
        this.submenuFocusedIndex = -1;
        this.isSubmenuActive = false;
        this.currentSubmenuItems = [];

        this.menuGroup = createContextMenu(config, viewportWidth, viewportHeight);
        this.container.appendChild(this.menuGroup);

        // Disable navbar keyboard navigation while menu is open
        disableKeyboardHandling();

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
        this.hoveredSubmenuItemId = null;
        this.onItemSelect = null;
        this.onClose = null;
        this.focusedIndex = -1;
        this.submenuFocusedIndex = -1;
        this.isSubmenuActive = false;
        this.currentSubmenuItems = [];

        // Re-enable navbar keyboard navigation
        enableKeyboardHandling();
    }

    /**
     * Sets up event handlers.
     */
    private setupEventHandlers(): void {
        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.boundHandleClick = this.handleClick.bind(this);
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);

        document.addEventListener('mousemove', this.boundHandleMouseMove);
        // Use capture phase so we handle clicks before the menu group stops propagation
        document.addEventListener('click', this.boundHandleClick, true);
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
     * Gets selectable items (non-separator, non-disabled).
     */
    private getSelectableItems(items: MenuItemDef[]): MenuItemDef[] {
        return items.filter((item) => !item.isSeparator && !item.disabled);
    }

    /**
     * Updates visual focus on menu items.
     */
    private updateVisualFocus(): void {
        // Clear all hover states in main menu
        if (this.menuGroup) {
            const allItems = this.menuGroup.querySelectorAll('[data-name="menu-item"]');
            for (const item of allItems) {
                setMenuItemHovered(item as SVGGElement, false);
            }
        }

        // Clear all hover states in submenu
        if (this.submenuGroup) {
            const allSubItems = this.submenuGroup.querySelectorAll('[data-name="menu-item"]');
            for (const item of allSubItems) {
                setMenuItemHovered(item as SVGGElement, false);
            }
        }

        // Set focus on current item
        if (this.isSubmenuActive && this.submenuGroup && this.submenuFocusedIndex >= 0) {
            const selectableItems = this.getSelectableItems(this.currentSubmenuItems);
            const item = selectableItems[this.submenuFocusedIndex];
            if (item) {
                const itemElement = this.submenuGroup.querySelector(
                    `[data-item-id="${item.id}"]`,
                ) as SVGGElement | null;
                if (itemElement) {
                    setMenuItemHovered(itemElement, true);
                }
            }
        } else if (this.menuGroup && this.focusedIndex >= 0) {
            const selectableItems = this.getSelectableItems(this.items);
            const item = selectableItems[this.focusedIndex];
            if (item) {
                const itemElement = this.menuGroup.querySelector(`[data-item-id="${item.id}"]`) as SVGGElement | null;
                if (itemElement) {
                    setMenuItemHovered(itemElement, true);
                }
            }
        }
    }

    /**
     * Handles mouse move for hover states.
     */
    private handleMouseMove(e: MouseEvent): void {
        if (!this.menuGroup) return;

        const target = e.target as Element;
        const menuItem = target.closest('[data-name="menu-item"]') as SVGGElement | null;

        // Reset keyboard focus when mouse moves
        this.focusedIndex = -1;
        this.submenuFocusedIndex = -1;

        // Clear previous hover in main menu
        if (this.hoveredItemId) {
            const prevItem = this.menuGroup.querySelector(`[data-item-id="${this.hoveredItemId}"]`) as SVGGElement;
            if (prevItem) {
                setMenuItemHovered(prevItem, false);
            }
        }

        // Clear previous hover in submenu
        if (this.hoveredSubmenuItemId && this.submenuGroup) {
            const prevSubItem = this.submenuGroup.querySelector(
                `[data-item-id="${this.hoveredSubmenuItemId}"]`,
            ) as SVGGElement;
            if (prevSubItem) {
                setMenuItemHovered(prevSubItem, false);
            }
        }

        // Check if hovering over submenu
        if (menuItem && this.submenuGroup?.contains(menuItem)) {
            const itemId = menuItem.getAttribute('data-item-id');
            if (itemId) {
                this.hoveredSubmenuItemId = itemId;
                this.isSubmenuActive = true;
                setMenuItemHovered(menuItem, true);
            }
            return;
        }

        // Check if hovering over main menu
        if (menuItem && this.menuGroup.contains(menuItem)) {
            const itemId = menuItem.getAttribute('data-item-id');
            if (itemId) {
                this.hoveredItemId = itemId;
                this.hoveredSubmenuItemId = null;
                this.isSubmenuActive = false;
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
            this.hoveredSubmenuItemId = null;
            this.isSubmenuActive = false;
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

            // Check if clicking a submenu item
            if (this.submenuGroup?.contains(menuItem)) {
                const submenuItemDef = this.currentSubmenuItems.find((i) => i.id === itemId);
                if (itemId && submenuItemDef && !submenuItemDef.disabled) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.onItemSelect?.(itemId);
                    this.close();
                    return;
                }
            }

            // Check if clicking a main menu item
            const itemDef = this.items.find((i) => i.id === itemId);

            if (itemId && itemDef && !itemDef.disabled && !itemDef.submenu) {
                // Stop event propagation to prevent bubbling to navbar
                // We're in capture phase, so this stops it before it reaches navbar handler
                e.stopPropagation();
                e.stopImmediatePropagation();

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
     * Handles keyboard events for menu navigation.
     */
    private handleKeyDown(e: KeyboardEvent): void {
        const rtl = isRtl();

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                if (this.isSubmenuActive && this.submenuGroup) {
                    // Close submenu, return to main menu
                    this.isSubmenuActive = false;
                    this.submenuFocusedIndex = -1;
                    this.hideSubmenu();
                    this.updateVisualFocus();
                } else {
                    this.onClose?.();
                    this.close();
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                this.navigateDown();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.navigateUp();
                break;

            case 'ArrowRight':
                e.preventDefault();
                if (rtl) {
                    this.navigateBack();
                } else {
                    this.navigateIntoSubmenu();
                }
                break;

            case 'ArrowLeft':
                e.preventDefault();
                if (rtl) {
                    this.navigateIntoSubmenu();
                } else {
                    this.navigateBack();
                }
                break;

            case 'Enter':
            case ' ':
                e.preventDefault();
                this.selectCurrentItem();
                break;

            case 'Home':
                e.preventDefault();
                this.navigateToFirst();
                break;

            case 'End':
                e.preventDefault();
                this.navigateToLast();
                break;
        }
    }

    /**
     * Navigate down in the menu.
     */
    private navigateDown(): void {
        const items = this.isSubmenuActive ? this.currentSubmenuItems : this.items;
        const selectableItems = this.getSelectableItems(items);
        const indexRef = this.isSubmenuActive ? 'submenuFocusedIndex' : 'focusedIndex';

        if (selectableItems.length === 0) return;

        if (this[indexRef] < selectableItems.length - 1) {
            this[indexRef]++;
        } else {
            this[indexRef] = 0; // Wrap to first
        }

        this.updateVisualFocus();
    }

    /**
     * Navigate up in the menu.
     */
    private navigateUp(): void {
        const items = this.isSubmenuActive ? this.currentSubmenuItems : this.items;
        const selectableItems = this.getSelectableItems(items);
        const indexRef = this.isSubmenuActive ? 'submenuFocusedIndex' : 'focusedIndex';

        if (selectableItems.length === 0) return;

        if (this[indexRef] > 0) {
            this[indexRef]--;
        } else {
            this[indexRef] = selectableItems.length - 1; // Wrap to last
        }

        this.updateVisualFocus();
    }

    /**
     * Navigate into a submenu.
     */
    private navigateIntoSubmenu(): void {
        if (this.isSubmenuActive) return;

        const selectableItems = this.getSelectableItems(this.items);
        if (this.focusedIndex < 0 || this.focusedIndex >= selectableItems.length) return;

        const item = selectableItems[this.focusedIndex];
        if (item && item.submenu && item.submenu.length > 0) {
            // Find the menu item element to position submenu
            const itemElement = this.menuGroup?.querySelector(`[data-item-id="${item.id}"]`) as SVGGElement | null;
            if (itemElement) {
                this.showSubmenu(item, itemElement);
                this.isSubmenuActive = true;
                this.submenuFocusedIndex = 0;
                this.updateVisualFocus();
            }
        }
    }

    /**
     * Navigate back from submenu to main menu.
     */
    private navigateBack(): void {
        if (!this.isSubmenuActive) return;

        this.isSubmenuActive = false;
        this.submenuFocusedIndex = -1;
        this.hideSubmenu();
        this.updateVisualFocus();
    }

    /**
     * Navigate to first item.
     */
    private navigateToFirst(): void {
        const indexRef = this.isSubmenuActive ? 'submenuFocusedIndex' : 'focusedIndex';
        this[indexRef] = 0;
        this.updateVisualFocus();
    }

    /**
     * Navigate to last item.
     */
    private navigateToLast(): void {
        const items = this.isSubmenuActive ? this.currentSubmenuItems : this.items;
        const selectableItems = this.getSelectableItems(items);
        const indexRef = this.isSubmenuActive ? 'submenuFocusedIndex' : 'focusedIndex';
        this[indexRef] = selectableItems.length - 1;
        this.updateVisualFocus();
    }

    /**
     * Select the currently focused item.
     */
    private selectCurrentItem(): void {
        const items = this.isSubmenuActive ? this.currentSubmenuItems : this.items;
        const selectableItems = this.getSelectableItems(items);
        const index = this.isSubmenuActive ? this.submenuFocusedIndex : this.focusedIndex;

        if (index < 0 || index >= selectableItems.length) return;

        const item = selectableItems[index];
        if (!item) return;

        // If item has submenu, open it
        if (item.submenu && item.submenu.length > 0) {
            this.navigateIntoSubmenu();
            return;
        }

        // Otherwise select the item
        this.onItemSelect?.(item.id);
        this.close();
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

        // Store submenu items for keyboard navigation
        this.currentSubmenuItems = itemDef.submenu;

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

        // Calculate submenu position (RTL aware)
        const rtl = isRtl();
        let submenuX: number;
        if (rtl) {
            const submenuWidth = calculateMenuWidth(itemDef.submenu, MENU_CONFIG.minWidth);
            submenuX = menuX - submenuWidth - MENU_CONFIG.submenuOffset;
        } else {
            submenuX = menuX + menuWidth + MENU_CONFIG.submenuOffset;
        }
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
        this.currentSubmenuItems = [];
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
