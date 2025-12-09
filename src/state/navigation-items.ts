/**
 * Navigation Items
 * Defines the navigation item interface and default items.
 */

import type { IconName, IconVariant } from '../icons/icons.js';

/** Supported locales. */
export type Locale = 'en' | 'de' | 'ja' | 'ar' | 'he';

/** Navigation item category. */
export type ItemCategory = 'essential' | 'pinned' | 'regular' | 'hidden' | 'bottom';

/** Navigation item definition. */
export interface NavItem {
    /** Unique identifier. */
    id: string;

    /** Translation key for the label. */
    labelKey: string;

    /** Icon name from the icon set. */
    icon: IconName;

    /** Icon variant (outline for regular, filled for pinned). */
    iconVariant: IconVariant;

    /** Keyboard shortcut (e.g., 'cmd+1'). */
    shortcut?: string;

    /** Associated extension ID (for extension items). */
    extensionId?: string;

    /** Whether this item can be hidden. */
    canHide: boolean;

    /** Whether this item can be pinned. */
    canPin: boolean;

    /** Original category before any user customization. */
    originalCategory: ItemCategory;
}

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
        shortcut: 'cmd+F12',
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
        shortcut: 'cmd+0',
        canHide: false,
        canPin: false,
        originalCategory: 'bottom',
    },
];

/** Sample extension items for testing. */
export const SAMPLE_EXTENSION_ITEMS: NavItem[] = [
    {
        id: 'ext-docker-compose',
        labelKey: 'nav.dockerCompose',
        icon: 'widget',
        iconVariant: 'outline',
        extensionId: 'docker-compose',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'ext-kind',
        labelKey: 'nav.kind',
        icon: 'server',
        iconVariant: 'outline',
        extensionId: 'kind',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'ext-lima',
        labelKey: 'nav.lima',
        icon: 'box',
        iconVariant: 'outline',
        extensionId: 'lima',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'ext-bootc',
        labelKey: 'nav.bootc',
        icon: 'database',
        iconVariant: 'outline',
        extensionId: 'bootc',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
    {
        id: 'ext-minikube',
        labelKey: 'nav.minikube',
        icon: 'server',
        iconVariant: 'outline',
        extensionId: 'minikube',
        canHide: true,
        canPin: true,
        originalCategory: 'regular',
    },
];

/** Maximum number of pinned items allowed. */
export const MAX_PINNED_ITEMS = 10;

/**
 * Creates a new navigation item with a unique ID.
 * @param baseItem - Base item properties.
 * @returns New navigation item with unique ID.
 */
export function createNavItem(baseItem: Omit<NavItem, 'id'>): NavItem {
    return {
        ...baseItem,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
}

/**
 * Clones a navigation item with a new ID.
 * @param item - Item to clone.
 * @returns Cloned item with new ID.
 */
export function cloneNavItem(item: NavItem): NavItem {
    return {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
}
