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
    textSecondary: '#666',
    textMuted: '#999',

    // Shadow.
    shadowColor: 'black',

    // Traffic lights (macOS window controls).
    trafficLightClose: '#ff5f57',
    trafficLightMinimize: '#ffbd2e',
    trafficLightMaximize: '#28ca42',

    // Navbar.
    navbarBackground: '#292d3e',
    navbarItemHover: 'rgba(255, 255, 255, 0.08)',
    navbarItemActive: 'rgba(255, 255, 255, 0.12)',
    navbarItemSelected: 'rgba(138, 99, 210, 0.25)',
    navbarText: '#a6accd',
    navbarTextActive: '#ffffff',
    navbarTextMuted: '#676e95',
    navbarDivider: 'rgba(255, 255, 255, 0.08)',
    navbarResizeHandle: 'rgba(255, 255, 255, 0.15)',
    navbarResizeHandleHover: 'rgba(138, 99, 210, 0.6)',

    // Scrollbar.
    scrollbarTrack: 'transparent',
    scrollbarThumb: 'rgba(255, 255, 255, 0.2)',
    scrollbarThumbHover: 'rgba(255, 255, 255, 0.35)',

    // Tooltip.
    tooltipBackground: '#1e2030',
    tooltipBorder: '#3b4261',
    tooltipText: '#c8d3f5',
    tooltipShortcut: '#7a88cf',

    // Context menu.
    menuBackground: '#1e2030',
    menuBorder: '#3b4261',
    menuItemHover: 'rgba(138, 99, 210, 0.3)',
    menuItemText: '#c8d3f5',
    menuItemTextDisabled: '#545c7e',
    menuSeparator: '#3b4261',
    menuSubmenuArrow: '#7a88cf',

    // Info banner and modals.
    overlayBackground: 'rgba(0, 0, 0, 0.6)',
    bannerBackground: '#1e2030',
    bannerBorder: '#3b4261',
    bannerText: '#c8d3f5',
    bannerTextSecondary: '#7a88cf',

    // Focus ring.
    focusRing: '#8a63d2',
    focusRingOffset: '#292d3e',

    // Action buttons.
    buttonBackground: '#3b4261',
    buttonBackgroundHover: '#4a5380',
    buttonBackgroundActive: '#5a63a0',
    buttonText: '#c8d3f5',
    buttonBorder: '#545c7e',
} as const;

/** Typography settings. */
export const TYPOGRAPHY = {
    fontFamily: 'Innovator Grotesk Medium, system-ui, -apple-system, sans-serif',
    titleFontSize: 14,
    titleFontWeight: '500',

    // Navbar item text.
    navbarItemFontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    navbarItemFontSize: 11,
    navbarItemFontWeight: '500',
    navbarItemLineHeight: 1.3,

    // Tooltip text.
    tooltipFontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    tooltipFontSize: 12,
    tooltipFontWeight: '400',

    // Menu text.
    menuFontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    menuFontSize: 13,
    menuFontWeight: '400',

    // Shortcut text.
    shortcutFontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    shortcutFontSize: 11,
    shortcutFontWeight: '400',

    // Banner text.
    bannerTitleFontSize: 16,
    bannerTitleFontWeight: '600',
    bannerTextFontSize: 14,
    bannerTextFontWeight: '400',

    // Button text.
    buttonFontSize: 12,
    buttonFontWeight: '500',
} as const;

/** Navbar dimensions and layout. */
export const NAVBAR = {
    width: {
        min: 80,
        max: 300,
        default: 200,
        iconOnlyThreshold: 160,
        hysteresis: 10,
    },

    item: {
        height: 56,
        heightIconOnly: 44,
        iconSize: 24,
        iconSizeDense: 20,
        hitAreaMin: 44,
        paddingHorizontal: 8,
        paddingVertical: 6,
        gap: 4,
        borderRadius: 8,
    },

    panel: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingHorizontal: 8,
    },

    divider: {
        height: 1,
        marginVertical: 8,
        marginHorizontal: 12,
    },

    moreButton: {
        height: 32,
        paddingVertical: 6,
    },

    scrollbar: {
        width: 6,
        borderRadius: 3,
        fadeHeight: 24,
        showDelay: 0,
        hideDelay: 1000,
    },

    resizeHandle: {
        width: 4,
        hoverWidth: 8,
        hitArea: 12,
    },
} as const;

/** Animation and transition timings. */
export const ANIMATIONS = {
    fast: 100,
    normal: 200,
    slow: 300,

    easing: {
        default: 'ease-out',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    tooltip: {
        showDelay: 500,
        hideDelay: 100,
        duration: 150,
    },

    menu: {
        showDuration: 150,
        hideDuration: 100,
    },

    scrollbar: {
        fadeDuration: 300,
    },
} as const;

/** Z-index layering. */
export const Z_INDEX = {
    navbar: 100,
    resizeHandle: 150,
    tooltip: 200,
    contextMenu: 300,
    submenu: 310,
    modal: 400,
    infoBanner: 500,
} as const;

/** Accessibility constants. */
export const ACCESSIBILITY = {
    focusRingWidth: 2,
    focusRingOffset: 2,
    minTouchTarget: 44,
    reducedMotionDuration: 0,
} as const;

/** Window layout constants. */
export const LAYOUT = {
    /** Title bar at top of window. */
    titleBar: {
        height: 32,
    },

    /** Status bar at bottom of window. */
    statusBar: {
        height: 32,
    },

    /** Window border. */
    border: {
        width: 2,
    },

    /** Window frame padding from viewport edge. */
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

    /** Drop shadow padding around window. */
    shadowPadding: 100,
} as const;
