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
