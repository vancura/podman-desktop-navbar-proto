/**
 * Window Frame Component
 * macOS-style window frame with title bar, traffic lights, and drop shadow.
 */

import { assert } from './utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Shadow padding exported for external calculations. */
export const SHADOW_PADDING = 100;

const WINDOW_CONFIG = {
    titleBarHeight: 34,

    trafficLights: {
        left: 8,
        top: 8,
        spacing: 6,
        circleRadius: 5.5,
        colors: {
            close: '#FF5F57',
            minimize: '#FFBD2E',
            maximize: '#28CA42',
        },
    },

    titleText: {
        fontSize: 11,
        top: 15,
        fontFamily: 'Innovator Grotesk Medium, system-ui, -apple-system, sans-serif',
        fontWeight: '500',
        color: '#000000',
    },

    contentPadding: {
        top: 34,
        right: 20,
        bottom: 20,
        left: 20,
    },

    colors: {
        background: '#F5F5F5',
        border: '#007AFF',
        titleBar: '#E5E5E5',
    },

    borderWidth: 1,

    padding: {
        top: 120,
        right: 20,
        bottom: 20,
        left: 20,
    },
} as const;

/**
 * Creates an SVG element with the specified attributes.
 * @param tag - The SVG element tag name.
 * @param attrs - Attributes to set on the element.
 * @returns The created SVG element.
 */
function createSvgElement<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string> = {},
): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
    }

    return element;
}

/**
 * Calculates the window dimensions based on browser viewport and configuration.
 * @returns Object with width and height for the window frame.
 */
function calculateWindowDimensions(): { width: number; height: number } {
    return {
        width: window.innerWidth - WINDOW_CONFIG.padding.left - WINDOW_CONFIG.padding.right,
        height: window.innerHeight - WINDOW_CONFIG.padding.top - WINDOW_CONFIG.padding.bottom,
    };
}

/**
 * Creates the window frame SVG structure.
 * @param container - The container element to append the SVG to.
 * @param width - Width of the window frame.
 * @param height - Height of the window frame.
 * @returns The created SVG element.
 */
function createWindowFrame(container: HTMLElement, width: number, height: number): SVGSVGElement {
    const svgWidth = width + SHADOW_PADDING * 2;
    const svgHeight = height + SHADOW_PADDING * 2;

    const svg = createSvgElement('svg', {
        width: String(svgWidth),
        height: String(svgHeight),
        viewBox: `0 0 ${svgWidth} ${svgHeight}`,
        'data-node-id': '1:2',
        'data-name': 'WF window',
    });

    // Padding from border for all inner elements
    const titleBarPadding = WINDOW_CONFIG.borderWidth;

    // Create drop shadow filter (macOS-like)
    const defs = createSvgElement('defs');
    const filter = createSvgElement('filter', {
        id: 'window-drop-shadow',
        x: '-50%',
        y: '-50%',
        width: '200%',
        height: '200%',
    });

    // Shadow offset (downward)
    const feOffset = createSvgElement('feOffset', {
        dx: '0',
        dy: '4',
        in: 'SourceAlpha',
        result: 'offset',
    });
    filter.appendChild(feOffset);

    // Shadow blur
    const feGaussianBlur = createSvgElement('feGaussianBlur', {
        in: 'offset',
        stdDeviation: '12',
        result: 'blur',
    });
    filter.appendChild(feGaussianBlur);

    // Shadow color and opacity (black with 20% opacity)
    const feFlood = createSvgElement('feFlood', {
        'flood-color': '#000000',
        'flood-opacity': '0.2',
        result: 'shadowColor',
    });
    filter.appendChild(feFlood);

    // Composite shadow color with blur
    const feComposite1 = createSvgElement('feComposite', {
        in: 'shadowColor',
        in2: 'blur',
        operator: 'in',
        result: 'shadow',
    });
    filter.appendChild(feComposite1);

    // Composite shadow with original
    const feComposite2 = createSvgElement('feComposite', {
        in: 'SourceGraphic',
        in2: 'shadow',
        operator: 'over',
    });
    filter.appendChild(feComposite2);

    defs.appendChild(filter);
    svg.appendChild(defs);

    // Group for window content (offset by shadow padding)
    const windowGroup = createSvgElement('g', {
        transform: `translate(${SHADOW_PADDING}, ${SHADOW_PADDING})`,
        filter: 'url(#window-drop-shadow)',
    });

    // Window background
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        fill: WINDOW_CONFIG.colors.background,
        rx: '4',
        'data-name': 'background',
    });
    windowGroup.appendChild(background);

    // Window border (around the whole window)
    const border = createSvgElement('rect', {
        x: String(WINDOW_CONFIG.borderWidth / 2),
        y: String(WINDOW_CONFIG.borderWidth / 2),
        width: String(width - WINDOW_CONFIG.borderWidth),
        height: String(height - WINDOW_CONFIG.borderWidth),
        fill: 'none',
        stroke: WINDOW_CONFIG.colors.border,
        'stroke-width': String(WINDOW_CONFIG.borderWidth),
        rx: '4',
        'data-name': 'border',
    });
    windowGroup.appendChild(border);

    // Title bar background (padded from border)
    const titleBar = createSvgElement('rect', {
        x: String(titleBarPadding),
        y: String(titleBarPadding),
        width: String(width - titleBarPadding * 2),
        height: String(WINDOW_CONFIG.titleBarHeight),
        fill: WINDOW_CONFIG.colors.titleBar,
        rx: '4',
        'data-name': 'title-bar',
    });
    windowGroup.appendChild(titleBar);

    // Traffic lights group
    const trafficLightsGroup = createSvgElement('g', {
        'data-node-id': '1:9',
        'data-name': 'trafic lights',
    });

    const { trafficLights } = WINDOW_CONFIG;
    const circleDiameter = trafficLights.circleRadius * 2;
    const startX = titleBarPadding + trafficLights.left + trafficLights.circleRadius;

    // Close button (red)
    const trafficLightsY = titleBarPadding + trafficLights.top + trafficLights.circleRadius;
    const closeCircle = createSvgElement('circle', {
        cx: String(startX),
        cy: String(trafficLightsY),
        r: String(trafficLights.circleRadius),
        fill: trafficLights.colors.close,
    });
    trafficLightsGroup.appendChild(closeCircle);

    // Minimize button (orange)
    const minimizeCircle = createSvgElement('circle', {
        cx: String(startX + circleDiameter + trafficLights.spacing),
        cy: String(trafficLightsY),
        r: String(trafficLights.circleRadius),
        fill: trafficLights.colors.minimize,
    });
    trafficLightsGroup.appendChild(minimizeCircle);

    // Maximize button (green)
    const maximizeCircle = createSvgElement('circle', {
        cx: String(startX + (circleDiameter + trafficLights.spacing) * 2),
        cy: String(trafficLightsY),
        r: String(trafficLights.circleRadius),
        fill: trafficLights.colors.maximize,
    });
    trafficLightsGroup.appendChild(maximizeCircle);

    windowGroup.appendChild(trafficLightsGroup);

    // Window title text (padded from border)
    const titleText = createSvgElement('text', {
        x: String(width / 2),
        y: String(titleBarPadding + WINDOW_CONFIG.titleText.top),
        fill: WINDOW_CONFIG.titleText.color,
        'font-family': WINDOW_CONFIG.titleText.fontFamily,
        'font-size': String(WINDOW_CONFIG.titleText.fontSize),
        'font-weight': WINDOW_CONFIG.titleText.fontWeight,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'data-node-id': '1:7',
    });
    titleText.textContent = 'Window Title';
    windowGroup.appendChild(titleText);

    // Content area (for future navigation bar, padded from border)
    const contentAreaX = titleBarPadding + WINDOW_CONFIG.contentPadding.left;
    const contentAreaY = titleBarPadding + WINDOW_CONFIG.contentPadding.top;
    const contentArea = createSvgElement('rect', {
        x: String(contentAreaX),
        y: String(contentAreaY),
        width: String(width - contentAreaX - WINDOW_CONFIG.contentPadding.right - titleBarPadding),
        height: String(height - contentAreaY - WINDOW_CONFIG.contentPadding.bottom - titleBarPadding),
        fill: 'transparent',
        'data-node-id': '1:8',
        'data-name': 'content',
    });
    windowGroup.appendChild(contentArea);

    // Add window group to SVG
    svg.appendChild(windowGroup);

    // Position SVG with padding (account for shadow padding offset)
    svg.style.position = 'absolute';
    svg.style.top = `${WINDOW_CONFIG.padding.top - SHADOW_PADDING}px`;
    svg.style.left = `${WINDOW_CONFIG.padding.left - SHADOW_PADDING}px`;

    container.appendChild(svg);

    return svg;
}

/**
 * Handles window resize events and updates the SVG accordingly.
 * @param svg - The SVG element to update.
 */
function handleResize(svg: SVGSVGElement): void {
    const { width, height } = calculateWindowDimensions();
    const svgWidth = width + SHADOW_PADDING * 2;
    const svgHeight = height + SHADOW_PADDING * 2;

    svg.setAttribute('width', String(svgWidth));
    svg.setAttribute('height', String(svgHeight));
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    svg.style.top = `${WINDOW_CONFIG.padding.top - SHADOW_PADDING}px`;
    svg.style.left = `${WINDOW_CONFIG.padding.left - SHADOW_PADDING}px`;

    // Update all elements that depend on dimensions
    const background = assert(svg.querySelector('rect[data-name="background"]'), 'Background element not found');
    background.setAttribute('width', String(width));
    background.setAttribute('height', String(height));

    const border = assert(svg.querySelector('rect[data-name="border"]'), 'Border element not found');
    border.setAttribute('width', String(width - WINDOW_CONFIG.borderWidth));
    border.setAttribute('height', String(height - WINDOW_CONFIG.borderWidth));

    const titleBarPadding = WINDOW_CONFIG.borderWidth;
    const titleBar = assert(svg.querySelector('rect[data-name="title-bar"]'), 'Title bar element not found');
    titleBar.setAttribute('width', String(width - titleBarPadding * 2));

    const titleText = assert(svg.querySelector('text[data-node-id="1:7"]'), 'Title text element not found');
    titleText.setAttribute('x', String(width / 2));

    const contentAreaX = titleBarPadding + WINDOW_CONFIG.contentPadding.left;
    const contentAreaY = titleBarPadding + WINDOW_CONFIG.contentPadding.top;
    const contentArea = assert(svg.querySelector('rect[data-name="content"]'), 'Content area element not found');
    contentArea.setAttribute('x', String(contentAreaX));
    contentArea.setAttribute('y', String(contentAreaY));
    contentArea.setAttribute(
        'width',
        String(width - contentAreaX - WINDOW_CONFIG.contentPadding.right - titleBarPadding),
    );
    contentArea.setAttribute(
        'height',
        String(height - contentAreaY - WINDOW_CONFIG.contentPadding.bottom - titleBarPadding),
    );
}

/**
 * Window Frame Component
 * Manages a macOS-style window frame with responsive sizing and drop shadow.
 */
export class WindowFrame {
    private svg: SVGSVGElement;
    private resizeAnimationFrame = 0;
    private resizeHandler: () => void;

    /**
     * Creates a new window frame instance.
     * @param container - The container element to append the window to.
     */
    constructor(container: HTMLElement) {
        const { width, height } = calculateWindowDimensions();
        this.svg = createWindowFrame(container, width, height);

        this.resizeHandler = (): void => {
            cancelAnimationFrame(this.resizeAnimationFrame);
            this.resizeAnimationFrame = requestAnimationFrame(() => handleResize(this.svg));
        };

        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Gets the SVG element representing the window frame.
     * @returns The SVG element.
     */
    getSvg(): SVGSVGElement {
        return this.svg;
    }

    /**
     * Gets the content area element where child content can be added.
     * @returns The content area rectangle element.
     */
    getContentArea(): SVGRectElement {
        return assert(
            this.svg.querySelector<SVGRectElement>('rect[data-name="content"]'),
            'Content area element not found',
        );
    }

    /**
     * Destroys the window frame instance and cleans up event listeners.
     */
    destroy(): void {
        window.removeEventListener('resize', this.resizeHandler);
        cancelAnimationFrame(this.resizeAnimationFrame);
        this.svg.remove();
    }
}
