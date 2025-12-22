/**
 * Keyboard Utilities
 * Global keyboard shortcut handling for the application.
 * Individual overlay components handle their own keyboard navigation.
 */

import { actions, appState } from '../state/app-state.svelte.js';

// ============================================================================
// Types
// ============================================================================

/** Keyboard shortcut definition. */
interface KeyboardShortcut {
    /** The key to match (e.g., '1', 'ArrowUp'). */
    key: string;
    /** Alternative key code for reliable matching. */
    code?: string;
    /** Requires Cmd (Mac) or Ctrl (Windows/Linux). */
    cmd?: boolean;
    /** Requires Shift modifier. */
    shift?: boolean;
    /** Requires Alt/Option modifier. */
    alt?: boolean;
    /** Action identifier to execute. */
    action: string;
    /** Only active when no overlay is open. */
    navbarOnly?: boolean;
}

// ============================================================================
// Keyboard Shortcut Visibility
// ============================================================================

/** Timeout for showing keyboard shortcuts after holding CMD/CTRL. */
const SHORTCUT_SHOW_DELAY_MS = 750;

/** Timer for delayed keyboard shortcut visibility. */
let shortcutVisibilityTimer: ReturnType<typeof setTimeout> | null = null;

/** Track if CMD/CTRL is currently pressed. */
let isMetaKeyPressed = false;

// ============================================================================
// Platform Detection
// ============================================================================

/** Check if running on macOS. */
const IS_MAC = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');

/** Platform override for keyboard shortcut display. */
type PlatformOverride = 'mac' | 'windows';

/** Current platform override setting. */
let platformOverride: PlatformOverride = 'mac';

/** Callbacks to notify when platform override changes. */
const platformChangeCallbacks: Set<() => void> = new Set();

/**
 * Get the current platform for keyboard shortcuts.
 * Returns true for Mac, false for Windows/Linux.
 */
function getEffectivePlatform(): boolean {
    return platformOverride === 'mac';
}

/**
 * Format a keyboard shortcut for display based on platform.
 * @param keys - Object describing the shortcut (e.g., { cmd: true, key: '1' })
 * @returns Formatted shortcut string (e.g., '⌘1' on Mac, 'Ctrl+1' on Windows)
 */
export function formatKeyboardShortcut(keys: { cmd?: boolean; shift?: boolean; alt?: boolean; key?: string }): string {
    const isMac = getEffectivePlatform();
    const parts: string[] = [];

    if (keys.cmd) {
        parts.push(isMac ? '⌘' : 'Ctrl');
    }
    if (keys.shift) {
        parts.push(isMac ? '⇧' : 'Shift');
    }
    if (keys.alt) {
        parts.push(isMac ? '⌥' : 'Alt');
    }
    if (keys.key) {
        parts.push(keys.key);
    }

    return isMac ? parts.join('') : parts.join('+');
}

/**
 * Get platform override setting.
 */
export function getPlatformOverride(): PlatformOverride {
    return platformOverride;
}

/**
 * Set platform override for keyboard shortcut display.
 * @param override - 'mac' for macOS or 'windows' for Windows/Linux
 */
export function setPlatformOverride(override: PlatformOverride): void {
    if (platformOverride !== override) {
        platformOverride = override;
        // Notify all subscribers of the change
        platformChangeCallbacks.forEach((callback) => callback());
    }
}

/**
 * Get the current effective platform name for display.
 */
export function getEffectivePlatformName(): string {
    return getEffectivePlatform() ? 'macOS' : 'Windows/Linux';
}

/**
 * Subscribe to platform override changes.
 * @param callback - Function to call when platform override changes
 * @returns Unsubscribe function
 */
export function subscribeToPlatformChanges(callback: () => void): () => void {
    platformChangeCallbacks.add(callback);
    return () => platformChangeCallbacks.delete(callback);
}

// ============================================================================
// Shortcut Definitions
// ============================================================================

/** All registered keyboard shortcuts. */
const SHORTCUTS: KeyboardShortcut[] = [
    // Quick navigation: Cmd+1-5 for main items
    { key: '1', cmd: true, action: 'navigate-0' },
    { key: '2', cmd: true, action: 'navigate-1' },
    { key: '3', cmd: true, action: 'navigate-2' },
    { key: '4', cmd: true, action: 'navigate-3' },
    { key: '5', cmd: true, action: 'navigate-4' },

    // Pinned items: Cmd+6-9
    { key: '6', cmd: true, action: 'pinned-0' },
    { key: '7', cmd: true, action: 'pinned-1' },
    { key: '8', cmd: true, action: 'pinned-2' },
    { key: '9', cmd: true, action: 'pinned-3' },

    // Settings: Cmd+0
    { key: '0', cmd: true, action: 'navigate-settings' },

    // Navbar management
    { key: 'b', cmd: true, action: 'toggle-navbar' },
    { key: 'p', cmd: true, action: 'pin-current' },
    { key: 'k', cmd: true, shift: true, action: 'show-hidden' },

    // Arrow key navigation (only when no overlay is open)
    { key: 'ArrowUp', code: 'ArrowUp', action: 'navigate-up', navbarOnly: true },
    { key: 'ArrowDown', code: 'ArrowDown', action: 'navigate-down', navbarOnly: true },
    { key: 'Enter', code: 'Enter', action: 'activate', navbarOnly: true },
    { key: ' ', code: 'Space', action: 'activate', navbarOnly: true },
    { key: 'Home', code: 'Home', action: 'navigate-first', navbarOnly: true },
    { key: 'End', code: 'End', action: 'navigate-last', navbarOnly: true },

    // Close any overlay
    { key: 'Escape', code: 'Escape', action: 'close-overlay' },
];

// ============================================================================
// Helper Functions
// ============================================================================

/** Check if any overlay is currently open. */
function isOverlayOpen(): boolean {
    const { contextMenu, moreMenu, banner, modalConfig } = appState.ui;
    return !!(contextMenu || moreMenu || banner || modalConfig);
}

/** Get all visible navigation items in display order. */
function getAllVisibleItems() {
    const { essential, pinned, regular, bottom } = appState.items;
    return [...essential, ...pinned, ...regular, ...bottom];
}

/**
 * Activate a navigation item and show prototype banner.
 * @param itemId
 */
function activateItem(itemId: string): void {
    actions.setActiveItem(itemId);
    actions.setFocusedItem(itemId);
    actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
}

/**
 * Navigate focus to a specific item by index with wrapping.
 * @param delta
 */
function navigateFocusByDelta(delta: number): void {
    const items = getAllVisibleItems();
    if (items.length === 0) return;

    const currentIndex = items.findIndex((i) => i.id === appState.ui.focusedItemId);

    let newIndex: number;
    if (currentIndex === -1) {
        // No item focused - start from beginning or end based on direction
        newIndex = delta > 0 ? 0 : items.length - 1;
    } else {
        // Wrap around navigation
        newIndex = (currentIndex + delta + items.length) % items.length;
    }

    const item = items[newIndex];
    if (item) {
        actions.setFocusedItem(item.id);
    }
}

/**
 * Execute a keyboard shortcut action.
 * @param action
 */
function executeAction(action: string): void {
    const items = getAllVisibleItems();

    // Quick navigation by index (Cmd+1-5)
    if (
        action.startsWith('navigate-') &&
        !['navigate-up', 'navigate-down', 'navigate-first', 'navigate-last'].includes(action)
    ) {
        if (action === 'navigate-settings') {
            const settings = appState.items.bottom.find((i) => i.id === 'settings');
            if (settings) activateItem(settings.id);
        } else {
            const index = parseInt(action.replace('navigate-', ''), 10);
            if (!Number.isNaN(index) && index >= 0 && index < items.length) {
                const item = items[index];
                if (item) {
                    activateItem(item.id);
                }
            }
        }
        return;
    }

    // Pinned items navigation (Cmd+6-9)
    if (action.startsWith('pinned-')) {
        const index = parseInt(action.replace('pinned-', ''), 10);
        const pinnedItem = appState.items.pinned[index];
        if (pinnedItem) {
            activateItem(pinnedItem.id);
        }
        return;
    }

    // Other actions
    switch (action) {
        case 'toggle-navbar':
            actions.setNavbarWidth(appState.isExpanded ? 80 : 200);
            break;

        case 'pin-current': {
            const focusedId = appState.ui.focusedItemId;
            if (!focusedId) break;

            const item = actions.findItem(focusedId);
            if (!item?.canPin) break;

            const isPinned = appState.items.pinned.some((p) => p.id === item.id);
            if (isPinned) {
                actions.unpinItem(item.id);
            } else if (appState.canPinMore) {
                actions.pinItem(item.id);
            } else {
                actions.showBanner('banner.pinLimitReached', 'banner.pinLimitReachedDesc');
            }
            break;
        }

        case 'show-hidden':
            if (appState.hasHiddenItems) {
                // Position the menu near where the More button would be
                const navbarWidth = appState.navbarWidth;
                const isRtl = appState.isRtl;

                // Calculate x position based on RTL mode
                // In LTR: navbar is on left, x is at navbar edge + padding (8px)
                // In RTL: navbar is on right, x is at window width - navbar width + padding
                const padding = 88;
                const x = isRtl
                    ? typeof window !== 'undefined'
                        ? window.innerWidth - navbarWidth + padding - 160
                        : navbarWidth + padding
                    : padding;

                // Calculate y position from bottom
                // Bottom panel items (typically 2): ~88px collapsed or ~112px expanded
                // Plus padding (8px) + divider (2px) + More button area (36px)
                const bottomOffset = appState.isExpanded ? 331 : 134;
                const y = typeof window !== 'undefined' ? window.innerHeight - bottomOffset : 500;

                actions.showMoreMenu(x, y);
            }
            break;

        case 'navigate-up':
            navigateFocusByDelta(-1);
            break;

        case 'navigate-down':
            navigateFocusByDelta(1);
            break;

        case 'navigate-first':
            if (items.length > 0) {
                const item = items[0];
                if (item) {
                    actions.setFocusedItem(item.id);
                }
            }
            break;

        case 'navigate-last':
            if (items.length > 0) {
                const item = items[items.length - 1];
                if (item) {
                    actions.setFocusedItem(item.id);
                }
            }
            break;

        case 'activate':
            if (appState.ui.focusedItemId) {
                activateItem(appState.ui.focusedItemId);
            }
            break;

        case 'close-overlay':
            actions.hideBanner();
            actions.hideContextMenu();
            actions.hideMoreMenu();
            actions.hideModal();
            break;
    }
}

// ============================================================================
// Shortcut Matching
// ============================================================================

/**
 * Check if a keyboard event matches a shortcut definition.
 * @param event
 * @param shortcut
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    // Match by key or code (code is more reliable for physical keys)
    const keyMatches = event.key === shortcut.key || (shortcut.code && event.code === shortcut.code);
    if (!keyMatches) return false;

    // Check modifier keys - Always use actual platform for matching, not override
    // (Override only affects display, not actual keybindings)
    const cmdPressed = IS_MAC ? event.metaKey : event.ctrlKey;
    const cmdRequired = shortcut.cmd ?? false;
    const shiftRequired = shortcut.shift ?? false;
    const altRequired = shortcut.alt ?? false;

    return cmdPressed === cmdRequired && event.shiftKey === shiftRequired && event.altKey === altRequired;
}

// ============================================================================
// Event Handler
// ============================================================================

/**
 * Handle CMD/CTRL key press for showing keyboard shortcuts.
 * @param event
 */
function handleMetaKeyPress(event: KeyboardEvent): void {
    // Always use actual platform for detecting key press
    const cmdPressed = IS_MAC ? event.metaKey : event.ctrlKey;

    // Only proceed if CMD/CTRL is pressed and wasn't already pressed
    if (cmdPressed && !isMetaKeyPressed) {
        isMetaKeyPressed = true;

        // Clear any existing timer
        if (shortcutVisibilityTimer) {
            clearTimeout(shortcutVisibilityTimer);
        }

        // Set timer to show shortcuts after delay
        shortcutVisibilityTimer = setTimeout(() => {
            if (isMetaKeyPressed) {
                actions.showKeyboardShortcuts();
            }
        }, SHORTCUT_SHOW_DELAY_MS);
    }
}

/**
 * Handle CMD/CTRL key release for hiding keyboard shortcuts.
 * @param event
 */
function handleMetaKeyRelease(event: KeyboardEvent): void {
    // Always use actual platform for detecting key release
    const cmdPressed = IS_MAC ? event.metaKey : event.ctrlKey;

    // Hide shortcuts when CMD/CTRL is released
    if (!cmdPressed && isMetaKeyPressed) {
        isMetaKeyPressed = false;

        // Clear the timer if shortcuts haven't been shown yet
        if (shortcutVisibilityTimer) {
            clearTimeout(shortcutVisibilityTimer);
            shortcutVisibilityTimer = null;
        }

        // Hide shortcuts immediately
        actions.hideKeyboardShortcuts();
    }
}

/**
 * Global keydown event handler.
 * @param event
 */
function handleKeyDown(event: KeyboardEvent): void {
    // Handle CMD/CTRL press for keyboard shortcut visibility
    handleMetaKeyPress(event);

    // Ignore keyboard events when user is typing in form fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
    }

    // When an overlay is open, only handle Escape globally
    // Other keys are handled by individual overlay components
    if (isOverlayOpen()) {
        if (event.key === 'Escape') {
            event.preventDefault();
            executeAction('close-overlay');
        }
        return;
    }

    // Try to match against all registered shortcuts
    for (const shortcut of SHORTCUTS) {
        if (matchesShortcut(event, shortcut)) {
            event.preventDefault();
            event.stopPropagation();
            executeAction(shortcut.action);
            return;
        }
    }
}

/**
 * Global keyup event handler.
 * @param event
 */
function handleKeyUp(event: KeyboardEvent): void {
    // Handle CMD/CTRL release for keyboard shortcut visibility
    handleMetaKeyRelease(event);
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize global keyboard shortcut handling.
 * @returns Cleanup function to remove event listener.
 */
export function initKeyboardHandling(): () => void {
    // Use capture phase to intercept events before other handlers
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('keyup', handleKeyUp, true);

        // Clean up any pending timers
        if (shortcutVisibilityTimer) {
            clearTimeout(shortcutVisibilityTimer);
            shortcutVisibilityTimer = null;
        }
    };
}
