/**
 * Design Tokens
 * Centralized design constants for consistent styling across components.
 */

/** Color palette for all components. */
export const COLORS = {
    // Window.
    contentAreaBackground: '#e5e5e5',
    windowBackground: '#f5f5f5',
    windowBorder: '#007aff',

    // Title bar.
    titleBarBackground: '#e5e5e5',

    // Status bar.
    statusBarBackground: '#dbd6ea',

    // Text.
    textPrimary: '#222',

    // Shadow.
    shadowColor: 'black',

    // Traffic lights (macOS window controls).
    trafficLightClose: '#ff5f57',
    trafficLightMinimize: '#ffbd2e',
    trafficLightMaximize: '#28ca42',
} as const;

/** Typography settings. */
export const TYPOGRAPHY = {
    fontFamily: 'Innovator Grotesk Medium, system-ui, -apple-system, sans-serif',
    titleFontSize: 14,
    titleFontWeight: '500',
} as const;
