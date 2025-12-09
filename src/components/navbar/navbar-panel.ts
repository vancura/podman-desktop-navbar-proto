/**
 * NavBar Panel Base Class
 * Abstract base class for navbar panels (Essentials, Pinned, Regular, Bottom).
 */

import type { IconMode } from '../../state/app-state.js';
import { t } from '../../i18n/i18n.js';
import type { NavItem } from '../../state/navigation-items.js';
import { NAVBAR } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';
import { createNavBarItem, getItemHeight, updateNavBarItem } from './navbar-item.js';

/** Panel configuration. */
export interface PanelConfig {
    /** Unique panel identifier. */
    id: string;
    /** Whether the panel content can scroll. */
    canScroll: boolean;
    /** Whether to show divider above this panel. */
    showDividerAbove: boolean;
    /** Whether to show divider below this panel. */
    showDividerBelow: boolean;
}

/** Render context passed to panels for layout and state. */
export interface RenderContext {
    x: number;
    y: number;
    width: number;
    displayMode: IconMode;
    activeItemId: string | null;
    focusedItemId: string | null;
    hoveredItemId: string | null;
}

/**
 * Abstract base class for navbar panels.
 */
export abstract class NavBarPanel {
    protected group: SVGGElement;
    protected config: PanelConfig;
    protected items: NavItem[] = [];
    protected itemGroups: Map<string, SVGGElement> = new Map();

    constructor(config: PanelConfig) {
        this.config = config;
        this.group = createSvgElement('g', {
            'data-name': `navbar-panel-${config.id}`,
            'data-panel-id': config.id,
        });
    }

    /**
     * Gets the panel's SVG group element.
     */
    getGroup(): SVGGElement {
        return this.group;
    }

    /**
     * Gets the panel configuration.
     */
    getConfig(): PanelConfig {
        return this.config;
    }

    /**
     * Sets the items for this panel.
     * @param items - The navigation items.
     */
    setItems(items: NavItem[]): void {
        this.items = items;
    }

    /**
     * Gets the items in this panel.
     */
    getItems(): NavItem[] {
        return this.items;
    }

    /**
     * Calculates the height needed for this panel.
     * @param displayMode - The display mode.
     * @returns The height in pixels.
     */
    calculateHeight(displayMode: IconMode): number {
        if (this.items.length === 0) {
            return 0;
        }

        const itemHeight = getItemHeight(displayMode);
        const totalItemsHeight = this.items.length * itemHeight;
        const gaps = Math.max(0, this.items.length - 1) * NAVBAR.item.gap;

        return NAVBAR.panel.paddingTop + totalItemsHeight + gaps + NAVBAR.panel.paddingBottom;
    }

    /**
     * Renders the panel.
     * @param context - The render context.
     */
    render(context: RenderContext): void {
        const { x, y, width, displayMode, activeItemId, focusedItemId, hoveredItemId } = context;

        this.group.setAttribute('transform', `translate(${x}, ${y})`);

        // Clear existing items
        this.itemGroups.forEach((group) => group.remove());
        this.itemGroups.clear();

        if (this.items.length === 0) {
            return;
        }

        const itemHeight = getItemHeight(displayMode);
        const itemWidth = width - NAVBAR.panel.paddingHorizontal * 2;
        let currentY = NAVBAR.panel.paddingTop;

        for (const item of this.items) {
            const itemGroup = createNavBarItem({
                item,
                x: NAVBAR.panel.paddingHorizontal,
                y: currentY,
                width: itemWidth,
                displayMode,
                isActive: item.id === activeItemId,
                isFocused: item.id === focusedItemId,
                isHovered: item.id === hoveredItemId,
                translatedLabel: t(item.labelKey),
            });

            this.group.appendChild(itemGroup);
            this.itemGroups.set(item.id, itemGroup);

            currentY += itemHeight + NAVBAR.item.gap;
        }
    }

    /**
     * Updates the panel with new context.
     * @param context - The render context.
     */
    update(context: RenderContext): void {
        const { x, y, width, displayMode, activeItemId, focusedItemId, hoveredItemId } = context;

        this.group.setAttribute('transform', `translate(${x}, ${y})`);

        if (this.items.length === 0) {
            return;
        }

        const itemHeight = getItemHeight(displayMode);
        const itemWidth = width - NAVBAR.panel.paddingHorizontal * 2;
        let currentY = NAVBAR.panel.paddingTop;

        for (const item of this.items) {
            let itemGroup = this.itemGroups.get(item.id);

            if (!itemGroup) {
                // Create new item if it doesn't exist
                itemGroup = createNavBarItem({
                    item,
                    x: NAVBAR.panel.paddingHorizontal,
                    y: currentY,
                    width: itemWidth,
                    displayMode,
                    isActive: item.id === activeItemId,
                    isFocused: item.id === focusedItemId,
                    isHovered: item.id === hoveredItemId,
                    translatedLabel: t(item.labelKey),
                });
                this.group.appendChild(itemGroup);
                this.itemGroups.set(item.id, itemGroup);
            } else {
                // Update existing item
                updateNavBarItem(itemGroup, {
                    item,
                    x: NAVBAR.panel.paddingHorizontal,
                    y: currentY,
                    width: itemWidth,
                    displayMode,
                    isActive: item.id === activeItemId,
                    isFocused: item.id === focusedItemId,
                    isHovered: item.id === hoveredItemId,
                    translatedLabel: t(item.labelKey),
                });
            }

            currentY += itemHeight + NAVBAR.item.gap;
        }

        // Remove items that are no longer in the list
        const currentItemIds = new Set(this.items.map((i) => i.id));
        for (const [id, group] of this.itemGroups) {
            if (!currentItemIds.has(id)) {
                group.remove();
                this.itemGroups.delete(id);
            }
        }
    }

    /**
     * Updates a single item's visual state.
     * @param itemId - The item ID.
     * @param context - The render context.
     */
    updateItemState(itemId: string, context: RenderContext): void {
        const itemGroup = this.itemGroups.get(itemId);
        const item = this.items.find((i) => i.id === itemId);

        if (!itemGroup || !item) {
            return;
        }

        const { width, displayMode, activeItemId, focusedItemId, hoveredItemId } = context;
        const itemWidth = width - NAVBAR.panel.paddingHorizontal * 2;

        // Get current Y position from transform
        const transform = itemGroup.getAttribute('transform') ?? '';
        const match = transform.match(/translate\([^,]+,\s*([^)]+)\)/);
        const currentY = match?.[1] ? parseFloat(match[1]) : 0;

        updateNavBarItem(itemGroup, {
            item,
            x: NAVBAR.panel.paddingHorizontal,
            y: currentY,
            width: itemWidth,
            displayMode,
            isActive: item.id === activeItemId,
            isFocused: item.id === focusedItemId,
            isHovered: item.id === hoveredItemId,
            translatedLabel: t(item.labelKey),
        });
    }

    /**
     * Gets the bounds of an item for tooltip/menu positioning.
     * @param itemId - The item ID.
     * @returns The item bounds, or null if not found.
     */
    getItemBounds(itemId: string): { x: number; y: number; width: number; height: number } | null {
        const itemGroup = this.itemGroups.get(itemId);
        if (!itemGroup) return null;

        const background = itemGroup.querySelector('[data-name="item-background"]');
        if (!background) return null;

        // Get panel transform
        const panelTransform = this.group.getAttribute('transform') ?? '';
        const panelMatch = panelTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const panelX = panelMatch?.[1] ? parseFloat(panelMatch[1]) : 0;
        const panelY = panelMatch?.[2] ? parseFloat(panelMatch[2]) : 0;

        // Get item transform
        const itemTransform = itemGroup.getAttribute('transform') ?? '';
        const itemMatch = itemTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const itemX = itemMatch?.[1] ? parseFloat(itemMatch[1]) : 0;
        const itemY = itemMatch?.[2] ? parseFloat(itemMatch[2]) : 0;

        const width = parseFloat(background.getAttribute('width') ?? '0');
        const height = parseFloat(background.getAttribute('height') ?? '0');

        return {
            x: panelX + itemX,
            y: panelY + itemY,
            width,
            height,
        };
    }

    /**
     * Clears the panel.
     */
    clear(): void {
        this.itemGroups.forEach((group) => group.remove());
        this.itemGroups.clear();
    }

    /**
     * Destroys the panel.
     */
    destroy(): void {
        this.clear();
        this.group.remove();
    }
}
