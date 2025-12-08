/**
 * Design Tokens
 * Centralized design constants for consistent styling across components.
 */

/** Border radius used across window and title bar elements. */
export const BORDER_RADIUS = '4';

/** Color palette for all components. */
export const COLORS = {
    // Window
    windowBackground: '#F5F5F5',
    windowBorder: '#007AFF',

    // Title bar
    titleBarBackground: '#E5E5E5',

    // Text
    textPrimary: '#000000',

    // Shadow
    shadowColor: '#000000',

    // Traffic lights (macOS window controls)
    trafficLightClose: '#FF5F57',
    trafficLightMinimize: '#FFBD2E',
    trafficLightMaximize: '#28CA42',
} as const;

/** Typography settings. */
export const TYPOGRAPHY = {
    fontFamily: 'Innovator Grotesk Medium, system-ui, -apple-system, sans-serif',
    titleFontSize: 13,
    titleFontWeight: '500',
} as const;
