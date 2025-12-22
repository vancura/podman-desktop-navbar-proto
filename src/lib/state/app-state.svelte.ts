/**
 * Application State
 * Reactive state management using Svelte 5 runes.
 */

import { setLocale as setI18nLocale } from '../i18n/index.js';
import { NAVBAR } from '../utils/constants.js';
import { DEFAULT_BOTTOM_ITEMS, DEFAULT_ESSENTIAL_ITEMS, DEFAULT_REGULAR_ITEMS } from './nav-items.js';
import type { Locale, NavItem } from './types.js';

/** Navigation items organized by panel. */
interface NavItems {
    essential: NavItem[];
    pinned: NavItem[];
    regular: NavItem[];
    hidden: NavItem[];
    bottom: NavItem[];
}

/** Banner configuration. */
interface BannerConfig {
    titleKey: string;
    descriptionKey: string;
}

/** Context menu configuration. */
interface ContextMenuConfig {
    x: number;
    y: number;
    itemId: string | null; // null = empty space click
}

/** More menu (hidden items) configuration. */
interface MoreMenuConfig {
    x: number;
    y: number;
}

/** Tooltip configuration. */
interface TooltipConfig {
    x: number;
    y: number;
    itemId: string;
}

/** UI state for overlays and interactions. */
interface UIState {
    activeItemId: string | null;
    focusedItemId: string | null;
    hoveredItemId: string | null;
    isDraggingResize: boolean;
    hideWarningDismissed: boolean;
    // Overlay states
    banner: BannerConfig | null;
    contextMenu: ContextMenuConfig | null;
    moreMenu: MoreMenuConfig | null;
    tooltip: TooltipConfig | null;
    modalConfig: {
        titleKey: string;
        descriptionKey: string;
        checkboxKey?: string;
        onConfirm: (checked: boolean) => void;
    } | null;
    modalCheckboxChecked: boolean;
}

/**
 * Create deep clone of items array.
 * @param items
 */
function cloneItems(items: NavItem[]): NavItem[] {
    return items.map((item) => ({ ...item }));
}

/** Create initial items state. */
function createInitialItems(): NavItems {
    return {
        essential: cloneItems(DEFAULT_ESSENTIAL_ITEMS),
        pinned: [],
        regular: cloneItems(DEFAULT_REGULAR_ITEMS),
        hidden: [],
        bottom: cloneItems(DEFAULT_BOTTOM_ITEMS),
    };
}

// Reactive state using Svelte 5 runes
let items = $state<NavItems>(createInitialItems());
let navbarWidth = $state<number>(NAVBAR.defaultWidth);
let isExpanded = $state<boolean>(true);
let locale = $state<Locale>('en');
let ui = $state<UIState>({
    activeItemId: null,
    focusedItemId: null,
    hoveredItemId: null,
    isDraggingResize: false,
    hideWarningDismissed: false,
    banner: null,
    contextMenu: null,
    moreMenu: null,
    tooltip: null,
    modalConfig: null,
    modalCheckboxChecked: false,
});

// Derived values
const isRtl = $derived(locale === 'ar' || locale === 'he');
const hasHiddenItems = $derived(items.hidden.length > 0);
const hasPinnedItems = $derived(items.pinned.length > 0);
const canPinMore = $derived(items.pinned.length < NAVBAR.maxPinnedItems);

/** All visible items in display order. */
const allVisibleItems = $derived([...items.essential, ...items.pinned, ...items.regular, ...items.bottom]);

// State accessors (exported as functions for reactivity)
export const appState = {
    /** Get navigation items by panel. */
    get items() {
        return items;
    },

    /** Get navbar width in pixels. */
    get navbarWidth() {
        return navbarWidth;
    },

    /** Whether navbar shows titles (expanded) or icons only. */
    get isExpanded() {
        return isExpanded;
    },

    /** Current locale. */
    get locale() {
        return locale;
    },

    /** Whether current locale is RTL. */
    get isRtl() {
        return isRtl;
    },

    /** UI interaction state. */
    get ui() {
        return ui;
    },

    /** Whether there are hidden items (shows More button). */
    get hasHiddenItems() {
        return hasHiddenItems;
    },

    /** Whether there are pinned items. */
    get hasPinnedItems() {
        return hasPinnedItems;
    },

    /** Whether more items can be pinned. */
    get canPinMore() {
        return canPinMore;
    },

    /** All visible items in order. */
    get allVisibleItems() {
        return allVisibleItems;
    },
};

// State mutations
export const actions = {
    /**
     * Set navbar width with automatic mode switching.
     * @param width
     */
    setNavbarWidth(width: number): void {
        const clamped = Math.max(NAVBAR.minWidth, Math.min(NAVBAR.maxWidth, width));
        navbarWidth = clamped;

        // Update expanded state based on threshold with hysteresis
        const threshold = NAVBAR.collapseThreshold;
        const hysteresis = NAVBAR.hysteresis;

        if (isExpanded && clamped < threshold - hysteresis) {
            isExpanded = false;
        } else if (!isExpanded && clamped > threshold + hysteresis) {
            isExpanded = true;
        }
    },

    /** Toggle between expanded and collapsed modes. */
    toggleExpanded(): void {
        isExpanded = !isExpanded;
    },

    /**
     * Set the current locale (updates both app state and i18n module).
     * @param newLocale
     */
    setLocale(newLocale: Locale): void {
        locale = newLocale;
        setI18nLocale(newLocale);
    },

    /**
     * Pin an item (moves from regular to pinned).
     * @param itemId
     */
    pinItem(itemId: string): boolean {
        if (items.pinned.length >= NAVBAR.maxPinnedItems) {
            return false;
        }

        const index = items.regular.findIndex((item) => item.id === itemId);
        if (index === -1) return false;

        const item = items.regular[index];
        if (!item || !item.canPin) return false;

        items.regular.splice(index, 1);
        items.pinned.push({ ...item });
        return true;
    },

    /**
     * Unpin an item (moves from pinned to regular).
     * @param itemId
     */
    unpinItem(itemId: string): void {
        const index = items.pinned.findIndex((item) => item.id === itemId);
        if (index === -1) return;

        const item = items.pinned[index];
        if (!item) return;
        items.pinned.splice(index, 1);
        items.regular.push({ ...item });
    },

    /** Unpin all items. */
    unpinAll(): void {
        const unpinned = items.pinned.map((item) => ({ ...item }));
        items.regular.push(...unpinned);
        items.pinned = [];
    },

    /**
     * Hide an item (moves from regular/pinned to hidden).
     * @param itemId
     */
    hideItem(itemId: string): void {
        // Check regular items
        let index = items.regular.findIndex((item) => item.id === itemId);
        if (index !== -1) {
            const item = items.regular[index];
            if (!item || !item.canHide) return;
            items.regular.splice(index, 1);
            items.hidden.push(item);
            return;
        }

        // Check pinned items
        index = items.pinned.findIndex((item) => item.id === itemId);
        if (index !== -1) {
            const item = items.pinned[index];
            if (!item || !item.canHide) return;
            items.pinned.splice(index, 1);
            items.hidden.push({ ...item });
        }
    },

    /**
     * Unhide an item (moves from hidden to regular).
     * @param itemId
     */
    unhideItem(itemId: string): void {
        const index = items.hidden.findIndex((item) => item.id === itemId);
        if (index === -1) return;

        const item = items.hidden[index];
        if (!item) return;
        items.hidden.splice(index, 1);
        items.regular.push(item);
    },

    /** Unhide all items. */
    unhideAll(): void {
        items.regular.push(...items.hidden);
        items.hidden = [];
    },

    /**
     * Add a new item to regular panel.
     * @param item
     */
    addItem(item: NavItem): void {
        items.regular.push(item);
    },

    /** Remove the last regular item. */
    removeLastItem(): void {
        if (items.regular.length > 0) {
            items.regular.pop();
        }
    },

    /** Remove a random regular item. */
    removeRandomItem(): void {
        if (items.regular.length === 0) return;
        const index = Math.floor(Math.random() * items.regular.length);
        items.regular.splice(index, 1);
    },

    /** Pin a random unpinned item. */
    pinRandomItem(): void {
        const pinnable = items.regular.filter((item) => item.canPin);
        if (pinnable.length === 0 || items.pinned.length >= NAVBAR.maxPinnedItems) return;

        const randomIndex = Math.floor(Math.random() * pinnable.length);
        const randomItem = pinnable[randomIndex];
        if (randomItem) {
            actions.pinItem(randomItem.id);
        }
    },

    /** Hide a random visible item. */
    hideRandomItem(): void {
        const hideable = [...items.regular, ...items.pinned].filter((item) => item.canHide);
        if (hideable.length === 0) return;

        const randomIndex = Math.floor(Math.random() * hideable.length);
        const randomItem = hideable[randomIndex];
        if (randomItem) {
            actions.hideItem(randomItem.id);
        }
    },

    /**
     * Set the active (selected) item.
     * @param itemId
     */
    setActiveItem(itemId: string | null): void {
        ui.activeItemId = itemId;
    },

    /**
     * Set the focused item (keyboard navigation).
     * @param itemId
     */
    setFocusedItem(itemId: string | null): void {
        ui.focusedItemId = itemId;
    },

    /**
     * Set the hovered item.
     * @param itemId
     */
    setHoveredItem(itemId: string | null): void {
        ui.hoveredItemId = itemId;
    },

    /** Start resize drag operation. */
    startResizeDrag(): void {
        ui.isDraggingResize = true;
    },

    /** End resize drag operation. */
    endResizeDrag(): void {
        ui.isDraggingResize = false;
    },

    /** Dismiss the hide warning permanently. */
    dismissHideWarning(): void {
        ui.hideWarningDismissed = true;
    },

    /**
     * Show info banner.
     * @param titleKey
     * @param descriptionKey
     */
    showBanner(titleKey: string, descriptionKey: string): void {
        ui.banner = { titleKey, descriptionKey };
    },

    /** Hide info banner. */
    hideBanner(): void {
        ui.banner = null;
    },

    /**
     * Show context menu.
     * @param x
     * @param y
     * @param itemId
     */
    showContextMenu(x: number, y: number, itemId: string | null = null): void {
        ui.contextMenu = { x, y, itemId };
    },

    /** Hide context menu. */
    hideContextMenu(): void {
        ui.contextMenu = null;
    },

    /**
     * Show more menu (hidden items).
     * @param x
     * @param y
     */
    showMoreMenu(x: number, y: number): void {
        ui.moreMenu = { x, y };
    },

    /** Hide more menu. */
    hideMoreMenu(): void {
        ui.moreMenu = null;
    },

    /**
     * Show tooltip for an item.
     * @param x
     * @param y
     * @param itemId
     */
    showTooltip(x: number, y: number, itemId: string): void {
        ui.tooltip = { x, y, itemId };
    },

    /** Hide tooltip. */
    hideTooltip(): void {
        ui.tooltip = null;
    },

    /**
     * Show modal dialog.
     * @param config
     * @param config.titleKey
     * @param config.descriptionKey
     * @param config.checkboxKey
     * @param config.onConfirm
     */
    showModal(config: {
        titleKey: string;
        descriptionKey: string;
        checkboxKey?: string;
        onConfirm: (checked: boolean) => void;
    }): void {
        ui.modalConfig = config;
        ui.modalCheckboxChecked = false;
    },

    /** Hide modal dialog. */
    hideModal(): void {
        ui.modalConfig = null;
        ui.modalCheckboxChecked = false;
    },

    /** Toggle modal checkbox. */
    toggleModalCheckbox(): void {
        ui.modalCheckboxChecked = !ui.modalCheckboxChecked;
    },

    /** Reset all state to defaults. */
    reset(): void {
        items = createInitialItems();
        navbarWidth = NAVBAR.defaultWidth;
        isExpanded = true;
        locale = 'en';
        setI18nLocale('en');
        ui = {
            activeItemId: null,
            focusedItemId: null,
            hoveredItemId: null,
            isDraggingResize: false,
            hideWarningDismissed: false,
            banner: null,
            contextMenu: null,
            moreMenu: null,
            tooltip: null,
            modalConfig: null,
            modalCheckboxChecked: false,
        };
    },

    /**
     * Find an item by ID across all panels.
     * @param itemId
     */
    findItem(itemId: string): NavItem | undefined {
        return (
            items.essential.find((i) => i.id === itemId) ??
            items.pinned.find((i) => i.id === itemId) ??
            items.regular.find((i) => i.id === itemId) ??
            items.hidden.find((i) => i.id === itemId) ??
            items.bottom.find((i) => i.id === itemId)
        );
    },
};
