/**
 * Window Frame Component
 * macOS-style window frame with title bar, status bar, navbar, and drop shadow.
 */

import { subscribeToLocale } from '../i18n/i18n.js';
import { stateManager, type NavBarState } from '../state/navbar-state.js';
import { COLORS } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';
import { assert } from '../utils/utils.js';
import { createContentArea, setNavbarWidth, setRtlMode, updateContentArea } from './content-area.js';
import { createDropShadowFilter, DROP_SHADOW_FILTER_ID } from './drop-shadow.js';
import { NavBar } from './navbar/navbar.js';
import { createResizeHandle, setupResizeDragHandlers, updateResizeHandle } from './navbar/resize-handle.js';
import { createStatusBar, updateStatusBar } from './status-bar.js';
import { createTitleBar, updateTitleBar } from './title-bar.js';

/** Shadow padding exported for external calculations. */
export const SHADOW_PADDING = 100;

const WINDOW_CONFIG = {
    borderWidth: 2,

    padding: {
        top: 54,
        right: 40,
        bottom: 40,
        left: 40,
    },
} as const;

/**
 * Calculates the window dimensions based on browser viewport and configuration.
 * @returns Object with width and height for the window frame.
 */
function calculateWindowDimensions(): { width: number; height: number } {
    return {
        width: Math.max(550, window.innerWidth - WINDOW_CONFIG.padding.left - WINDOW_CONFIG.padding.right),
        height: Math.max(200, window.innerHeight - WINDOW_CONFIG.padding.top - WINDOW_CONFIG.padding.bottom),
    };
}

/**
 * Calculates the SVG container dimensions including shadow padding.
 * @param width - Window frame width.
 * @param height - Window frame height.
 * @returns Object with SVG width, height, and position offsets.
 */
function calculateSvgDimensions(
    width: number,
    height: number,
): { width: number; height: number; top: number; left: number } {
    return {
        width: width + SHADOW_PADDING * 2,
        height: height + SHADOW_PADDING * 2,
        top: WINDOW_CONFIG.padding.top - SHADOW_PADDING,
        left: WINDOW_CONFIG.padding.left - SHADOW_PADDING,
    };
}

/**
 * Creates the main window group container with shadow filter.
 * @returns The window group SVG element.
 */
function createWindowGroup(): SVGGElement {
    return createSvgElement('g', {
        transform: `translate(${SHADOW_PADDING}, ${SHADOW_PADDING})`,
        filter: `url(#${DROP_SHADOW_FILTER_ID})`,
    });
}

/**
 * Creates the window background rectangle.
 * @param width - Width of the background.
 * @param height - Height of the background.
 * @returns The background SVG rect element.
 */
function createWindowBackground(width: number, height: number): SVGRectElement {
    return createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        fill: COLORS.windowBackground,
        'data-name': 'background',
    });
}

/**
 * Creates the window border rectangle.
 * @param width - Width of the window.
 * @param height - Height of the window.
 * @returns The border SVG rect element.
 */
function createWindowBorder(width: number, height: number): SVGRectElement {
    return createSvgElement('rect', {
        x: String(WINDOW_CONFIG.borderWidth / 2),
        y: String(WINDOW_CONFIG.borderWidth / 2),
        width: String(width - WINDOW_CONFIG.borderWidth),
        height: String(height - WINDOW_CONFIG.borderWidth),
        fill: 'none',
        stroke: COLORS.windowBorder,
        'stroke-width': String(WINDOW_CONFIG.borderWidth),
        'data-name': 'border',
    });
}

/**
 * Creates the window frame SVG structure.
 * @param container - The container element to append the SVG to.
 * @param width - Width of the window frame.
 * @param height - Height of the window frame.
 * @returns The created SVG element.
 */
function createWindowFrame(container: HTMLElement, width: number, height: number): SVGSVGElement {
    const svgDimensions = calculateSvgDimensions(width, height);

    const svg = createSvgElement('svg', {
        width: String(svgDimensions.width),
        height: String(svgDimensions.height),
        viewBox: `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
        'data-node-id': '1:2',
        'data-name': 'WF window',
    });

    // Padding from border for all inner elements.
    const borderPadding = WINDOW_CONFIG.borderWidth;

    // Drop shadow filter.
    svg.appendChild(createDropShadowFilter());

    // Window group with all content.
    const windowGroup = createWindowGroup();

    windowGroup.appendChild(createWindowBackground(width, height));
    windowGroup.appendChild(createWindowBorder(width, height));
    windowGroup.appendChild(createTitleBar(borderPadding, borderPadding, width, 'Search'));
    windowGroup.appendChild(createStatusBar(borderPadding, width, height));
    windowGroup.appendChild(createContentArea(borderPadding, width, height));

    svg.appendChild(windowGroup);

    // Position SVG with padding (account for shadow padding offset).
    svg.style.position = 'absolute';
    svg.style.top = `${svgDimensions.top}px`;
    svg.style.left = `${svgDimensions.left}px`;

    container.appendChild(svg);

    return svg;
}

/**
 * Updates the SVG element dimensions and position.
 * @param svg - The SVG element to update.
 * @param width - New window width.
 * @param height - New window height.
 */
function updateSvgDimensions(svg: SVGSVGElement, width: number, height: number): void {
    const svgDimensions = calculateSvgDimensions(width, height);

    svg.setAttribute('width', String(svgDimensions.width));
    svg.setAttribute('height', String(svgDimensions.height));
    svg.setAttribute('viewBox', `0 0 ${svgDimensions.width} ${svgDimensions.height}`);

    svg.style.top = `${svgDimensions.top}px`;
    svg.style.left = `${svgDimensions.left}px`;
}

/**
 * Updates the window background dimensions.
 * @param svg - The SVG element containing the background.
 * @param width - New width.
 * @param height - New height.
 */
function updateWindowBackground(svg: SVGSVGElement, width: number, height: number): void {
    const background = assert(svg.querySelector('rect[data-name="background"]'), 'Background element not found');

    background.setAttribute('width', String(width));
    background.setAttribute('height', String(height));
}

/**
 * Updates the window border dimensions.
 * @param svg - The SVG element containing the border.
 * @param width - New width.
 * @param height - New height.
 */
function updateWindowBorder(svg: SVGSVGElement, width: number, height: number): void {
    const border = assert(svg.querySelector('rect[data-name="border"]'), 'Border element not found');

    border.setAttribute('width', String(width - WINDOW_CONFIG.borderWidth));
    border.setAttribute('height', String(height - WINDOW_CONFIG.borderWidth));
}

/**
 * Window Frame Component
 * Manages a macOS-style window frame with responsive sizing and drop shadow.
 */
export class WindowFrame {
    private svg: SVGSVGElement;
    private resizeAnimationFrame = 0;
    private resizeHandler: () => void;
    private navbar: NavBar | null = null;
    private resizeHandleGroup: SVGGElement | null = null;
    private cleanupResizeHandlers: (() => void) | null = null;
    private unsubscribeState: (() => void) | null = null;
    private unsubscribeLocale: (() => void) | null = null;

    /**
     * Creates a new window frame instance.
     * @param container - The container element to append the window to.
     */
    constructor(container: HTMLElement) {
        const { width, height } = calculateWindowDimensions();
        const state = stateManager.getState();

        // Initialize content area with current navbar width
        setNavbarWidth(state.navbarWidth);
        setRtlMode(state.isRtl);

        this.svg = createWindowFrame(container, width, height);

        // Create navbar
        this.createNavbar(width, height);

        // Subscribe to state changes
        this.unsubscribeState = stateManager.subscribe(this.handleStateChange.bind(this));

        // Subscribe to locale changes
        this.unsubscribeLocale = subscribeToLocale((locale) => {
            stateManager.setLocale(locale);
        });

        this.resizeHandler = (): void => {
            cancelAnimationFrame(this.resizeAnimationFrame);
            this.resizeAnimationFrame = requestAnimationFrame(() => this.handleWindowResize());
        };

        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Creates the navbar and resize handle.
     */
    private createNavbar(windowWidth: number, windowHeight: number): void {
        const state = stateManager.getState();
        const borderPadding = WINDOW_CONFIG.borderWidth;

        // Calculate navbar dimensions
        const navbarX = state.isRtl
            ? windowWidth - state.navbarWidth - borderPadding
            : borderPadding;
        const navbarY = borderPadding + 32; // Below title bar
        const navbarHeight = windowHeight - navbarY - 32 - borderPadding; // Above status bar

        // Create navbar
        this.navbar = new NavBar({
            x: navbarX,
            y: navbarY,
            width: state.navbarWidth,
            height: navbarHeight,
        });

        this.navbar.updateFromState(state);

        // Add navbar to window group
        const windowGroup = this.svg.querySelector('g[filter]');
        if (windowGroup) {
            // Insert navbar before content area
            const contentAreaGroup = this.svg.querySelector('g[data-name="content-area-group"]');
            if (contentAreaGroup) {
                windowGroup.insertBefore(this.navbar.getGroup(), contentAreaGroup);
            } else {
                windowGroup.appendChild(this.navbar.getGroup());
            }
        }

        // Create resize handle
        const handleX = state.isRtl
            ? windowWidth - state.navbarWidth - borderPadding
            : borderPadding + state.navbarWidth;

        this.resizeHandleGroup = createResizeHandle({
            x: handleX,
            y: navbarY,
            height: navbarHeight,
            isRtl: state.isRtl,
        });

        if (windowGroup) {
            windowGroup.appendChild(this.resizeHandleGroup);
        }

        // Setup resize drag handlers
        this.cleanupResizeHandlers = setupResizeDragHandlers(this.resizeHandleGroup, {
            isRtl: () => stateManager.getState().isRtl,
            getCurrentWidth: () => stateManager.getState().navbarWidth,
            onDragStart: () => stateManager.startResizeDrag(),
            onDrag: (newWidth) => stateManager.setNavbarWidth(newWidth),
            onDragEnd: () => stateManager.endResizeDrag(),
            onDragCancel: () => stateManager.cancelResizeDrag(),
        });
    }

    /**
     * Handles state changes from the state manager.
     */
    private handleStateChange(state: NavBarState, prevState: NavBarState): void {
        const { width, height } = calculateWindowDimensions();
        const borderPadding = WINDOW_CONFIG.borderWidth;

        // Update content area if navbar width or RTL changed
        if (state.navbarWidth !== prevState.navbarWidth || state.isRtl !== prevState.isRtl) {
            setNavbarWidth(state.navbarWidth);
            setRtlMode(state.isRtl);
            updateContentArea(this.svg, borderPadding, width, height);

            // Update navbar dimensions
            if (this.navbar) {
                const navbarX = state.isRtl
                    ? width - state.navbarWidth - borderPadding
                    : borderPadding;
                const navbarY = borderPadding + 32;
                const navbarHeight = height - navbarY - 32 - borderPadding;

                this.navbar.updateDimensions({
                    x: navbarX,
                    y: navbarY,
                    width: state.navbarWidth,
                    height: navbarHeight,
                });
            }

            // Update resize handle position
            if (this.resizeHandleGroup) {
                const handleX = state.isRtl
                    ? width - state.navbarWidth - borderPadding
                    : borderPadding + state.navbarWidth;
                const navbarY = borderPadding + 32;
                const navbarHeight = height - navbarY - 32 - borderPadding;

                updateResizeHandle(this.resizeHandleGroup, {
                    x: handleX,
                    y: navbarY,
                    height: navbarHeight,
                    isRtl: state.isRtl,
                });
            }
        }

        // Update navbar from state
        if (this.navbar) {
            this.navbar.updateFromState(state);
        }
    }

    /**
     * Handles window resize events.
     */
    private handleWindowResize(): void {
        const { width, height } = calculateWindowDimensions();
        const borderPadding = WINDOW_CONFIG.borderWidth;
        const state = stateManager.getState();

        // Update SVG dimensions
        updateSvgDimensions(this.svg, width, height);
        updateWindowBackground(this.svg, width, height);
        updateWindowBorder(this.svg, width, height);
        updateTitleBar(this.svg, borderPadding, width);
        updateStatusBar(this.svg, borderPadding, width, height);
        updateContentArea(this.svg, borderPadding, width, height);

        // Update navbar dimensions
        if (this.navbar) {
            const navbarX = state.isRtl
                ? width - state.navbarWidth - borderPadding
                : borderPadding;
            const navbarY = borderPadding + 32;
            const navbarHeight = height - navbarY - 32 - borderPadding;

            this.navbar.updateDimensions({
                x: navbarX,
                y: navbarY,
                width: state.navbarWidth,
                height: navbarHeight,
            });
        }

        // Update resize handle
        if (this.resizeHandleGroup) {
            const handleX = state.isRtl
                ? width - state.navbarWidth - borderPadding
                : borderPadding + state.navbarWidth;
            const navbarY = borderPadding + 32;
            const navbarHeight = height - navbarY - 32 - borderPadding;

            updateResizeHandle(this.resizeHandleGroup, {
                x: handleX,
                y: navbarY,
                height: navbarHeight,
                isRtl: state.isRtl,
            });
        }
    }

    /**
     * Gets the SVG element representing the window frame.
     * @returns The SVG element.
     */
    getSvg(): SVGSVGElement {
        return this.svg;
    }

    /**
     * Gets the navbar instance.
     * @returns The navbar or null.
     */
    getNavbar(): NavBar | null {
        return this.navbar;
    }

    /**
     * Gets the content area element where child content can be added.
     * @returns The content area rectangle element.
     */
    getContentArea(): SVGRectElement {
        return assert(
            this.svg.querySelector<SVGRectElement>('rect[data-name="content-area"]'),
            'Content area element not found',
        );
    }

    /**
     * Destroys the window frame instance and cleans up event listeners.
     */
    destroy(): void {
        window.removeEventListener('resize', this.resizeHandler);
        cancelAnimationFrame(this.resizeAnimationFrame);

        if (this.cleanupResizeHandlers) {
            this.cleanupResizeHandlers();
        }

        if (this.unsubscribeState) {
            this.unsubscribeState();
        }

        if (this.unsubscribeLocale) {
            this.unsubscribeLocale();
        }

        if (this.navbar) {
            this.navbar.destroy();
        }

        this.svg.remove();
    }
}
