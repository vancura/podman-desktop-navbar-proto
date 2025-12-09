/**
 * Type Definitions
 * Core types for navigation items and application state.
 */

/** Icon names available in the icon set. */
export type IconName =
    | 'box'
    | 'gallery'
    | 'widget'
    | 'database'
    | 'server'
    | 'plug'
    | 'terminal'
    | 'user'
    | 'settings'
    | 'chevron-right'
    | 'more';

/** Icon variant - outline for regular, filled for pinned items. */
export type IconVariant = 'outline' | 'filled';

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

    /** Whether this item can be hidden by the user. */
    canHide: boolean;

    /** Whether this item can be pinned by the user. */
    canPin: boolean;

    /** Original category before any user customization. */
    originalCategory: ItemCategory;
}

