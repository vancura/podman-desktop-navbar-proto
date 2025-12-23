/**
 * Navigation Items
 * Default navigation items for the navbar.
 */

import type { NavItem } from './types.js';

/** Default essential items (always visible, cannot be hidden/moved). */
export const DEFAULT_ESSENTIAL_ITEMS: NavItem[] = [
    {
        id: 'dashboard',
        labelKey: 'nav.dashboard',
        icon: 'dashboard',
        shortcut: 'cmd+1',
        canHide: false,
        canPin: false,
        originalCategory: 'essential',
    },
    {
        id: 'containers',
        labelKey: 'nav.containers',
        icon: 'box',
        shortcut: 'cmd+2',
        canHide: false,
        canPin: false,
        originalCategory: 'essential',
    },
    {
        id: 'images',
        labelKey: 'nav.images',
        icon: 'gallery',
        shortcut: 'cmd+3',
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
        shortcut: 'cmd+4',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'volumes',
        labelKey: 'nav.volumes',
        icon: 'database',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'kubernetes',
        labelKey: 'nav.kubernetes',
        icon: 'server',
        shortcut: 'cmd+5',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'networks',
        labelKey: 'nav.networks',
        icon: 'networks',
        shortcut: 'cmd+6',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'secrets',
        labelKey: 'nav.secrets',
        icon: 'secrets',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'extensions',
        labelKey: 'nav.extensions',
        icon: 'plug',
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
        canHide: false,
        canPin: false,
        originalCategory: 'bottom',
    },
    {
        id: 'settings',
        labelKey: 'nav.settings',
        icon: 'settings',
        shortcut: 'cmd+,',
        canHide: false,
        canPin: false,
        originalCategory: 'bottom',
    },
];
