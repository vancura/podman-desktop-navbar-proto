/**
 * Navigation Items
 * Default navigation items for the navbar.
 */

import type { NavItem } from './types.js';

/** Default essential items (always visible, cannot be hidden/moved). */
export const DEFAULT_ESSENTIAL_ITEMS: NavItem[] = [
    {
        id: 'containers',
        labelKey: 'nav.containers',
        icon: 'box',
        iconVariant: 'outline',
        shortcut: 'cmd+1',
        canHide: false,
        canPin: false,
        originalCategory: 'essential',
    },
    {
        id: 'images',
        labelKey: 'nav.images',
        icon: 'gallery',
        iconVariant: 'outline',
        shortcut: 'cmd+2',
        canHide: false,
        canPin: false,
        originalCategory: 'essential',
    },
];

/** Default regular items (can be pinned/hidden). */
export const DEFAULT_REGULAR_ITEMS: NavItem[] = [
    {
        id: 'pods',
        labelKey: 'nav.pods',
        icon: 'widget',
        iconVariant: 'outline',
        shortcut: 'cmd+3',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'volumes',
        labelKey: 'nav.volumes',
        icon: 'database',
        iconVariant: 'outline',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'kubernetes',
        labelKey: 'nav.kubernetes',
        icon: 'server',
        iconVariant: 'outline',
        shortcut: 'cmd+4',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'extensions',
        labelKey: 'nav.extensions',
        icon: 'plug',
        iconVariant: 'outline',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'terminal',
        labelKey: 'nav.terminal',
        icon: 'terminal',
        iconVariant: 'outline',
        shortcut: 'cmd+5',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
];

/** Default bottom items (always visible, cannot be hidden/moved). */
export const DEFAULT_BOTTOM_ITEMS: NavItem[] = [
    {
        id: 'account',
        labelKey: 'nav.account',
        icon: 'user',
        iconVariant: 'outline',
        canHide: false,
        canPin: false,
        originalCategory: 'bottom',
    },
    {
        id: 'settings',
        labelKey: 'nav.settings',
        icon: 'settings',
        iconVariant: 'outline',
        shortcut: 'cmd+,',
        canHide: false,
        canPin: false,
        originalCategory: 'bottom',
    },
];
