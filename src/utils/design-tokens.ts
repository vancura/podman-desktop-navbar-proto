/**
 * Design Tokens
 * Centralized design constants for consistent styling across components.
 */

/** Color palette for all components. */
export const COLORS = {
    // Window.
    contentAreaBackground: '#f0f', //'#f6f6f6',
    windowBackground: '#F5F5F5',
    windowBorder: '#007AFF',

    // Title bar.
    titleBarBackground: '#E5E5E5',

    // Status bar.
    statusBarBackground: '#34265a',

    // Text.
    textPrimary: '#222',

    // Shadow.
    shadowColor: 'black',

    // Traffic lights (macOS window controls).
    trafficLightClose: '#FF5F57',
    trafficLightMinimize: '#FFBD2E',
    trafficLightMaximize: '#28CA42',
} as const;

/** Typography settings. */
export const TYPOGRAPHY = {
    fontFamily: 'Innovator Grotesk Medium, system-ui, -apple-system, sans-serif',
    titleFontSize: 14,
    titleFontWeight: '500',
} as const;
