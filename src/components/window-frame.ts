/**
 * Window Frame Component
 * macOS-style window frame with title bar, status bar, navbar, and drop shadow.
 */

import type { AppState } from '../state/app-state.js';
import type { Locale, NavItem } from '../state/navigation-items.js';
import type { InfoBannerConfig } from './overlays/info-banner.js';
import type { ModalDialogConfig, ModalDialogResult } from './overlays/modal-dialog.js';

import { setLocale, subscribeToLocale } from '../i18n/i18n.js';
import { appState } from '../state/app-state.js';
import { COLORS, LAYOUT } from '../utils/design-tokens.js';
import { createSvgElement } from '../utils/svg-utils.js';
import { assert } from '../utils/utils.js';
import { createContentArea, getContentAreaBounds, updateContentArea } from './content-area.js';
import { createButtonGroup } from './controls/action-button.js';
import { createKeyboardShortcutsHelp, getKeyboardShortcutsHelpWidth } from './controls/keyboard-shortcuts-help.js';
import { createLocaleSwitcher, updateLocaleSwitcher } from './controls/locale-switcher.js';
import { createDropShadowFilter, DROP_SHADOW_FILTER_ID } from './drop-shadow.js';
import { NavBar } from './navbar/navbar.js';
import { createResizeHandle, setupResizeDragHandlers, updateResizeHandle } from './navbar/resize-handle.js';
import { InfoBannerManager } from './overlays/info-banner.js';
import { ModalDialogManager } from './overlays/modal-dialog.js';
import { createStatusBar, updateStatusBar } from './status-bar.js';
import { createTitleBar, updateTitleBar } from './title-bar.js';

/** Shadow padding exported for external calculations. */
export const SHADOW_PADDING = LAYOUT.shadowPadding;

/**
 * Calculates the window dimensions based on browser viewport and configuration.
 *
 * The window is sized to fill available space while maintaining minimum dimensions
 * and leaving padding around the edges for visual breathing room.
 *
 * @returns Object with width and height for the window frame.
 */
function calculateWindowDimensions(): { width: number; height: number } {
    return {
        width: Math.max(
            LAYOUT.minWindow.width,
            window.innerWidth - LAYOUT.windowPadding.left - LAYOUT.windowPadding.right,
        ),
        height: Math.max(
            LAYOUT.minWindow.height,
            window.innerHeight - LAYOUT.windowPadding.top - LAYOUT.windowPadding.bottom,
        ),
    };
}

/**
 * Calculates the SVG container dimensions including shadow padding.
 *
 * The SVG is oversized to accommodate the drop shadow effect, which extends
 * beyond the visible window frame. The top/left offsets position the SVG
 * so the window appears at the correct location despite the extra padding.
 *
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
        top: LAYOUT.windowPadding.top - SHADOW_PADDING,
        left: LAYOUT.windowPadding.left - SHADOW_PADDING,
    };
}

/** Navbar layout dimensions. */
interface NavbarLayout {
    navbarX: number;
    navbarY: number;
    navbarHeight: number;
    handleX: number;
}

/**
 * Calculates navbar layout dimensions based on window size and RTL mode.
 *
 * In LTR mode, the navbar is positioned on the left side of the window.
 * In RTL mode, the navbar flips to the right side. The resize handle
 * is positioned at the edge of the navbar closest to the content area.
 *
 * @param windowWidth - Total window width.
 * @param windowHeight - Total window height.
 * @param navbarWidth - Current navbar width.
 * @param isRtl - Whether RTL mode is enabled.
 * @returns The calculated navbar layout dimensions.
 */
function calculateNavbarLayout(
    windowWidth: number,
    windowHeight: number,
    navbarWidth: number,
    isRtl: boolean,
): NavbarLayout {
    const borderPadding = LAYOUT.border.width;
    const navbarY = borderPadding + LAYOUT.titleBar.height;
    const navbarHeight = windowHeight - navbarY - LAYOUT.statusBar.height - borderPadding;
    const navbarX = isRtl ? windowWidth - navbarWidth - borderPadding : borderPadding;
    const handleX = isRtl ? windowWidth - navbarWidth - borderPadding : borderPadding + navbarWidth;

    return { navbarX, navbarY, navbarHeight, handleX };
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
        x: String(LAYOUT.border.width / 2),
        y: String(LAYOUT.border.width / 2),
        width: String(width - LAYOUT.border.width),
        height: String(height - LAYOUT.border.width),
        fill: 'none',
        stroke: COLORS.windowBorder,
        'stroke-width': String(LAYOUT.border.width),
        'data-name': 'border',
    });
}

/**
 * Creates the window frame SVG structure.
 * @param container - The container element to append the SVG to.
 * @param width - Width of the window frame.
 * @param height - Height of the window frame.
 * @param navbarWidth - Current navbar width.
 * @param isRtl - Whether RTL mode is enabled.
 * @returns The created SVG element.
 */
function createWindowFrame(
    container: HTMLElement,
    width: number,
    height: number,
    navbarWidth: number,
    isRtl: boolean,
): SVGSVGElement {
    const svgDimensions = calculateSvgDimensions(width, height);

    const svg = createSvgElement('svg', {
        width: String(svgDimensions.width),
        height: String(svgDimensions.height),
        viewBox: `0 0 ${svgDimensions.width} ${svgDimensions.height}`,
        'data-node-id': '1:2',
        'data-name': 'WF window',
    });

    // Padding from border for all inner elements.
    const borderPadding = LAYOUT.border.width;

    // Drop shadow filter.
    svg.appendChild(createDropShadowFilter());

    // Window group with all content.
    const windowGroup = createWindowGroup();

    windowGroup.appendChild(createWindowBackground(width, height));
    windowGroup.appendChild(createWindowBorder(width, height));
    windowGroup.appendChild(createTitleBar(borderPadding, borderPadding, width, 'Search'));
    windowGroup.appendChild(createStatusBar(borderPadding, width, height));
    windowGroup.appendChild(createContentArea(borderPadding, width, height, navbarWidth, isRtl));

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

    border.setAttribute('width', String(width - LAYOUT.border.width));
    border.setAttribute('height', String(height - LAYOUT.border.width));
}

/**
 * Window Frame Component
 * Manages a macOS-style window frame with responsive sizing and drop shadow.
 */
export class WindowFrame {
    private readonly svg: SVGSVGElement;
    private resizeAnimationFrame = 0;
    private readonly resizeHandler: () => void;
    private navbar!: NavBar;
    private resizeHandleGroup!: SVGGElement;
    private cleanupResizeHandlers!: () => void;
    private unsubscribeState!: () => void;
    private unsubscribeLocale!: () => void;
    private controlsGroup!: SVGGElement;
    private helpGroup!: SVGGElement;
    private localeSwitcherGroup!: SVGGElement;
    private readonly tooltipOverlayGroup: SVGGElement;
    private readonly overlayGroup: SVGGElement;
    private readonly infoBannerManager: InfoBannerManager;
    private readonly modalDialogManager: ModalDialogManager;

    /**
     * Creates a new window frame instance.
     * @param container - The container element to append the window to.
     */
    constructor(container: HTMLElement) {
        const { width, height } = calculateWindowDimensions();
        const state = appState.getState();

        this.svg = createWindowFrame(container, width, height, state.navbarWidth, state.isRtl);

        // Create tooltip overlay group (rendered after content area, before info banners)
        this.tooltipOverlayGroup = createSvgElement('g', { 'data-name': 'tooltip-overlays' });
        this.svg.appendChild(this.tooltipOverlayGroup);

        // Create overlay group for top-level overlays (info banners, modals)
        this.overlayGroup = createSvgElement('g', { 'data-name': 'overlays' });
        this.svg.appendChild(this.overlayGroup);

        // Initialize managers
        this.infoBannerManager = new InfoBannerManager(this.overlayGroup);
        this.modalDialogManager = new ModalDialogManager(this.overlayGroup);

        // Create navbar
        this.createNavbar(width, height);

        // Create content area controls
        this.createControls();

        // Subscribe to state changes
        this.unsubscribeState = appState.subscribe(this.handleStateChange.bind(this));

        // Subscribe to locale changes
        this.unsubscribeLocale = subscribeToLocale((locale) => {
            appState.setLocale(locale);
            // Update locale switcher to reflect the new active locale
            updateLocaleSwitcher(this.localeSwitcherGroup, locale);
        });

        this.resizeHandler = (): void => {
            cancelAnimationFrame(this.resizeAnimationFrame);
            this.resizeAnimationFrame = requestAnimationFrame(() => this.handleWindowResize());
        };

        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Creates the navbar and resize handle.
     * @param windowWidth - Window width.
     * @param windowHeight - Window height.
     */
    private createNavbar(windowWidth: number, windowHeight: number): void {
        const state = appState.getState();
        const layout = calculateNavbarLayout(windowWidth, windowHeight, state.navbarWidth, state.isRtl);

        // Create navbar with info banner and modal callbacks
        this.navbar = new NavBar({
            x: layout.navbarX,
            y: layout.navbarY,
            onShowInfoBanner: (config: InfoBannerConfig) => {
                this.infoBannerManager.show(config);
            },
            onShowModal: (config: ModalDialogConfig): Promise<ModalDialogResult> => {
                return this.modalDialogManager.show(config);
            },
            width: state.navbarWidth,
            height: layout.navbarHeight,
            tooltipOverlayGroup: this.tooltipOverlayGroup,
        });

        this.navbar.updateFromState(state);

        // Add navbar to window group
        const windowGroup = assert(this.svg.querySelector('g[filter]'), 'Window group not found');
        const contentAreaGroup = this.svg.querySelector('g[data-name="content-area-group"]');
        if (contentAreaGroup) {
            windowGroup.insertBefore(this.navbar.getGroup(), contentAreaGroup);
        } else {
            windowGroup.appendChild(this.navbar.getGroup());
        }

        // Create resize handle
        this.resizeHandleGroup = createResizeHandle({
            x: layout.handleX,
            y: layout.navbarY,
            height: layout.navbarHeight,
            isRtl: state.isRtl,
        });
        windowGroup.appendChild(this.resizeHandleGroup);

        // Setup resize drag handlers
        this.cleanupResizeHandlers = setupResizeDragHandlers(this.resizeHandleGroup, {
            isRtl: () => appState.getState().isRtl,
            getCurrentWidth: () => appState.getState().navbarWidth,
            onDragStart: () => appState.startResizeDrag(),
            onDrag: (newWidth) => appState.setNavbarWidth(newWidth),
            onDragEnd: () => appState.endResizeDrag(),
            onDragCancel: () => appState.cancelResizeDrag(),
        });
    }

    /** Column gap between controls and help. */
    private readonly COLUMN_GAP = 60;

    /**
     * Gets the total width of both columns.
     * Left column (buttons): 172px, Right column (help): 180px, Gap: 60px
     * @returns The total width of both columns.
     */
    private getTotalColumnsWidth(): number {
        return 172 + this.COLUMN_GAP + getKeyboardShortcutsHelpWidth();
    }

    /**
     * Calculates X position for the left column (controls).
     * @param bounds - The content area bounds with x and width properties.
     * @param bounds.x
     * @param bounds.width
     * @returns The X position for the controls group.
     */
    private calculateControlsX(bounds: { x: number; width: number }): number {
        const totalWidth = this.getTotalColumnsWidth();
        return bounds.x + (bounds.width - totalWidth) / 2;
    }

    /**
     * Calculates X position for the right column (keyboard shortcuts help).
     * @param bounds - The content area bounds with x and width properties.
     * @param bounds.x
     * @param bounds.width
     * @returns The X position for the help group.
     */
    private calculateHelpX(bounds: { x: number; width: number }): number {
        const controlsX = this.calculateControlsX(bounds);
        return controlsX + 172 + this.COLUMN_GAP; // Left column width + gap
    }

    /**
     * Creates content area controls for testing.
     */
    private createControls(): void {
        const bounds = getContentAreaBounds(this.svg);
        if (!bounds) return;

        const state = appState.getState();
        const controlsX = this.calculateControlsX(bounds);
        const controlsY = bounds.y + 20;

        // Create controls group
        this.controlsGroup = createSvgElement('g', {
            'data-name': 'controls-group',
            transform: `translate(${controlsX}, ${controlsY})`,
        });

        // Item management buttons
        const itemButtons = createButtonGroup(
            'Item Management',
            [
                { id: 'addItem', label: 'Add Item' },
                { id: 'removeLastItem', label: 'Remove Last' },
                { id: 'removeRandomItem', label: 'Remove Random' },
            ],
            0,
            0,
            (buttonId) => this.handleControlButton(buttonId),
        );
        this.controlsGroup.appendChild(itemButtons);

        // Pinning buttons
        const pinButtons = createButtonGroup(
            'Pinning',
            [
                { id: 'pinRandomItem', label: 'Pin Random' },
                { id: 'unpinAllItems', label: 'Unpin All' },
            ],
            0,
            130,
            (buttonId) => this.handleControlButton(buttonId),
        );
        this.controlsGroup.appendChild(pinButtons);

        // Visibility buttons
        const visibilityButtons = createButtonGroup(
            'Visibility',
            [
                { id: 'hideRandomItem', label: 'Hide Random' },
                { id: 'unhideAllItems', label: 'Unhide All' },
            ],
            0,
            230,
            (buttonId) => this.handleControlButton(buttonId),
        );
        this.controlsGroup.appendChild(visibilityButtons);

        // Locale switcher
        this.localeSwitcherGroup = createLocaleSwitcher(
            {
                x: 0,
                y: 330,
                currentLocale: state.locale,
            },
            (locale: Locale) => {
                setLocale(locale);
                appState.setLocale(locale);
            },
        );
        this.controlsGroup.appendChild(this.localeSwitcherGroup);

        // Add controls to content area group
        const contentAreaGroup = this.svg.querySelector('g[data-name="content-area-group"]');
        if (contentAreaGroup) {
            contentAreaGroup.appendChild(this.controlsGroup);
        }

        // Create keyboard shortcuts help (right column)
        const helpX = this.calculateHelpX(bounds);
        const helpY = bounds.y + 20;
        this.helpGroup = createKeyboardShortcutsHelp(helpX, helpY);

        if (contentAreaGroup) {
            contentAreaGroup.appendChild(this.helpGroup);
        }
    }

    /**
     * Updates controls position on resize.
     * Repositions the controls group and help group to remain centered horizontally.
     */
    private updateControls(): void {
        const bounds = getContentAreaBounds(this.svg);
        if (!bounds) return;

        const controlsY = bounds.y + 20;
        const controlsX = this.calculateControlsX(bounds);
        const helpX = this.calculateHelpX(bounds);

        this.controlsGroup.setAttribute('transform', `translate(${controlsX}, ${controlsY})`);
        this.helpGroup.setAttribute('transform', `translate(${helpX}, ${controlsY})`);
    }

    /**
     * Handles control button clicks.
     * @param buttonId
     */
    private handleControlButton(buttonId: string): void {
        switch (buttonId) {
            case 'addItem': {
                // Add a new random extension item
                const newItem: NavItem = {
                    id: `ext-${Date.now()}`,
                    labelKey: 'nav.extensions',
                    icon: 'plug',
                    iconVariant: 'outline',
                    canPin: true,
                    canHide: true,
                    originalCategory: 'regular',
                };
                appState.addItem(newItem);
                break;
            }
            case 'removeLastItem':
                appState.removeLastItem();
                break;
            case 'removeRandomItem':
                appState.removeRandomItem();
                break;
            case 'pinRandomItem':
                appState.pinRandomItem();
                break;
            case 'unpinAllItems':
                appState.unpinAllItems();
                break;
            case 'hideRandomItem':
                appState.hideRandomItem();
                break;
            case 'unhideAllItems':
                appState.unhideAllItems();
                break;
        }
    }

    /**
     * Handles state changes from the state manager.
     * @param state
     * @param prevState
     */
    private handleStateChange(state: AppState, prevState: AppState): void {
        const { width, height } = calculateWindowDimensions();
        const borderPadding = LAYOUT.border.width;

        // Update locale switcher if locale changed
        if (state.locale !== prevState.locale) {
            updateLocaleSwitcher(this.localeSwitcherGroup, state.locale);
        }

        // Update content area if navbar width or RTL changed
        if (state.navbarWidth !== prevState.navbarWidth || state.isRtl !== prevState.isRtl) {
            updateContentArea(this.svg, borderPadding, width, height, state.navbarWidth, state.isRtl);
            this.updateControls();

            // Update navbar and resize handle layout
            const layout = calculateNavbarLayout(width, height, state.navbarWidth, state.isRtl);
            this.navbar.updateDimensions({
                x: layout.navbarX,
                y: layout.navbarY,
                width: state.navbarWidth,
                height: layout.navbarHeight,
            });

            updateResizeHandle(this.resizeHandleGroup, {
                x: layout.handleX,
                y: layout.navbarY,
                height: layout.navbarHeight,
                isRtl: state.isRtl,
            });
        }

        // Update navbar from state
        this.navbar.updateFromState(state);
    }

    /**
     * Handles window resize events.
     */
    private handleWindowResize(): void {
        const { width, height } = calculateWindowDimensions();
        const borderPadding = LAYOUT.border.width;
        const state = appState.getState();

        // Update SVG dimensions
        updateSvgDimensions(this.svg, width, height);
        updateWindowBackground(this.svg, width, height);
        updateWindowBorder(this.svg, width, height);
        updateTitleBar(this.svg, borderPadding, width);
        updateStatusBar(this.svg, borderPadding, width, height);
        updateContentArea(this.svg, borderPadding, width, height, state.navbarWidth, state.isRtl);
        this.updateControls();

        // Update navbar and resize handle layout
        const layout = calculateNavbarLayout(width, height, state.navbarWidth, state.isRtl);
        this.navbar.updateDimensions({
            x: layout.navbarX,
            y: layout.navbarY,
            width: state.navbarWidth,
            height: layout.navbarHeight,
        });

        updateResizeHandle(this.resizeHandleGroup, {
            x: layout.handleX,
            y: layout.navbarY,
            height: layout.navbarHeight,
            isRtl: state.isRtl,
        });
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
     * @returns The navbar.
     */
    getNavbar(): NavBar {
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
        this.cleanupResizeHandlers();
        this.unsubscribeState();
        this.unsubscribeLocale();
        this.navbar.destroy();
        this.svg.remove();
    }
}
