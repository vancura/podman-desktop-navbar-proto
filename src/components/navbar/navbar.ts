/**
 * NavBar Component
 * Main navigation bar container that composes all panels.
 */

import type { AppState, IconMode } from '../../state/app-state.js';
import { appState } from '../../state/app-state.js';
import type { NavItem } from '../../state/navigation-items.js';
import { COLORS, NAVBAR } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';
import { ContextMenuManager, type MenuItemDef } from '../overlays/context-menu.js';
import type { InfoBannerConfig } from '../overlays/info-banner.js';
import type { ModalDialogConfig, ModalDialogResult } from '../overlays/modal-dialog.js';
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
import {
    createAccountContextMenuItems,
    createEmptySpaceContextMenuItems,
    createItemContextMenuItems,
    createSettingsContextMenuItems,
} from './context-menu-builders.js';
import { EssentialsPanel } from './essentials-panel.js';
import { createMoreButton, getMoreButtonHeight } from './more-button.js';
import { createNavBarDivider, getDividerTotalHeight } from './navbar-divider.js';
import type { RenderContext } from './navbar-panel.js';
import { PinnedPanel } from './pinned-panel.js';
import { RegularPanel } from './regular-panel.js';

/** NavBar configuration. */
export interface NavBarConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    onShowInfoBanner?: (config: InfoBannerConfig) => void;
    onShowModal?: (config: ModalDialogConfig) => Promise<ModalDialogResult>;
    /** External overlay group for tooltips (rendered above other content). */
    tooltipOverlayGroup?: SVGGElement | undefined;
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

    // More button
    private moreButtonGroup: SVGGElement | null = null;
    private hiddenItemCount = 0;

    // Scrollbar and fade gradients
    private scrollbarGroup: SVGGElement | null = null;
    private fadeGradientTop: SVGGElement | null = null;
    private fadeGradientBottom: SVGGElement | null = null;
    private cleanupScrollbarHandlers: (() => void) | null = null;
    private scrollbarHideTimeout: (() => void) | null = null;
    private fadeTopGradientId = '';
    private fadeBottomGradientId = '';

    // Tooltip, context menu, info banner, and modal
    private tooltipManager: TooltipManager | null = null;
    private contextMenuManager: ContextMenuManager | null = null;
    private onShowInfoBanner: ((config: InfoBannerConfig) => void) | null = null;
    private onShowModal: ((config: ModalDialogConfig) => Promise<ModalDialogResult>) | null = null;
    private overlayGroup: SVGGElement | null = null;

    // Configuration
    private config: NavBarConfig;
    private displayMode: IconMode = 'icons-titles';
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
        this.onShowInfoBanner = config.onShowInfoBanner ?? null;
        this.onShowModal = config.onShowModal ?? null;

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

        // Create content group (no clip path - bottom panel needs to be visible)
        this.contentGroup = createSvgElement('g', {
            'data-name': 'navbar-content',
        });
        this.group.appendChild(this.contentGroup);

        // Create scrollable group for Essentials, Pinned, and Regular panels (with clip path)
        this.scrollableGroup = createSvgElement('g', {
            'data-name': 'navbar-scrollable',
            'clip-path': `url(#${clipId})`,
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

        // Create overlay group for context menus (inside navbar group)
        this.overlayGroup = createSvgElement('g', {
            'data-name': 'navbar-overlays',
        });
        this.group.appendChild(this.overlayGroup);

        // Create tooltip manager (use external overlay if provided for proper z-ordering)
        const tooltipContainer = config.tooltipOverlayGroup ?? this.overlayGroup;
        const tooltipOffset = config.tooltipOverlayGroup ? { x: config.x, y: config.y } : undefined;
        this.tooltipManager = new TooltipManager(tooltipContainer, tooltipOffset);

        // Create context menu manager
        this.contextMenuManager = new ContextMenuManager(this.overlayGroup);

        // Setup mouse event handlers for tooltips and context menus
        this.setupMouseHandlers();
    }

    /**
     * Sets up wheel event handling for scrolling.
     */
    private setupWheelHandler(): void {
        this.group.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    }

    /**
     * Sets up mouse event handlers for tooltips and context menus.
     */
    private setupMouseHandlers(): void {
        this.group.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.group.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.group.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        this.group.addEventListener('click', this.handleItemClick.bind(this));
    }

    /**
     * Handles mouse move events for tooltip display.
     */
    private handleMouseMove(e: MouseEvent): void {
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
                // Determine if we should show tooltip
                let shouldShowTooltip = false;

                if (this.displayMode === 'icons-only') {
                    // Always show tooltip in icon-only mode
                    shouldShowTooltip = true;
                } else {
                    // In icons-titles mode, only show tooltip if text is truncated
                    const isTruncated = this.isItemTextTruncated(itemId);
                    shouldShowTooltip = isTruncated;
                }

                if (shouldShowTooltip) {
                    this.tooltipManager?.scheduleShow({
                        item,
                        anchorX: bounds.x,
                        anchorY: bounds.y,
                        anchorWidth: bounds.width,
                        anchorHeight: bounds.height,
                        navbarWidth: this.config.width,
                    });
                } else {
                    this.tooltipManager?.scheduleHide();
                }
            }
        } else {
            this.tooltipManager?.scheduleHide();
        }
    }

    /**
     * Checks if an item's text is truncated.
     * @param itemId - The item ID.
     * @returns True if the text is truncated.
     */
    private isItemTextTruncated(itemId: string): boolean {
        // Check each panel for the item
        for (const panel of [this.essentialsPanel, this.pinnedPanel, this.regularPanel, this.bottomPanel]) {
            const itemGroup = panel.getGroup().querySelector(`[data-item-id="${itemId}"]`);
            if (itemGroup) {
                const titleElement = itemGroup.querySelector('[data-name="item-title"]');
                if (titleElement) {
                    return titleElement.getAttribute('data-truncated') === 'true';
                }
            }
        }
        return false;
    }

    /**
     * Handles mouse leave events.
     */
    private handleMouseLeave(): void {
        this.tooltipManager?.scheduleHide();
    }

    /**
     * Handles item click events.
     */
    private handleItemClick(e: MouseEvent): void {
        // Don't handle clicks on the More button (it has its own handler)
        const target = e.target as Element;
        if (target.closest('[data-name="more-button"]')) {
            return;
        }

        // Don't handle clicks on context menus
        if (target.closest('[data-name="context-menu"]')) {
            return;
        }

        // Get mouse position relative to navbar
        const rect = (this.group as unknown as SVGGraphicsElement).getBoundingClientRect?.();
        if (!rect) return;

        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;

        // Find item at position
        const itemId = this.findItemAtPoint(x, y);
        if (!itemId) return;

        // Show info banner indicating feature is out of scope
        this.showInfoBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
    }

    /**
     * Handles context menu (right-click) events.
     */
    private handleContextMenu(e: MouseEvent): void {
        e.preventDefault();

        // Hide tooltip when showing context menu
        this.tooltipManager?.cancel();

        // Get mouse position relative to navbar
        const rect = (this.group as unknown as SVGGraphicsElement).getBoundingClientRect?.();
        if (!rect) return;

        const x = e.clientX - rect.x;
        const y = e.clientY - rect.y;

        // Find item at position
        const itemId = this.findItemAtPoint(x, y);
        const item = itemId ? this.findItemById(itemId) : null;

        // Build menu items based on context
        let menuItems: MenuItemDef[];
        if (item) {
            // Check for special items (Settings, Account)
            if (item.id === 'settings') {
                menuItems = createSettingsContextMenuItems();
            } else if (item.id === 'account') {
                menuItems = createAccountContextMenuItems();
            } else {
                menuItems = createItemContextMenuItems(item);
            }
        } else {
            const state = appState.getState();
            menuItems = createEmptySpaceContextMenuItems(state.hiddenItems, this.displayMode);
        }

        // Get viewport dimensions
        const viewportWidth = this.config.width;
        const viewportHeight = this.config.height;

        // Show context menu
        this.contextMenuManager?.show(
            { items: menuItems, x, y },
            viewportWidth,
            viewportHeight,
            (selectedItemId) => this.handleContextMenuSelect(selectedItemId, item),
            () => {
                // Menu closed
            },
        );
    }

    /**
     * Handles context menu item selection.
     */
    private handleContextMenuSelect(menuItemId: string, item: NavItem | null): void {
        console.log('Context menu selected:', menuItemId, item?.id);

        switch (menuItemId) {
            case 'toggleIconMode': {
                const newMode = this.displayMode === 'icons-only' ? 'icons-titles' : 'icons-only';
                this.setDisplayMode(newMode);
                appState.setIconMode(newMode);
                break;
            }

            case 'pin':
                if (item) {
                    const success = appState.pinItem(item.id);
                    if (!success && appState.isPinnedLimitReached()) {
                        this.showInfoBanner('banner.pinLimitReached', 'banner.pinLimitReachedDesc');
                    }
                }
                break;

            case 'unpin':
                if (item) {
                    appState.unpinItem(item.id);
                }
                break;

            case 'hide':
                if (item) {
                    this.handleHideItem(item.id);
                }
                break;

            case 'resetNavbar':
                appState.reset();
                break;

            case 'shortcut':
                this.showInfoBanner('banner.keyboardShortcut', 'banner.keyboardShortcutDesc');
                break;

            case 'extensionSettings':
                this.showInfoBanner('banner.extensionSettings', 'banner.extensionSettingsDesc');
                break;

            case 'removeExtension':
                this.showInfoBanner('banner.removeExtension', 'banner.removeExtensionDesc');
                break;

            case 'configureNavbar':
                this.showInfoBanner('banner.configureNavbar', 'banner.configureNavbarDesc');
                break;

            case 'settings':
                this.showInfoBanner('banner.settings', 'banner.settingsDesc');
                break;

            case 'extensions':
                this.showInfoBanner('banner.extensions', 'banner.extensionsDesc');
                break;

            case 'keyboardShortcuts':
                this.showInfoBanner('banner.keyboardShortcuts', 'banner.keyboardShortcutsDesc');
                break;

            case 'aboutPodman':
                this.showInfoBanner('banner.about', 'banner.aboutDesc');
                break;

            case 'signOut':
                this.showInfoBanner('banner.signOut', 'banner.signOutDesc');
                break;

            default:
                // Check if it's a hidden item being restored
                if (menuItemId.startsWith('unhide-')) {
                    const itemId = menuItemId.replace('unhide-', '');
                    appState.unhideItem(itemId);
                }
                break;
        }
    }

    /**
     * Shows the hidden items menu from the More button.
     */
    private showHiddenItemsMenu(): void {
        const state = appState.getState();
        const hiddenItems = state.hiddenItems;

        if (hiddenItems.length === 0) return;

        // Build menu items for hidden items
        const menuItems: MenuItemDef[] = hiddenItems.map((item) => ({
            id: `unhide-${item.id}`,
            labelKey: item.labelKey,
            icon: item.icon,
        }));

        // Get More button position for menu placement
        if (this.moreButtonGroup) {
            const transform = this.moreButtonGroup.getAttribute('transform');
            const match = transform?.match(/translate\(([^,]+),\s*([^)]+)\)/);
            const moreButtonY = match?.[2] !== undefined ? parseFloat(match[2]) : this.viewportHeight;

            // Position menu above the More button, centered horizontally
            const menuY = moreButtonY - 4; // Small offset above the button

            // Show context menu at More button position
            this.contextMenuManager?.show(
                { items: menuItems, x: this.config.width / 2, y: menuY },
                this.config.width,
                this.config.height,
                (selectedItemId) => this.handleContextMenuSelect(selectedItemId, null),
                () => {
                    // Menu closed
                },
            );
        }
    }

    /**
     * Shows an info banner.
     */
    private showInfoBanner(titleKey: string, descriptionKey: string): void {
        if (!this.onShowInfoBanner) return;

        // Get viewport dimensions from the SVG
        const svgElement = this.group.ownerSVGElement;
        const width = svgElement ? parseFloat(svgElement.getAttribute('width') ?? '800') : 800;
        const height = svgElement ? parseFloat(svgElement.getAttribute('height') ?? '600') : 600;

        this.onShowInfoBanner({
            titleKey,
            descriptionKey,
            width,
            height,
        });
    }

    /**
     * Handles hiding an item with optional confirmation modal.
     */
    private handleHideItem(itemId: string): void {
        const state = appState.getState();

        // If warning was already dismissed, hide immediately
        if (state.hideWarningDismissed) {
            appState.hideItem(itemId);
            return;
        }

        // If no modal handler, hide immediately
        if (!this.onShowModal) {
            appState.hideItem(itemId);
            return;
        }

        // Get viewport dimensions from the SVG
        const svgElement = this.group.ownerSVGElement;
        const width = svgElement ? parseFloat(svgElement.getAttribute('width') ?? '800') : 800;
        const height = svgElement ? parseFloat(svgElement.getAttribute('height') ?? '600') : 600;

        // Show confirmation modal
        this.onShowModal({
            titleKey: 'modal.hideItem',
            descriptionKey: 'modal.hideItemDescription',
            showCheckbox: true,
            checkboxLabelKey: 'modal.dontShowAgain',
            confirmButtonKey: 'modal.ok',
            cancelButtonKey: 'modal.cancel',
            width,
            height,
        }).then((result) => {
            if (result.confirmed) {
                // Hide the item
                appState.hideItem(itemId);

                // Remember if user chose "don't show again"
                if (result.checkboxChecked) {
                    appState.dismissHideWarning();
                }
            }
        });
    }

    /**
     * Finds an item by ID across all panels.
     */
    private findItemById(itemId: string): NavItem | null {
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
    updateFromState(state: AppState): void {
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
    setDisplayMode(mode: IconMode): void {
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

        // Get hidden items count from state for More button
        const state = appState.getState();
        this.hiddenItemCount = state.hiddenItems.length;
        const moreButtonHeight = this.hiddenItemCount > 0 ? getMoreButtonHeight() : 0;

        // Calculate bottom panel height (always visible at bottom)
        const bottomPanelHeight = this.bottomPanel.calculateHeight(this.displayMode);

        // Calculate viewport height for scrollable content (minus More button if visible)
        this.viewportHeight = height - bottomPanelHeight - moreButtonHeight;

        // Update clip rect for scrollable area
        this.clipRect.setAttribute('height', String(this.viewportHeight));

        // Calculate panel heights based on current display mode
        const essentialsHeight = this.essentialsPanel.calculateHeight(this.displayMode);
        const pinnedHeight = this.pinnedPanel.calculateHeight(this.displayMode);
        const regularHeight = this.regularPanel.calculateHeight(this.displayMode);

        // Calculate total scrollable content height by summing panels and dividers.
        // The scrollable area contains: Essentials -> Divider -> Pinned -> Divider -> Regular
        // Dividers are only added when their adjacent panels have content.
        let totalHeight = essentialsHeight;

        if (pinnedHeight > 0) {
            totalHeight += getDividerTotalHeight(); // Divider before pinned
            totalHeight += pinnedHeight;
        }

        if (essentialsHeight > 0 || pinnedHeight > 0) {
            totalHeight += getDividerTotalHeight(); // Divider before regular
        }

        totalHeight += regularHeight;

        // Store scrollable dimensions for scroll calculations:
        // - scrollableHeight: Total height of all content
        // - viewportHeight: Visible area height (set during layout)
        // - maxScrollTop: Maximum scroll offset (content height - viewport height)
        this.scrollableHeight = totalHeight;
        this.maxScrollTop = Math.max(0, totalHeight - this.viewportHeight);

        // Clamp scroll position to valid range after content changes
        this.scrollTop = Math.max(0, Math.min(this.scrollTop, this.maxScrollTop));

        // Create render context
        const context: RenderContext = {
            x: 0,
            y: 0,
            width,
            displayMode: this.displayMode,
            activeItemId: this.activeItemId,
            focusedItemId: this.focusedItemId,
            hoveredItemId: this.hoveredItemId,
        };

        // Clear existing dividers
        this.dividers.forEach((div) => {
            div.remove();
        });
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

        // Remove old More button if exists
        if (this.moreButtonGroup) {
            this.moreButtonGroup.remove();
            this.moreButtonGroup = null;
        }

        // Create or update More button (positioned right at the end of viewport)
        if (this.hiddenItemCount > 0) {
            // Position More button right after the viewport (before divider and bottom panel)
            const moreButtonY = this.viewportHeight;
            this.moreButtonGroup = createMoreButton({
                x: 0,
                y: moreButtonY,
                width,
                hiddenCount: this.hiddenItemCount,
            });

            if (this.moreButtonGroup) {
                // Add click handler to show hidden items dropdown
                this.moreButtonGroup.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Use requestAnimationFrame to ensure menu is created after click event processing
                    requestAnimationFrame(() => {
                        this.showHiddenItemsMenu();
                    });
                });

                this.contentGroup.insertBefore(this.moreButtonGroup, this.bottomPanel.getGroup());
            }
        }

        // Bottom panel (sticky at bottom)
        // Add divider above bottom panel (accounting for More button)
        const moreButtonSpace = this.hiddenItemCount > 0 ? moreButtonHeight : 0;
        const bottomDividerY = this.viewportHeight + moreButtonSpace + NAVBAR.divider.marginVertical;
        const bottomDivider = createNavBarDivider(0, bottomDividerY - getDividerTotalHeight(), width);
        this.contentGroup.insertBefore(bottomDivider, this.bottomPanel.getGroup());
        this.dividers.set('before-bottom', bottomDivider);

        // Position bottom panel (after More button if present)
        context.y = this.viewportHeight + moreButtonSpace;
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
        const context: RenderContext = {
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
     * Handles keyboard navigation actions.
     * @param action - The action identifier from keyboard shortcuts.
     */
    handleKeyboardAction(action: string): void {
        const allItems = this.getAllItems();
        if (allItems.length === 0) return;

        const currentIndex = this.focusedItemId ? allItems.indexOf(this.focusedItemId) : -1;

        switch (action) {
            case 'navigate-up': {
                // Move focus up
                const newIndex = currentIndex <= 0 ? allItems.length - 1 : currentIndex - 1;
                const newItemId = allItems[newIndex];
                if (newItemId) {
                    this.focusedItemId = newItemId;
                    appState.setFocusedItem(newItemId);
                    this.scrollToItem(newItemId);
                }
                break;
            }

            case 'navigate-down': {
                // Move focus down
                const newIndex = currentIndex < 0 || currentIndex >= allItems.length - 1 ? 0 : currentIndex + 1;
                const newItemId = allItems[newIndex];
                if (newItemId) {
                    this.focusedItemId = newItemId;
                    appState.setFocusedItem(newItemId);
                    this.scrollToItem(newItemId);
                }
                break;
            }

            case 'navigate-first': {
                // Go to first item
                const firstItemId = allItems[0];
                if (firstItemId) {
                    this.focusedItemId = firstItemId;
                    appState.setFocusedItem(firstItemId);
                    this.setScrollTop(0);
                }
                break;
            }

            case 'navigate-last': {
                // Go to last item
                const lastItemId = allItems[allItems.length - 1];
                if (lastItemId) {
                    this.focusedItemId = lastItemId;
                    appState.setFocusedItem(lastItemId);
                    this.setScrollTop(this.maxScrollTop);
                }
                break;
            }

            case 'activate': {
                // Activate the focused item
                if (this.focusedItemId) {
                    this.showInfoBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
                }
                break;
            }

            case 'focus-next': {
                // Tab to next item
                const newIndex = currentIndex < 0 || currentIndex >= allItems.length - 1 ? 0 : currentIndex + 1;
                const newItemId = allItems[newIndex];
                if (newItemId) {
                    this.focusedItemId = newItemId;
                    appState.setFocusedItem(newItemId);
                    this.scrollToItem(newItemId);
                }
                break;
            }

            case 'focus-prev': {
                // Shift+Tab to previous item
                const newIndex = currentIndex <= 0 ? allItems.length - 1 : currentIndex - 1;
                const newItemId = allItems[newIndex];
                if (newItemId) {
                    this.focusedItemId = newItemId;
                    appState.setFocusedItem(newItemId);
                    this.scrollToItem(newItemId);
                }
                break;
            }

            case 'close-overlay': {
                // Close any open menu/tooltip
                this.contextMenuManager?.close();
                this.tooltipManager?.cancel();
                // Clear focus
                this.focusedItemId = null;
                appState.setFocusedItem(null);
                break;
            }

            case 'navigate-containers': {
                this.focusAndActivateItem('containers');
                break;
            }

            case 'navigate-images': {
                this.focusAndActivateItem('images');
                break;
            }

            case 'navigate-volumes': {
                this.focusAndActivateItem('volumes');
                break;
            }

            case 'navigate-extensions': {
                this.focusAndActivateItem('extensions');
                break;
            }

            case 'navigate-terminal': {
                this.focusAndActivateItem('terminal');
                break;
            }

            case 'navigate-settings': {
                this.focusAndActivateItem('settings');
                break;
            }

            case 'toggle-navbar': {
                appState.toggleNavbarVisibility();
                break;
            }

            default:
                // Handle pinned item shortcuts (navigate-pinned-1 through navigate-pinned-5)
                if (action.startsWith('navigate-pinned-')) {
                    const pinnedIndex = parseInt(action.replace('navigate-pinned-', ''), 10) - 1;
                    const pinnedItems = this.pinnedPanel.getItems();
                    if (pinnedIndex >= 0 && pinnedIndex < pinnedItems.length) {
                        const pinnedItem = pinnedItems[pinnedIndex];
                        if (pinnedItem) {
                            this.focusAndActivateItem(pinnedItem.id);
                        }
                    }
                }
                break;
        }
    }

    /**
     * Focuses and activates an item by ID.
     * @param itemId - The item ID.
     */
    private focusAndActivateItem(itemId: string): void {
        const allItems = this.getAllItems();
        if (allItems.includes(itemId)) {
            this.focusedItemId = itemId;
            appState.setFocusedItem(itemId);
            this.scrollToItem(itemId);
            this.showInfoBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
        }
    }

    /**
     * Scrolls to ensure an item is visible.
     * @param itemId - The item ID.
     */
    private scrollToItem(itemId: string): void {
        const bounds = this.getItemBounds(itemId);
        if (!bounds) return;

        // Check if item is in scrollable area (not bottom panel)
        const bottomItems = this.bottomPanel.getItems().map((i) => i.id);
        if (bottomItems.includes(itemId)) {
            return; // Bottom panel items don't need scrolling
        }

        // Adjust for current scroll
        const actualY = bounds.y + this.scrollTop;

        // Check if item is above viewport
        if (actualY < this.scrollTop) {
            this.setScrollTop(actualY);
            this.updateScrollVisuals();
        }
        // Check if item is below viewport
        else if (actualY + bounds.height > this.scrollTop + this.viewportHeight) {
            this.setScrollTop(actualY + bounds.height - this.viewportHeight);
            this.updateScrollVisuals();
        }
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

        // Cleanup tooltip and context menu managers
        if (this.tooltipManager) {
            this.tooltipManager.destroy();
        }
        if (this.contextMenuManager) {
            this.contextMenuManager.destroy();
        }

        // Destroy panels
        this.essentialsPanel.destroy();
        this.pinnedPanel.destroy();
        this.regularPanel.destroy();
        this.bottomPanel.destroy();
        this.dividers.forEach((div) => {
            div.remove();
        });
        this.group.remove();
    }
}
