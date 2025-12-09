/**
 * Keyboard Utilities
 * Handles keyboard shortcuts and navigation.
 */

import { actions, appState } from '../state/app-state.svelte.js';

/** Keyboard shortcut definition. */
interface KeyboardShortcut {
    key: string;
    code?: string; // Alternative key code
    cmd?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: string;
    /** Only active when no overlay is open. */
    navbarOnly?: boolean;
}

/** Check if running on macOS. */
function isMac(): boolean {
    return typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac');
}

/** All registered keyboard shortcuts. */
const SHORTCUTS: KeyboardShortcut[] = [
    // Navigation switching (always active)
    { key: '1', cmd: true, action: 'navigate-0' },
    { key: '2', cmd: true, action: 'navigate-1' },
    { key: '3', cmd: true, action: 'navigate-2' },
    { key: '4', cmd: true, action: 'navigate-3' },
    { key: '5', cmd: true, action: 'navigate-4' },
    { key: '6', cmd: true, action: 'pinned-0' },
    { key: '7', cmd: true, action: 'pinned-1' },
    { key: '8', cmd: true, action: 'pinned-2' },
    { key: '9', cmd: true, action: 'pinned-3' },
    { key: '0', cmd: true, action: 'navigate-settings' },

    // Navbar management (always active)
    { key: 'b', cmd: true, action: 'toggle-navbar' },
    { key: 'p', cmd: true, shift: true, action: 'pin-current' },
    { key: 'k', cmd: true, shift: true, action: 'show-hidden' },

    // Focus navigation (only when no overlay is open)
    { key: 'ArrowUp', code: 'ArrowUp', action: 'navigate-up', navbarOnly: true },
    { key: 'ArrowDown', code: 'ArrowDown', action: 'navigate-down', navbarOnly: true },
    { key: 'Enter', code: 'Enter', action: 'activate', navbarOnly: true },
    { key: ' ', code: 'Space', action: 'activate', navbarOnly: true },
    { key: 'Home', code: 'Home', action: 'navigate-first', navbarOnly: true },
    { key: 'End', code: 'End', action: 'navigate-last', navbarOnly: true },

    // Close overlay (always active)
    { key: 'Escape', code: 'Escape', action: 'close-overlay' },
];

/** Check if any overlay is currently open. */
function isOverlayOpen(): boolean {
    const ui = appState.ui;
    return !!(ui.contextMenu || ui.moreMenu || ui.banner || ui.modalConfig);
}

/** Get all visible items in order. */
function getAllItems() {
    return [
        ...appState.items.essential,
        ...appState.items.pinned,
        ...appState.items.regular,
        ...appState.items.bottom,
    ];
}

/** Handle keyboard shortcut action. */
function handleAction(action: string): void {
    const items = getAllItems();

    // Handle navigation by index (Cmd+1-5)
    if (action.startsWith('navigate-') && action !== 'navigate-up' && action !== 'navigate-down' && action !== 'navigate-first' && action !== 'navigate-last') {
        const index = parseInt(action.replace('navigate-', ''), 10);
        if (!isNaN(index) && index < items.length) {
            const item = items[index];
            if (item) {
                actions.setActiveItem(item.id);
                actions.setFocusedItem(item.id);
                actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
            }
        } else if (action === 'navigate-settings') {
            const settings = appState.items.bottom.find(i => i.id === 'settings');
            if (settings) {
                actions.setActiveItem(settings.id);
                actions.setFocusedItem(settings.id);
                actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
            }
        }
        return;
    }

    // Handle pinned items (Cmd+6-9)
    if (action.startsWith('pinned-')) {
        const index = parseInt(action.replace('pinned-', ''), 10);
        if (!isNaN(index) && index < appState.items.pinned.length) {
            const item = appState.items.pinned[index];
            if (item) {
                actions.setActiveItem(item.id);
                actions.setFocusedItem(item.id);
                actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
            }
        }
        return;
    }

    // Handle other actions
    switch (action) {
        case 'toggle-navbar':
            if (appState.isExpanded) {
                actions.setNavbarWidth(80);
            } else {
                actions.setNavbarWidth(200);
            }
            break;

        case 'pin-current':
            if (appState.ui.activeItemId) {
                const item = actions.findItem(appState.ui.activeItemId);
                if (item?.canPin) {
                    const isPinned = appState.items.pinned.some(p => p.id === item.id);
                    if (isPinned) {
                        actions.unpinItem(item.id);
                    } else if (appState.canPinMore) {
                        actions.pinItem(item.id);
                    } else {
                        actions.showBanner('banner.pinLimitReached', 'banner.pinLimitReachedDesc');
                    }
                }
            }
            break;

        case 'show-hidden':
            if (appState.hasHiddenItems) {
                actions.showBanner('banner.configureNavbar', 'banner.configureNavbarDesc');
            }
            break;

        case 'navigate-up': {
            const currentIndex = items.findIndex(i => i.id === appState.ui.focusedItemId);
            if (currentIndex > 0) {
                actions.setFocusedItem(items[currentIndex - 1]!.id);
            } else if (currentIndex === -1 && items.length > 0) {
                // No item focused, start from bottom
                actions.setFocusedItem(items[items.length - 1]!.id);
            } else if (currentIndex === 0) {
                // Wrap to bottom
                actions.setFocusedItem(items[items.length - 1]!.id);
            }
            break;
        }

        case 'navigate-down': {
            const currentIndex = items.findIndex(i => i.id === appState.ui.focusedItemId);
            if (currentIndex >= 0 && currentIndex < items.length - 1) {
                actions.setFocusedItem(items[currentIndex + 1]!.id);
            } else if (currentIndex === -1 && items.length > 0) {
                // No item focused, start from top
                actions.setFocusedItem(items[0]!.id);
            } else if (currentIndex === items.length - 1) {
                // Wrap to top
                actions.setFocusedItem(items[0]!.id);
            }
            break;
        }

        case 'navigate-first':
            if (items.length > 0) {
                actions.setFocusedItem(items[0]!.id);
            }
            break;

        case 'navigate-last':
            if (items.length > 0) {
                actions.setFocusedItem(items[items.length - 1]!.id);
            }
            break;

        case 'activate':
            if (appState.ui.focusedItemId) {
                actions.setActiveItem(appState.ui.focusedItemId);
                actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
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

/** Check if event matches shortcut. */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    // Check key or code match
    const keyMatches = event.key === shortcut.key || 
                       (shortcut.code && event.code === shortcut.code);

    if (!keyMatches) return false;

    // Check modifier keys
    const cmdKey = isMac() ? event.metaKey : event.ctrlKey;
    const cmdRequired = shortcut.cmd ?? false;
    const shiftRequired = shortcut.shift ?? false;
    const altRequired = shortcut.alt ?? false;

    return cmdKey === cmdRequired && event.shiftKey === shiftRequired && event.altKey === altRequired;
}

/** Handle keydown event. */
function handleKeyDown(event: KeyboardEvent): void {
    // Don't handle if typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
    }

    const overlayOpen = isOverlayOpen();

    // If an overlay is open, only handle Escape and let the overlay handle the rest
    if (overlayOpen) {
        if (event.key === 'Escape') {
            event.preventDefault();
            handleAction('close-overlay');
        }
        // Let overlay components handle other keys
        return;
    }

    // No overlay open - handle all shortcuts
    for (const shortcut of SHORTCUTS) {
        if (matchesShortcut(event, shortcut)) {
            event.preventDefault();
            event.stopPropagation();
            handleAction(shortcut.action);
            return;
        }
    }
}

/** Initialize keyboard handling. */
export function initKeyboardHandling(): () => void {
    // Use capture phase to handle events before other handlers
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
}
