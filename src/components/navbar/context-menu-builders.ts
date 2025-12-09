/**
 * Context Menu Builders
 * Factory functions for building context menu items based on context.
 */

import type { IconMode } from '../../state/app-state.js';
import type { NavItem } from '../../state/navigation-items.js';
import type { MenuItemDef } from '../overlays/context-menu.js';

/**
 * Creates context menu items for a navbar item.
 * @param item - The navigation item that was right-clicked.
 * @returns Array of menu item definitions.
 */
export function createItemContextMenuItems(item: NavItem): MenuItemDef[] {
    const items: MenuItemDef[] = [];

    // Pin/Unpin action
    if (item.canPin) {
        const isPinned = item.iconVariant === 'filled';
        items.push({
            id: isPinned ? 'unpin' : 'pin',
            labelKey: isPinned ? 'menu.unpin' : 'menu.pinToTop',
            icon: 'pin',
        });
    }

    // Hide action
    if (item.canHide) {
        items.push({
            id: 'hide',
            labelKey: 'menu.hideFromNavBar',
            icon: 'eyeOff',
        });
    }

    // Separator
    if (items.length > 0) {
        items.push({ id: 'sep1', labelKey: '', isSeparator: true });
    }

    // Keyboard shortcut
    items.push({
        id: 'shortcut',
        labelKey: 'menu.keyboardShortcut',
        icon: 'keyboard',
    });

    // Extension-specific options
    if (item.id.includes('extension') || item.id === 'extensions') {
        items.push({
            id: 'extensionSettings',
            labelKey: 'menu.extensionSettings',
            icon: 'settings',
        });
        items.push({
            id: 'removeExtension',
            labelKey: 'menu.removeExtension',
            icon: 'trash',
            isDestructive: true,
        });
    }

    // Separator and configure option
    items.push({ id: 'sep2', labelKey: '', isSeparator: true });
    items.push({
        id: 'configureNavbar',
        labelKey: 'menu.configureNavbar',
    });

    return items;
}

/**
 * Creates context menu items for empty space in the navbar.
 * @param hiddenItems - Array of currently hidden items.
 * @param displayMode - Current icon display mode.
 * @returns Array of menu item definitions.
 */
export function createEmptySpaceContextMenuItems(hiddenItems: NavItem[], displayMode: IconMode): MenuItemDef[] {
    // Build submenu for hidden items
    let hiddenSubmenu: MenuItemDef[];
    if (hiddenItems.length === 0) {
        hiddenSubmenu = [{ id: 'noHiddenItems', labelKey: 'menu.noHiddenItems', disabled: true }];
    } else {
        hiddenSubmenu = hiddenItems.map((item) => ({
            id: `unhide-${item.id}`,
            labelKey: item.labelKey,
            icon: item.icon,
        }));
    }

    return [
        {
            id: 'toggleIconMode',
            labelKey: displayMode === 'icons-only' ? 'menu.showIconsAndTitles' : 'menu.showIconsOnly',
        },
        {
            id: 'showHiddenItems',
            labelKey: 'menu.showHiddenItems',
            submenu: hiddenSubmenu,
            disabled: hiddenItems.length === 0,
        },
        { id: 'sep1', labelKey: '', isSeparator: true },
        {
            id: 'configureNavbar',
            labelKey: 'menu.configureNavbar',
        },
        {
            id: 'resetNavbar',
            labelKey: 'menu.resetNavbar',
        },
    ];
}

/**
 * Creates context menu items for the Settings item.
 * @returns Array of menu item definitions.
 */
export function createSettingsContextMenuItems(): MenuItemDef[] {
    return [
        {
            id: 'settings',
            labelKey: 'menu.settings',
            icon: 'settings',
        },
        {
            id: 'extensions',
            labelKey: 'menu.extensions',
            icon: 'plug',
        },
        { id: 'sep1', labelKey: '', isSeparator: true },
        {
            id: 'configureNavbar',
            labelKey: 'menu.configureNavbar',
        },
        {
            id: 'keyboardShortcuts',
            labelKey: 'menu.keyboardShortcuts',
            icon: 'keyboard',
        },
        { id: 'sep2', labelKey: '', isSeparator: true },
        {
            id: 'aboutPodman',
            labelKey: 'menu.aboutPodmanDesktop',
            icon: 'info',
        },
    ];
}

/**
 * Creates context menu items for the Account item.
 * @returns Array of menu item definitions.
 */
export function createAccountContextMenuItems(): MenuItemDef[] {
    return [
        {
            id: 'signOut',
            labelKey: 'menu.signOut',
            icon: 'logout',
        },
        { id: 'sep1', labelKey: '', isSeparator: true },
        {
            id: 'configureNavbar',
            labelKey: 'menu.configureNavbar',
        },
    ];
}

