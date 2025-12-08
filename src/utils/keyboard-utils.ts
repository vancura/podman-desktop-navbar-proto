/**
 * Keyboard Utilities
 * Handles keyboard shortcuts and navigation.
 */

/** Keyboard shortcut definition. */
export interface KeyboardShortcut {
    /** Key code or key value. */
    key: string;
    /** Requires Command/Ctrl key. */
    cmd?: boolean;
    /** Requires Shift key. */
    shift?: boolean;
    /** Requires Alt/Option key. */
    alt?: boolean;
    /** Action identifier. */
    action: string;
    /** Optional description. */
    description?: string;
}

/** All registered keyboard shortcuts. */
export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
    // Navigation switching
    { key: '1', cmd: true, action: 'navigate-containers', description: 'Go to Containers' },
    { key: '2', cmd: true, action: 'navigate-images', description: 'Go to Images' },
    { key: '3', cmd: true, action: 'navigate-volumes', description: 'Go to Volumes' },
    { key: '4', cmd: true, action: 'navigate-extensions', description: 'Go to Extensions' },
    { key: '5', cmd: true, action: 'navigate-pinned-1', description: 'Go to Pinned Item 1' },
    { key: '6', cmd: true, action: 'navigate-pinned-2', description: 'Go to Pinned Item 2' },
    { key: '7', cmd: true, action: 'navigate-pinned-3', description: 'Go to Pinned Item 3' },
    { key: '8', cmd: true, action: 'navigate-pinned-4', description: 'Go to Pinned Item 4' },
    { key: '9', cmd: true, action: 'navigate-pinned-5', description: 'Go to Pinned Item 5' },
    { key: '0', cmd: true, action: 'navigate-settings', description: 'Go to Settings' },
    { key: 'F12', cmd: true, action: 'navigate-terminal', description: 'Go to Terminal' },

    // Nav bar management
    { key: 'b', cmd: true, action: 'toggle-navbar', description: 'Toggle Navigation Bar' },
    { key: 'F12', action: 'jump-to-last', description: 'Jump to Last Focused View' },
    { key: 'j', cmd: true, action: 'jump-to-last', description: 'Jump to Last Focused View' },
    { key: 'p', cmd: true, shift: true, action: 'pin-current', description: 'Pin Current Item' },
    { key: 'k', cmd: true, shift: true, action: 'show-hidden', description: 'Show Hidden Items' },

    // Within nav bar
    { key: 'ArrowUp', action: 'navigate-up', description: 'Navigate Up' },
    { key: 'ArrowDown', action: 'navigate-down', description: 'Navigate Down' },
    { key: 'ArrowLeft', action: 'collapse', description: 'Collapse Section' },
    { key: 'ArrowRight', action: 'expand', description: 'Expand Section' },
    { key: 'Enter', action: 'activate', description: 'Activate Selected Item' },
    { key: ' ', action: 'activate', description: 'Activate Selected Item' },
    { key: 'Home', action: 'navigate-first', description: 'Go to First Item' },
    { key: 'End', action: 'navigate-last', description: 'Go to Last Item' },
    { key: 'Escape', action: 'close-overlay', description: 'Close Overlay' },
    { key: 'Tab', action: 'focus-next', description: 'Focus Next' },
    { key: 'Tab', shift: true, action: 'focus-prev', description: 'Focus Previous' },
];

/** Shortcut handler type. */
export type ShortcutHandler = (action: string, event: KeyboardEvent) => void;

/** Active shortcut handlers. */
const handlers: Set<ShortcutHandler> = new Set();

/** Whether keyboard handling is enabled. */
let isEnabled = true;

/**
 * Checks if the platform is macOS.
 * @returns True if running on macOS.
 */
export function isMac(): boolean {
    return navigator.platform.toLowerCase().includes('mac');
}

/**
 * Checks if a keyboard event matches a shortcut.
 * @param event - The keyboard event.
 * @param shortcut - The shortcut to match.
 * @returns True if the event matches the shortcut.
 */
function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    // Check key
    const keyMatches =
        event.key.toLowerCase() === shortcut.key.toLowerCase() ||
        event.code.toLowerCase() === shortcut.key.toLowerCase();

    if (!keyMatches) return false;

    // Check modifiers
    const cmdKey = isMac() ? event.metaKey : event.ctrlKey;
    const cmdRequired = shortcut.cmd ?? false;
    const shiftRequired = shortcut.shift ?? false;
    const altRequired = shortcut.alt ?? false;

    return cmdKey === cmdRequired && event.shiftKey === shiftRequired && event.altKey === altRequired;
}

/**
 * Handles a keyboard event.
 * @param event - The keyboard event.
 */
function handleKeyDown(event: KeyboardEvent): void {
    if (!isEnabled) return;

    // Don't handle if typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
    }

    // Find matching shortcut
    for (const shortcut of KEYBOARD_SHORTCUTS) {
        if (matchesShortcut(event, shortcut)) {
            event.preventDefault();
            event.stopPropagation();

            // Notify all handlers
            for (const handler of handlers) {
                handler(shortcut.action, event);
            }

            return;
        }
    }
}

/**
 * Initializes keyboard handling.
 */
export function initKeyboardHandling(): void {
    document.addEventListener('keydown', handleKeyDown);
}

/**
 * Destroys keyboard handling.
 */
export function destroyKeyboardHandling(): void {
    document.removeEventListener('keydown', handleKeyDown);
    handlers.clear();
}

/**
 * Registers a shortcut handler.
 * @param handler - The handler function.
 * @returns Unregister function.
 */
export function registerShortcutHandler(handler: ShortcutHandler): () => void {
    handlers.add(handler);
    return () => handlers.delete(handler);
}

/**
 * Enables keyboard handling.
 */
export function enableKeyboardHandling(): void {
    isEnabled = true;
}

/**
 * Disables keyboard handling.
 */
export function disableKeyboardHandling(): void {
    isEnabled = false;
}

/**
 * Gets the display string for a shortcut.
 * @param action - The action identifier.
 * @returns The formatted shortcut string, or undefined if not found.
 */
export function getShortcutDisplay(action: string): string | undefined {
    const shortcut = KEYBOARD_SHORTCUTS.find((s) => s.action === action);
    if (!shortcut) return undefined;

    const parts: string[] = [];

    if (shortcut.cmd) {
        parts.push(isMac() ? '⌘' : 'Ctrl');
    }
    if (shortcut.shift) {
        parts.push(isMac() ? '⇧' : 'Shift');
    }
    if (shortcut.alt) {
        parts.push(isMac() ? '⌥' : 'Alt');
    }

    // Format the key
    let key = shortcut.key;
    if (key === ' ') {
        key = 'Space';
    } else if (key.startsWith('Arrow')) {
        key = key.replace('Arrow', '');
    } else if (key.length === 1) {
        key = key.toUpperCase();
    }

    parts.push(key);

    return isMac() ? parts.join('') : parts.join('+');
}

/**
 * Gets all shortcuts for an action.
 * @param action - The action identifier.
 * @returns Array of shortcut definitions.
 */
export function getShortcutsForAction(action: string): KeyboardShortcut[] {
    return KEYBOARD_SHORTCUTS.filter((s) => s.action === action);
}

/**
 * Maps an item ID to its navigation action.
 * @param itemId - The item ID.
 * @returns The navigation action, or undefined.
 */
export function getNavigationActionForItem(itemId: string): string | undefined {
    const mapping: Record<string, string> = {
        containers: 'navigate-containers',
        images: 'navigate-images',
        volumes: 'navigate-volumes',
        extensions: 'navigate-extensions',
        terminal: 'navigate-terminal',
        settings: 'navigate-settings',
    };

    return mapping[itemId];
}

/**
 * Gets the shortcut for an item based on its ID or position.
 * @param itemId - The item ID.
 * @param pinnedIndex - Optional index in pinned items (0-based).
 * @returns The shortcut string, or undefined.
 */
export function getItemShortcut(itemId: string, pinnedIndex?: number): string | undefined {
    // Check direct mapping first
    const action = getNavigationActionForItem(itemId);
    if (action) {
        const shortcut = KEYBOARD_SHORTCUTS.find((s) => s.action === action);
        if (shortcut) {
            return formatShortcutKey(shortcut);
        }
    }

    // Check pinned index
    if (pinnedIndex !== undefined && pinnedIndex >= 0 && pinnedIndex < 5) {
        return `cmd+${pinnedIndex + 5}`;
    }

    return undefined;
}

/**
 * Formats a shortcut key for storage.
 * @param shortcut - The shortcut definition.
 * @returns The formatted shortcut string.
 */
function formatShortcutKey(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.cmd) parts.push('cmd');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.alt) parts.push('alt');
    parts.push(shortcut.key);

    return parts.join('+');
}
