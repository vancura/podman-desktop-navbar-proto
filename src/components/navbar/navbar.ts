/**
 * NavBar Component
 * Main navigation bar container that composes all panels.
 */

import type { NavBarState } from '../../state/navbar-state.js';
import { COLORS, NAVBAR } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';
import { TooltipManager } from '../overlays/tooltip.js';
import {
    createFadeGradient,
    createFadeGradientDef,
    updateFadeGradient,
    updateFadeGradientVisibility,
} from '../scrollbar/fade-gradient.js';
import {
    createScrollbar,
    hideScrollbar,
    needsScrollbar,
    setupScrollbarDragHandlers,
    showScrollbar,
    updateScrollbar,
} from '../scrollbar/scrollbar.js';
import { BottomPanel } from './bottom-panel.js';
import { EssentialsPanel } from './essentials-panel.js';
import { createNavBarDivider, getDividerTotalHeight } from './navbar-divider.js';
import type { ItemDisplayMode } from './navbar-item.js';
import type { PanelRenderContext } from './navbar-panel.js';
import { PinnedPanel } from './pinned-panel.js';
import { RegularPanel } from './regular-panel.js';

/** NavBar configuration. */
export interface NavBarConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}


/**
 * Main NavBar component.
 * Orchestrates all panels and handles layout.
 */
export class NavBar {
    private group: SVGGElement;
    private backgroundRect: SVGRectElement;
    private contentGroup: SVGGElement;
    private scrollableGroup: SVGGElement;
    private clipPath: SVGClipPathElement;
    private clipRect: SVGRectElement;

    // Panels
    private essentialsPanel: EssentialsPanel;
    private pinnedPanel: PinnedPanel;
    private regularPanel: RegularPanel;
    private bottomPanel: BottomPanel;

    // Dividers
    private dividers: Map<string, SVGGElement> = new Map();

    // Scrollbar and fade gradients
    private scrollbarGroup: SVGGElement | null = null;
    private fadeGradientTop: SVGGElement | null = null;
    private fadeGradientBottom: SVGGElement | null = null;
    private cleanupScrollbarHandlers: (() => void) | null = null;
    private scrollbarHideTimeout: (() => void) | null = null;
    private fadeTopGradientId = '';
    private fadeBottomGradientId = '';

    // Tooltip
    private tooltipManager: TooltipManager | null = null;
    private overlayGroup: SVGGElement | null = null;

    // Configuration
    private config: NavBarConfig;
    private displayMode: ItemDisplayMode = 'icons-titles';
    private activeItemId: string | null = null;
    private focusedItemId: string | null = null;
    private hoveredItemId: string | null = null;

    // Scroll state
    private scrollTop = 0;
    private maxScrollTop = 0;
    private scrollableHeight = 0;
    private viewportHeight = 0;

    constructor(config: NavBarConfig) {
        this.config = config;

        // Create main group
        this.group = createSvgElement('g', {
            'data-name': 'navbar',
            transform: `translate(${config.x}, ${config.y})`,
        });

        // Create background
        this.backgroundRect = createSvgElement('rect', {
            x: '0',
            y: '0',
            width: String(config.width),
            height: String(config.height),
            fill: COLORS.navbarBackground,
            'data-name': 'navbar-background',
        });
        this.group.appendChild(this.backgroundRect);

        // Create clip path for scrollable content
        const clipId = `navbar-clip-${Date.now()}`;
        this.clipPath = createSvgElement('clipPath', { id: clipId });
        this.clipRect = createSvgElement('rect', {
            x: '0',
            y: '0',
            width: String(config.width),
            height: String(config.height),
        });
        this.clipPath.appendChild(this.clipRect);

        // Add clip path and gradient defs
        const defs = createSvgElement('defs', {});
        defs.appendChild(this.clipPath);

        // Add fade gradient definitions
        this.fadeTopGradientId = `navbar-fade-top-${Date.now()}`;
        this.fadeBottomGradientId = `navbar-fade-bottom-${Date.now()}`;
        defs.appendChild(createFadeGradientDef(this.fadeTopGradientId, 'top'));
        defs.appendChild(createFadeGradientDef(this.fadeBottomGradientId, 'bottom'));

        this.group.appendChild(defs);

        // Create content group
        this.contentGroup = createSvgElement('g', {
            'data-name': 'navbar-content',
            'clip-path': `url(#${clipId})`,
        });
        this.group.appendChild(this.contentGroup);

        // Create scrollable group for Essentials, Pinned, and Regular panels
        this.scrollableGroup = createSvgElement('g', {
            'data-name': 'navbar-scrollable',
        });
        this.contentGroup.appendChild(this.scrollableGroup);

        // Initialize panels
        this.essentialsPanel = new EssentialsPanel();
        this.pinnedPanel = new PinnedPanel();
        this.regularPanel = new RegularPanel();
        this.bottomPanel = new BottomPanel();

        // Add panels to scrollable group
        this.scrollableGroup.appendChild(this.essentialsPanel.getGroup());
        this.scrollableGroup.appendChild(this.pinnedPanel.getGroup());
        this.scrollableGroup.appendChild(this.regularPanel.getGroup());

        // Bottom panel is outside scrollable area (sticky)
        this.contentGroup.appendChild(this.bottomPanel.getGroup());

        // Create fade gradients (added to group, not content group, so they're not clipped)
        this.fadeGradientTop = createFadeGradient(
            { position: 'top', width: config.width, parentHeight: config.height },
            this.fadeTopGradientId,
        );
        this.fadeGradientBottom = createFadeGradient(
            { position: 'bottom', width: config.width, parentHeight: config.height },
            this.fadeBottomGradientId,
        );
        this.group.appendChild(this.fadeGradientTop);
        this.group.appendChild(this.fadeGradientBottom);

        // Create scrollbar
        this.scrollbarGroup = createScrollbar({
            x: config.width - NAVBAR.scrollbar.width - 2,
            y: 0,
            height: config.height,
            contentHeight: config.height,
            scrollTop: 0,
        });
        this.group.appendChild(this.scrollbarGroup);

        // Setup scrollbar drag handlers
        this.cleanupScrollbarHandlers = setupScrollbarDragHandlers(this.scrollbarGroup, {
            getConfig: () => ({
                x: this.config.width - NAVBAR.scrollbar.width - 2,
                y: 0,
                height: this.viewportHeight,
                contentHeight: this.scrollableHeight,
                scrollTop: this.scrollTop,
            }),
            onScroll: (newScrollTop) => {
                this.setScrollTop(newScrollTop);
            },
            onDragStart: () => {
                if (this.scrollbarHideTimeout) {
                    this.scrollbarHideTimeout();
                    this.scrollbarHideTimeout = null;
                }
            },
            onDragEnd: () => {
                if (this.scrollbarGroup) {
                    this.scrollbarHideTimeout = showScrollbar(this.scrollbarGroup, true);
                }
            },
        });

        // Setup wheel event handling
        this.setupWheelHandler();

        // Create overlay group for tooltips and menus
        this.overlayGroup = createSvgElement('g', {
            'data-name': 'navbar-overlays',
        });
        this.group.appendChild(this.overlayGroup);

        // Create tooltip manager
        this.tooltipManager = new TooltipManager(this.overlayGroup);

        // Setup mouse event handlers for tooltips
        this.setupMouseHandlers();
    }

    /**
     * Sets up wheel event handling for scrolling.
     */
    private setupWheelHandler(): void {
        this.group.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    }

    /**
     * Sets up mouse event handlers for tooltips.
     */
    private setupMouseHandlers(): void {
        this.group.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.group.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }

    /**
     * Handles mouse move events for tooltip display.
     */
    private handleMouseMove(e: MouseEvent): void {
        // Only show tooltips in icon-only mode
        if (this.displayMode !== 'icons-only') {
            this.tooltipManager?.cancel();
            return;
        }

        // Get mouse position relative to navbar
        const rect = (this.group as unknown as SVGGraphicsElement).getBoundingClientRect?.();
        if (!rect) return;

        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;

        // Find item at position
        const itemId = this.findItemAtPoint(x, y);

        if (itemId) {
            // Find the item data
            const item = this.findItemById(itemId);
            const bounds = this.getItemBounds(itemId);

            if (item && bounds) {
                this.tooltipManager?.scheduleShow({
                    item,
                    anchorX: bounds.x,
                    anchorY: bounds.y,
                    anchorWidth: bounds.width,
                    anchorHeight: bounds.height,
                    navbarWidth: this.config.width,
                });
            }
        } else {
            this.tooltipManager?.scheduleHide();
        }
    }

    /**
     * Handles mouse leave events.
     */
    private handleMouseLeave(): void {
        this.tooltipManager?.scheduleHide();
    }

    /**
     * Finds an item by ID across all panels.
     */
    private findItemById(itemId: string): import('../../state/navigation-items.js').NavItem | null {
        for (const panel of [this.essentialsPanel, this.pinnedPanel, this.regularPanel, this.bottomPanel]) {
            const item = panel.getItems().find((i) => i.id === itemId);
            if (item) return item;
        }
        return null;
    }

    /**
     * Handles wheel events for scrolling.
     */
    private handleWheel(e: WheelEvent): void {
        if (this.maxScrollTop <= 0) return;

        e.preventDefault();
        const newScrollTop = Math.max(0, Math.min(this.maxScrollTop, this.scrollTop + e.deltaY));

        if (newScrollTop !== this.scrollTop) {
            this.scrollTop = newScrollTop;
            this.updateScrollPosition();
            this.updateScrollVisuals();

            // Show scrollbar and fade gradients
            if (this.scrollbarGroup) {
                if (this.scrollbarHideTimeout) {
                    this.scrollbarHideTimeout();
                }
                this.scrollbarHideTimeout = showScrollbar(this.scrollbarGroup, true);
            }
        }
    }

    /**
     * Gets the main SVG group element.
     */
    getGroup(): SVGGElement {
        return this.group;
    }

    /**
     * Updates the navbar from state.
     * @param state - The current navbar state.
     */
    updateFromState(state: NavBarState): void {
        this.displayMode = state.iconMode;
        this.activeItemId = state.activeItemId;
        this.focusedItemId = state.focusedItemId;
        this.hoveredItemId = state.hoveredItemId;
        this.scrollTop = state.scrollTop;

        // Update panel items
        this.essentialsPanel.setItems(state.essentialItems);
        this.pinnedPanel.setItems(state.pinnedItems);
        this.regularPanel.setItems(state.regularItems);
        this.bottomPanel.setItems(state.bottomItems);

        // Re-render
        this.render();
    }

    /**
     * Updates the navbar dimensions.
     * @param config - New configuration.
     */
    updateDimensions(config: NavBarConfig): void {
        this.config = config;
        this.group.setAttribute('transform', `translate(${config.x}, ${config.y})`);
        this.backgroundRect.setAttribute('width', String(config.width));
        this.backgroundRect.setAttribute('height', String(config.height));
        this.clipRect.setAttribute('width', String(config.width));
        this.clipRect.setAttribute('height', String(config.height));

        // Update fade gradients
        if (this.fadeGradientTop) {
            updateFadeGradient(this.fadeGradientTop, {
                position: 'top',
                width: config.width,
                parentHeight: this.viewportHeight,
            });
        }
        if (this.fadeGradientBottom) {
            updateFadeGradient(this.fadeGradientBottom, {
                position: 'bottom',
                width: config.width,
                parentHeight: this.viewportHeight,
            });
        }

        this.render();
    }

    /**
     * Sets the display mode.
     * @param mode - The display mode.
     */
    setDisplayMode(mode: ItemDisplayMode): void {
        if (this.displayMode === mode) return;
        this.displayMode = mode;
        this.render();
    }

    /**
     * Sets the active item.
     * @param itemId - The item ID or null.
     */
    setActiveItem(itemId: string | null): void {
        this.activeItemId = itemId;
        this.updatePanelStates();
    }

    /**
     * Sets the focused item.
     * @param itemId - The item ID or null.
     */
    setFocusedItem(itemId: string | null): void {
        this.focusedItemId = itemId;
        this.updatePanelStates();
    }

    /**
     * Sets the hovered item.
     * @param itemId - The item ID or null.
     */
    setHoveredItem(itemId: string | null): void {
        this.hoveredItemId = itemId;
        this.updatePanelStates();
    }

    /**
     * Scrolls to a position.
     * @param scrollTop - The scroll position.
     */
    setScrollTop(scrollTop: number): void {
        this.scrollTop = Math.max(0, Math.min(scrollTop, this.maxScrollTop));
        this.updateScrollPosition();
    }

    /**
     * Gets the current scroll position.
     */
    getScrollTop(): number {
        return this.scrollTop;
    }

    /**
     * Gets the maximum scroll position.
     */
    getMaxScrollTop(): number {
        return this.maxScrollTop;
    }

    /**
     * Gets the scrollable height.
     */
    getScrollableHeight(): number {
        return this.scrollableHeight;
    }

    /**
     * Gets the viewport height for scrolling.
     */
    getViewportHeight(): number {
        return this.viewportHeight;
    }

    /**
     * Renders all panels and calculates layout.
     */
    private render(): void {
        const { width, height } = this.config;

        // Calculate bottom panel height (always visible at bottom)
        const bottomPanelHeight = this.bottomPanel.calculateHeight(this.displayMode);

        // Calculate viewport height for scrollable content
        this.viewportHeight = height - bottomPanelHeight;

        // Update clip rect for scrollable area
        this.clipRect.setAttribute('height', String(this.viewportHeight));

        // Calculate panel heights
        const essentialsHeight = this.essentialsPanel.calculateHeight(this.displayMode);
        const pinnedHeight = this.pinnedPanel.calculateHeight(this.displayMode);
        const regularHeight = this.regularPanel.calculateHeight(this.displayMode);

        // Calculate total scrollable content height
        let totalHeight = essentialsHeight;

        if (pinnedHeight > 0) {
            totalHeight += getDividerTotalHeight(); // Divider before pinned
            totalHeight += pinnedHeight;
        }

        if (essentialsHeight > 0 || pinnedHeight > 0) {
            totalHeight += getDividerTotalHeight(); // Divider before regular
        }

        totalHeight += regularHeight;

        this.scrollableHeight = totalHeight;
        this.maxScrollTop = Math.max(0, totalHeight - this.viewportHeight);

        // Ensure scroll position is within bounds
        this.scrollTop = Math.max(0, Math.min(this.scrollTop, this.maxScrollTop));

        // Create render context
        const context: PanelRenderContext = {
            x: 0,
            y: 0,
            width,
            displayMode: this.displayMode,
            activeItemId: this.activeItemId,
            focusedItemId: this.focusedItemId,
            hoveredItemId: this.hoveredItemId,
        };

        // Clear existing dividers
        this.dividers.forEach((div) => div.remove());
        this.dividers.clear();

        // Layout scrollable panels
        let currentY = 0;

        // Essentials panel
        context.y = currentY;
        this.essentialsPanel.render(context);
        currentY += essentialsHeight;

        // Divider after essentials (if pinned panel visible or regular panel has items)
        if (pinnedHeight > 0) {
            const divider = createNavBarDivider(0, currentY + NAVBAR.divider.marginVertical, width);
            this.scrollableGroup.appendChild(divider);
            this.dividers.set('after-essentials', divider);
            currentY += getDividerTotalHeight();
        }

        // Pinned panel
        if (pinnedHeight > 0) {
            context.y = currentY;
            this.pinnedPanel.render(context);
            currentY += pinnedHeight;
        }

        // Divider before regular
        if (essentialsHeight > 0 || pinnedHeight > 0) {
            const divider = createNavBarDivider(0, currentY + NAVBAR.divider.marginVertical, width);
            this.scrollableGroup.appendChild(divider);
            this.dividers.set('before-regular', divider);
            currentY += getDividerTotalHeight();
        }

        // Regular panel
        context.y = currentY;
        this.regularPanel.render(context);

        // Update scroll position
        this.updateScrollPosition();

        // Bottom panel (sticky at bottom)
        // Add divider above bottom panel
        const bottomDividerY = this.viewportHeight + NAVBAR.divider.marginVertical;
        const bottomDivider = createNavBarDivider(0, bottomDividerY - getDividerTotalHeight(), width);
        this.contentGroup.insertBefore(bottomDivider, this.bottomPanel.getGroup());
        this.dividers.set('before-bottom', bottomDivider);

        // Position bottom panel
        context.y = this.viewportHeight;
        this.bottomPanel.render(context);

        // Update scrollbar and fade gradient dimensions
        if (this.scrollbarGroup) {
            updateScrollbar(this.scrollbarGroup, {
                x: this.config.width - NAVBAR.scrollbar.width - 2,
                y: 0,
                height: this.viewportHeight,
                contentHeight: this.scrollableHeight,
                scrollTop: this.scrollTop,
            });

            // Hide scrollbar if not needed
            if (!needsScrollbar(this.viewportHeight, this.scrollableHeight)) {
                hideScrollbar(this.scrollbarGroup);
            }
        }

        // Update fade gradients
        if (this.fadeGradientTop) {
            updateFadeGradient(this.fadeGradientTop, {
                position: 'top',
                width: this.config.width,
                parentHeight: this.viewportHeight,
            });
        }
        if (this.fadeGradientBottom) {
            updateFadeGradient(this.fadeGradientBottom, {
                position: 'bottom',
                width: this.config.width,
                parentHeight: this.viewportHeight,
            });
        }

        // Update scroll visuals
        this.updateScrollVisuals();
    }

    /**
     * Updates the scroll position of the scrollable group.
     */
    private updateScrollPosition(): void {
        this.scrollableGroup.setAttribute('transform', `translate(0, ${-this.scrollTop})`);
    }

    /**
     * Updates scrollbar and fade gradient visuals.
     */
    private updateScrollVisuals(): void {
        // Update scrollbar position
        if (this.scrollbarGroup && needsScrollbar(this.viewportHeight, this.scrollableHeight)) {
            updateScrollbar(this.scrollbarGroup, {
                x: this.config.width - NAVBAR.scrollbar.width - 2,
                y: 0,
                height: this.viewportHeight,
                contentHeight: this.scrollableHeight,
                scrollTop: this.scrollTop,
            });
        }

        // Update fade gradient visibility
        if (this.fadeGradientTop) {
            updateFadeGradientVisibility(this.fadeGradientTop, this.scrollTop > 0);
        }
        if (this.fadeGradientBottom) {
            updateFadeGradientVisibility(this.fadeGradientBottom, this.scrollTop < this.maxScrollTop);
        }
    }

    /**
     * Updates panel visual states without full re-render.
     */
    private updatePanelStates(): void {
        const context: PanelRenderContext = {
            x: 0,
            y: 0,
            width: this.config.width,
            displayMode: this.displayMode,
            activeItemId: this.activeItemId,
            focusedItemId: this.focusedItemId,
            hoveredItemId: this.hoveredItemId,
        };

        // Update each panel
        this.essentialsPanel.update(context);
        this.pinnedPanel.update(context);
        this.regularPanel.update(context);
        this.bottomPanel.update(context);
    }

    /**
     * Gets the bounds of an item for tooltip/menu positioning.
     * @param itemId - The item ID.
     * @returns The item bounds in navbar coordinates, or null.
     */
    getItemBounds(itemId: string): { x: number; y: number; width: number; height: number } | null {
        // Check each panel
        let bounds = this.essentialsPanel.getItemBounds(itemId);
        if (bounds) {
            bounds.y -= this.scrollTop;
            return bounds;
        }

        bounds = this.pinnedPanel.getItemBounds(itemId);
        if (bounds) {
            bounds.y -= this.scrollTop;
            return bounds;
        }

        bounds = this.regularPanel.getItemBounds(itemId);
        if (bounds) {
            bounds.y -= this.scrollTop;
            return bounds;
        }

        bounds = this.bottomPanel.getItemBounds(itemId);
        if (bounds) {
            // Bottom panel is not scrolled
            return bounds;
        }

        return null;
    }

    /**
     * Finds which item is at a given point.
     * @param x - X coordinate in navbar space.
     * @param y - Y coordinate in navbar space.
     * @returns The item ID or null.
     */
    findItemAtPoint(x: number, y: number): string | null {
        // Check all panels
        const panels = [this.essentialsPanel, this.pinnedPanel, this.regularPanel, this.bottomPanel];

        for (const panel of panels) {
            for (const item of panel.getItems()) {
                const bounds = this.getItemBounds(item.id);
                if (bounds) {
                    if (
                        x >= bounds.x &&
                        x <= bounds.x + bounds.width &&
                        y >= bounds.y &&
                        y <= bounds.y + bounds.height
                    ) {
                        return item.id;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Gets all visible items in order.
     */
    getAllItems(): string[] {
        return [
            ...this.essentialsPanel.getItems().map((i) => i.id),
            ...this.pinnedPanel.getItems().map((i) => i.id),
            ...this.regularPanel.getItems().map((i) => i.id),
            ...this.bottomPanel.getItems().map((i) => i.id),
        ];
    }

    /**
     * Destroys the navbar.
     */
    destroy(): void {
        // Cleanup scrollbar handlers
        if (this.cleanupScrollbarHandlers) {
            this.cleanupScrollbarHandlers();
        }
        if (this.scrollbarHideTimeout) {
            this.scrollbarHideTimeout();
        }

        // Cleanup tooltip manager
        if (this.tooltipManager) {
            this.tooltipManager.destroy();
        }

        // Destroy panels
        this.essentialsPanel.destroy();
        this.pinnedPanel.destroy();
        this.regularPanel.destroy();
        this.bottomPanel.destroy();
        this.dividers.forEach((div) => div.remove());
        this.group.remove();
    }
}
