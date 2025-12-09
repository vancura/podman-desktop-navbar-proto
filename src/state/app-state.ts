/**
 * Application State Manager
 * Central state management for the Podman Desktop navbar prototype.
 */

import { NAVBAR } from '../utils/design-tokens.js';
import {
    DEFAULT_BOTTOM_ITEMS,
    DEFAULT_ESSENTIAL_ITEMS,
    DEFAULT_REGULAR_ITEMS,
    MAX_PINNED_ITEMS,
    type Locale,
    type NavItem,
} from './navigation-items.js';

/** Icon display mode for navbar items. */
export type IconMode = 'icons-only' | 'icons-titles';

/** Context menu type based on click target. */
export type ContextMenuType = 'item' | 'empty' | 'settings' | 'account' | null;

/** Tooltip state for displaying item information on hover. */
export interface TooltipState {
    visible: boolean;
    targetId: string | null;
    position: { x: number; y: number };
    content: string;
    shortcut: string | undefined;
}

/** Context menu state for right-click menus. */
export interface ContextMenuState {
    visible: boolean;
    type: ContextMenuType;
    targetId: string | null;
    position: { x: number; y: number };
}

/** Info banner state for displaying action feedback. */
export interface InfoBannerState {
    visible: boolean;
    titleKey: string | null;
    messageKey: string | null;
}

/** Modal dialog state for confirmation dialogs. */
export interface ModalDialogState {
    visible: boolean;
    titleKey: string | null;
    messageKey: string | null;
    checkboxKey: string | null | undefined;
    checkboxChecked: boolean | undefined;
    onConfirm: (() => void) | undefined;
}

/** Complete application state. */
export interface AppState {
    // Navigation items by category.
    essentialItems: NavItem[];
    pinnedItems: NavItem[];
    regularItems: NavItem[];
    hiddenItems: NavItem[];
    bottomItems: NavItem[];

    // Display settings.
    navbarWidth: number;
    iconMode: IconMode;
    isRtl: boolean;
    locale: Locale;
    navbarVisible: boolean;

    // UI state.
    activeItemId: string | null;
    focusedItemId: string | null;
    hoveredItemId: string | null;

    // Overlay state.
    tooltip: TooltipState;
    contextMenu: ContextMenuState;
    infoBanner: InfoBannerState;
    modalDialog: ModalDialogState;

    // Drag state.
    isDraggingResize: boolean;
    dragStartWidth: number;

    // Scroll state.
    scrollTop: number;
    maxScrollTop: number;

    // Preferences.
    hideWarningDismissed: boolean;
}

/** State change listener type. */
export type StateListener = (state: AppState, prevState: AppState) => void;

/** Creates the initial default state. */
function createInitialState(): AppState {
    return {
        essentialItems: [...DEFAULT_ESSENTIAL_ITEMS],
        pinnedItems: [],
        regularItems: [...DEFAULT_REGULAR_ITEMS],
        hiddenItems: [],
        bottomItems: [...DEFAULT_BOTTOM_ITEMS],

        navbarWidth: NAVBAR.width.default,
        iconMode: 'icons-titles',
        isRtl: false,
        locale: 'en',
        navbarVisible: true,

        activeItemId: null,
        focusedItemId: null,
        hoveredItemId: null,

        tooltip: {
            visible: false,
            targetId: null,
            position: { x: 0, y: 0 },
            content: '',
            shortcut: undefined,
        },

        contextMenu: {
            visible: false,
            type: null,
            targetId: null,
            position: { x: 0, y: 0 },
        },

        infoBanner: {
            visible: false,
            titleKey: null,
            messageKey: null,
        },

        modalDialog: {
            visible: false,
            titleKey: null,
            messageKey: null,
            checkboxKey: null,
            checkboxChecked: false,
            onConfirm: undefined,
        },

        isDraggingResize: false,
        dragStartWidth: NAVBAR.width.default,

        scrollTop: 0,
        maxScrollTop: 0,

        hideWarningDismissed: false,
    };
}

/**
 * Application State Manager
 * Manages the application state with observer pattern for reactive updates.
 */
export class AppStateManager {
    private state: AppState;
    private listeners: Set<StateListener> = new Set();

    constructor() {
        this.state = createInitialState();
    }

    /**
     * Gets the current state (readonly).
     * @returns The current application state.
     */
    getState(): Readonly<AppState> {
        return this.state;
    }

    /**
     * Subscribes to state changes.
     * @param listener - Callback function for state changes.
     * @returns Unsubscribe function.
     */
    subscribe(listener: StateListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Updates the state and notifies listeners.
     * @param updater - Function that returns the partial state update.
     */
    dispatch(updater: (state: AppState) => Partial<AppState>): void {
        const prevState = this.state;
        const updates = updater(this.state);
        this.state = { ...this.state, ...updates };

        // Notify listeners
        for (const listener of this.listeners) {
            listener(this.state, prevState);
        }
    }

    /**
     * Resets the state to defaults.
     */
    reset(): void {
        const prevState = this.state;
        this.state = createInitialState();

        for (const listener of this.listeners) {
            listener(this.state, prevState);
        }
    }

    // --- Item Operations ---

    /**
     * Pins an item to the pinned section.
     * @param itemId - The ID of the item to pin.
     * @returns true if the item was pinned, false if limit was reached or item not found.
     */
    pinItem(itemId: string): boolean {
        let success = false;
        this.dispatch((state) => {
            if (state.pinnedItems.length >= MAX_PINNED_ITEMS) {
                success = false;
                return {};
            }

            const item = state.regularItems.find((i) => i.id === itemId);
            if (!item || !item.canPin) {
                success = false;
                return {};
            }

            success = true;
            return {
                regularItems: state.regularItems.filter((i) => i.id !== itemId),
                pinnedItems: [...state.pinnedItems, { ...item, iconVariant: 'filled' }],
            };
        });
        return success;
    }

    /**
     * Checks if the pinned items limit has been reached.
     * @returns true if no more items can be pinned.
     */
    isPinnedLimitReached(): boolean {
        return this.state.pinnedItems.length >= MAX_PINNED_ITEMS;
    }

    /**
     * Unpins an item back to regular section.
     * @param itemId - The ID of the item to unpin.
     */
    unpinItem(itemId: string): void {
        this.dispatch((state) => {
            const item = state.pinnedItems.find((i) => i.id === itemId);
            if (!item) {
                return {};
            }

            return {
                pinnedItems: state.pinnedItems.filter((i) => i.id !== itemId),
                regularItems: [...state.regularItems, { ...item, iconVariant: 'outline' }],
            };
        });
    }

    /**
     * Unpins all items back to regular section.
     */
    unpinAllItems(): void {
        this.dispatch((state) => {
            const unpinnedItems = state.pinnedItems.map((item) => ({
                ...item,
                iconVariant: 'outline' as const,
            }));

            return {
                pinnedItems: [],
                regularItems: [...state.regularItems, ...unpinnedItems],
            };
        });
    }

    /**
     * Hides an item from the navbar.
     * @param itemId - The ID of the item to hide.
     */
    hideItem(itemId: string): void {
        this.dispatch((state) => {
            // Check regular items
            let item = state.regularItems.find((i) => i.id === itemId);
            if (item && item.canHide) {
                return {
                    regularItems: state.regularItems.filter((i) => i.id !== itemId),
                    hiddenItems: [...state.hiddenItems, item],
                };
            }

            // Check pinned items
            item = state.pinnedItems.find((i) => i.id === itemId);
            if (item && item.canHide) {
                return {
                    pinnedItems: state.pinnedItems.filter((i) => i.id !== itemId),
                    hiddenItems: [...state.hiddenItems, { ...item, iconVariant: 'outline' }],
                };
            }

            return {};
        });
    }

    /**
     * Unhides a specific item.
     * @param itemId - The ID of the item to unhide.
     */
    unhideItem(itemId: string): void {
        this.dispatch((state) => {
            const item = state.hiddenItems.find((i) => i.id === itemId);
            if (!item) {
                return {};
            }

            return {
                hiddenItems: state.hiddenItems.filter((i) => i.id !== itemId),
                regularItems: [...state.regularItems, item],
            };
        });
    }

    /**
     * Unhides all hidden items.
     */
    unhideAllItems(): void {
        this.dispatch((state) => ({
            hiddenItems: [],
            regularItems: [...state.regularItems, ...state.hiddenItems],
        }));
    }

    /**
     * Adds a new item to regular items.
     * @param item - The navigation item to add.
     */
    addItem(item: NavItem): void {
        this.dispatch((state) => ({
            regularItems: [...state.regularItems, item],
        }));
    }

    /**
     * Removes the last regular item.
     */
    removeLastItem(): void {
        this.dispatch((state) => {
            if (state.regularItems.length === 0) {
                return {};
            }

            return {
                regularItems: state.regularItems.slice(0, -1),
            };
        });
    }

    /**
     * Removes a random regular item.
     */
    removeRandomItem(): void {
        this.dispatch((state) => {
            if (state.regularItems.length === 0) {
                return {};
            }

            const index = Math.floor(Math.random() * state.regularItems.length);
            return {
                regularItems: state.regularItems.filter((_, i) => i !== index),
            };
        });
    }

    /**
     * Pins a random unpinned item.
     */
    pinRandomItem(): void {
        this.dispatch((state) => {
            if (state.pinnedItems.length >= MAX_PINNED_ITEMS) {
                return {};
            }

            const pinnableItems = state.regularItems.filter((i) => i.canPin);
            if (pinnableItems.length === 0) {
                return {};
            }

            const index = Math.floor(Math.random() * pinnableItems.length);
            const item = pinnableItems[index];
            if (!item) {
                return {};
            }

            const pinnedItem: NavItem = { ...item, iconVariant: 'filled' };

            return {
                regularItems: state.regularItems.filter((i) => i.id !== item.id),
                pinnedItems: [...state.pinnedItems, pinnedItem],
            };
        });
    }

    /**
     * Hides a random visible item.
     */
    hideRandomItem(): void {
        this.dispatch((state) => {
            const hidableItems = [...state.regularItems, ...state.pinnedItems].filter((i) => i.canHide);
            if (hidableItems.length === 0) {
                return {};
            }

            const index = Math.floor(Math.random() * hidableItems.length);
            const item = hidableItems[index];
            if (!item) {
                return {};
            }

            const inRegular = state.regularItems.some((i) => i.id === item.id);

            if (inRegular) {
                return {
                    regularItems: state.regularItems.filter((i) => i.id !== item.id),
                    hiddenItems: [...state.hiddenItems, item],
                };
            }

            const hiddenItem: NavItem = { ...item, iconVariant: 'outline' };

            return {
                pinnedItems: state.pinnedItems.filter((i) => i.id !== item.id),
                hiddenItems: [...state.hiddenItems, hiddenItem],
            };
        });
    }

    // --- Display Settings ---

    /**
     * Sets the navbar width with automatic icon mode switching.
     * @param width - The new navbar width in pixels.
     */
    setNavbarWidth(width: number): void {
        const clampedWidth = Math.max(NAVBAR.width.min, Math.min(NAVBAR.width.max, width));

        this.dispatch((state) => {
            // Determine icon mode based on width with hysteresis to prevent flickering
            let newIconMode = state.iconMode;
            const threshold = NAVBAR.width.iconOnlyThreshold;
            const hysteresis = NAVBAR.width.hysteresis;

            if (state.iconMode === 'icons-only' && clampedWidth > threshold + hysteresis) {
                newIconMode = 'icons-titles';
            } else if (state.iconMode === 'icons-titles' && clampedWidth < threshold - hysteresis) {
                newIconMode = 'icons-only';
            }

            return {
                navbarWidth: clampedWidth,
                iconMode: newIconMode,
            };
        });
    }

    /**
     * Sets the icon mode directly.
     * @param mode - The icon mode to set.
     */
    setIconMode(mode: IconMode): void {
        this.dispatch(() => ({ iconMode: mode }));
    }

    /**
     * Toggles between icon-only and icons-titles modes.
     */
    toggleIconMode(): void {
        this.dispatch((state) => ({
            iconMode: state.iconMode === 'icons-only' ? 'icons-titles' : 'icons-only',
        }));
    }

    /**
     * Sets the locale and updates RTL mode accordingly.
     * @param locale - The locale to set.
     */
    setLocale(locale: Locale): void {
        this.dispatch(() => ({
            locale,
            isRtl: locale === 'ar' || locale === 'he',
        }));
    }

    /**
     * Toggles navbar visibility.
     */
    toggleNavbarVisibility(): void {
        this.dispatch((state) => ({
            navbarVisible: !state.navbarVisible,
        }));
    }

    // --- UI State ---

    /**
     * Sets the active (selected) item.
     * @param itemId - The ID of the item to activate, or null to clear.
     */
    setActiveItem(itemId: string | null): void {
        this.dispatch(() => ({ activeItemId: itemId }));
    }

    /**
     * Sets the focused item for keyboard navigation.
     * @param itemId - The ID of the item to focus, or null to clear.
     */
    setFocusedItem(itemId: string | null): void {
        this.dispatch(() => ({ focusedItemId: itemId }));
    }

    /**
     * Sets the hovered item.
     * @param itemId - The ID of the item being hovered, or null to clear.
     */
    setHoveredItem(itemId: string | null): void {
        this.dispatch(() => ({ hoveredItemId: itemId }));
    }

    // --- Overlay State ---

    /**
     * Shows a tooltip for an item.
     * @param targetId - The ID of the target item.
     * @param position - The position for the tooltip.
     * @param content - The tooltip content text.
     * @param shortcut - Optional keyboard shortcut to display.
     */
    showTooltip(targetId: string, position: { x: number; y: number }, content: string, shortcut?: string): void {
        this.dispatch(() => ({
            tooltip: {
                visible: true,
                targetId,
                position,
                content,
                shortcut,
            },
        }));
    }

    /**
     * Hides the tooltip.
     */
    hideTooltip(): void {
        this.dispatch((state) => ({
            tooltip: {
                ...state.tooltip,
                visible: false,
            },
        }));
    }

    /**
     * Shows a context menu.
     * @param type - The type of context menu.
     * @param position - The position for the menu.
     * @param targetId - Optional ID of the target item.
     */
    showContextMenu(type: ContextMenuType, position: { x: number; y: number }, targetId?: string): void {
        this.dispatch(() => ({
            contextMenu: {
                visible: true,
                type,
                targetId: targetId ?? null,
                position,
            },
            tooltip: {
                visible: false,
                targetId: null,
                position: { x: 0, y: 0 },
                content: '',
                shortcut: undefined,
            },
        }));
    }

    /**
     * Hides the context menu.
     */
    hideContextMenu(): void {
        this.dispatch((state) => ({
            contextMenu: {
                ...state.contextMenu,
                visible: false,
            },
        }));
    }

    /**
     * Shows an info banner.
     * @param titleKey - The translation key for the title.
     * @param messageKey - The translation key for the message.
     */
    showInfoBanner(titleKey: string, messageKey: string): void {
        this.dispatch(() => ({
            infoBanner: {
                visible: true,
                titleKey,
                messageKey,
            },
            contextMenu: {
                visible: false,
                type: null,
                targetId: null,
                position: { x: 0, y: 0 },
            },
        }));
    }

    /**
     * Hides the info banner.
     */
    hideInfoBanner(): void {
        this.dispatch((state) => ({
            infoBanner: {
                ...state.infoBanner,
                visible: false,
            },
        }));
    }

    /**
     * Shows a modal dialog.
     * @param titleKey - The translation key for the title.
     * @param messageKey - The translation key for the message.
     * @param checkboxKey - Optional translation key for checkbox label.
     * @param onConfirm - Optional callback when confirmed.
     */
    showModalDialog(titleKey: string, messageKey: string, checkboxKey?: string, onConfirm?: () => void): void {
        this.dispatch(() => ({
            modalDialog: {
                visible: true,
                titleKey,
                messageKey,
                checkboxKey: checkboxKey ?? null,
                checkboxChecked: false,
                onConfirm,
            },
            contextMenu: {
                visible: false,
                type: null,
                targetId: null,
                position: { x: 0, y: 0 },
            },
        }));
    }

    /**
     * Hides the modal dialog.
     */
    hideModalDialog(): void {
        this.dispatch((state) => ({
            modalDialog: {
                ...state.modalDialog,
                visible: false,
            },
        }));
    }

    /**
     * Toggles the modal checkbox state.
     */
    toggleModalCheckbox(): void {
        this.dispatch((state) => ({
            modalDialog: {
                ...state.modalDialog,
                checkboxChecked: !state.modalDialog.checkboxChecked,
            },
        }));
    }

    // --- Drag State ---

    /**
     * Starts a resize drag operation.
     */
    startResizeDrag(): void {
        this.dispatch((state) => ({
            isDraggingResize: true,
            dragStartWidth: state.navbarWidth,
        }));
    }

    /**
     * Ends a resize drag operation.
     */
    endResizeDrag(): void {
        this.dispatch(() => ({
            isDraggingResize: false,
        }));
    }

    /**
     * Cancels a resize drag operation and restores original width.
     */
    cancelResizeDrag(): void {
        this.dispatch((state) => ({
            isDraggingResize: false,
            navbarWidth: state.dragStartWidth,
        }));
    }

    // --- Scroll State ---

    /**
     * Sets the scroll position.
     * @param scrollTop - The scroll position in pixels.
     */
    setScrollTop(scrollTop: number): void {
        this.dispatch((state) => ({
            scrollTop: Math.max(0, Math.min(scrollTop, state.maxScrollTop)),
        }));
    }

    /**
     * Sets the maximum scroll position.
     * @param maxScrollTop - The maximum scroll position in pixels.
     */
    setMaxScrollTop(maxScrollTop: number): void {
        this.dispatch(() => ({ maxScrollTop }));
    }

    // --- Preferences ---

    /**
     * Dismisses the hide warning permanently.
     */
    dismissHideWarning(): void {
        this.dispatch(() => ({ hideWarningDismissed: true }));
    }

    // --- Helpers ---

    /**
     * Gets all visible items in display order.
     * @returns Array of all visible navigation items.
     */
    getAllVisibleItems(): NavItem[] {
        const state = this.state;
        return [...state.essentialItems, ...state.pinnedItems, ...state.regularItems, ...state.bottomItems];
    }

    /**
     * Finds an item by ID across all categories.
     * @param itemId - The ID of the item to find.
     * @returns The navigation item, or undefined if not found.
     */
    findItem(itemId: string): NavItem | undefined {
        const state = this.state;
        return (
            state.essentialItems.find((i) => i.id === itemId) ??
            state.pinnedItems.find((i) => i.id === itemId) ??
            state.regularItems.find((i) => i.id === itemId) ??
            state.hiddenItems.find((i) => i.id === itemId) ??
            state.bottomItems.find((i) => i.id === itemId)
        );
    }

    /**
     * Gets the category of an item.
     * @param itemId - The ID of the item.
     * @returns The category name, or null if item not found.
     */
    getItemCategory(itemId: string): string | null {
        const state = this.state;
        if (state.essentialItems.some((i) => i.id === itemId)) return 'essential';
        if (state.pinnedItems.some((i) => i.id === itemId)) return 'pinned';
        if (state.regularItems.some((i) => i.id === itemId)) return 'regular';
        if (state.hiddenItems.some((i) => i.id === itemId)) return 'hidden';
        if (state.bottomItems.some((i) => i.id === itemId)) return 'bottom';
        return null;
    }
}

/** Global application state manager instance. */
export const appState = new AppStateManager();
