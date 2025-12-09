/**
 * Application Constants
 * Runtime constants for navbar dimensions and behavior.
 * Visual styling is handled via CSS custom properties in app.css.
 */

/** Navbar width constraints and behavior thresholds. */
export const NAVBAR = {
    /** Minimum width in pixels. */
    minWidth: 80,

    /** Maximum width in pixels. */
    maxWidth: 300,

    /** Default width in pixels. */
    defaultWidth: 200,

    /** Width threshold below which icon-only mode is used. */
    collapseThreshold: 160,

    /** Hysteresis to prevent mode flickering during resize. */
    hysteresis: 10,

    /** Maximum number of pinned items allowed. */
    maxPinnedItems: 10,
} as const;

/** Window layout dimensions in pixels. */
export const LAYOUT = {
    /** Title bar height. */
    titleBarHeight: 32,

    /** Status bar height. */
    statusBarHeight: 32,

    /** Window border width. */
    borderWidth: 2,

    /** Padding around window frame. */
    windowPadding: {
        top: 54,
        right: 40,
        bottom: 40,
        left: 40,
    },

    /** Minimum window dimensions. */
    minWindow: {
        width: 550,
        height: 200,
    },
} as const;

/** Animation timing constants in milliseconds. */
export const TIMING = {
    /** Fast animations (hover effects). */
    fast: 100,

    /** Normal animations (transitions). */
    normal: 200,

    /** Slow animations (page transitions). */
    slow: 300,

    /** Tooltip show delay. */
    tooltipShowDelay: 500,

    /** Tooltip hide delay. */
    tooltipHideDelay: 100,

    /** Scrollbar auto-hide delay. */
    scrollbarHideDelay: 1000,
} as const;

/** Keyboard shortcut modifier based on platform. */
export const MODIFIER_KEY = navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';

