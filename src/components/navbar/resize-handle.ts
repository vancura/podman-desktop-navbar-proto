/**
 * Resize Handle Component
 * Draggable edge for resizing the navbar width.
 */

import { COLORS, NAVBAR } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Resize handle configuration. */
export interface ResizeHandleConfig {
    x: number;
    y: number;
    height: number;
    isRtl: boolean;
}

/** Resize event data. */
export interface ResizeEvent {
    deltaX: number;
    startWidth: number;
    currentWidth: number;
}

/** Resize handler type. */
export type ResizeHandler = (event: ResizeEvent) => void;

/**
 * Creates a resize handle element.
 * @param config - Handle configuration.
 * @returns SVG group element.
 */
export function createResizeHandle(config: ResizeHandleConfig): SVGGElement {
    const { x, y, height } = config;

    const group = createSvgElement('g', {
        'data-name': 'resize-handle',
        transform: `translate(${x}, ${y})`,
    });

    // Visible line
    const line = createSvgElement('rect', {
        x: String(-NAVBAR.resizeHandle.width / 2),
        y: '0',
        width: String(NAVBAR.resizeHandle.width),
        height: String(height),
        fill: COLORS.navbarResizeHandle,
        'data-name': 'handle-line',
    });
    group.appendChild(line);

    // Hit area (larger invisible area for easier grabbing)
    const hitArea = createSvgElement('rect', {
        x: String(-NAVBAR.resizeHandle.hitArea / 2),
        y: '0',
        width: String(NAVBAR.resizeHandle.hitArea),
        height: String(height),
        fill: 'transparent',
        cursor: 'ew-resize',
        'data-name': 'handle-hit-area',
    });
    group.appendChild(hitArea);

    return group;
}

/**
 * Updates a resize handle.
 * @param group - The existing SVG group.
 * @param config - New configuration.
 */
export function updateResizeHandle(group: SVGGElement, config: ResizeHandleConfig): void {
    const { x, y, height } = config;

    group.setAttribute('transform', `translate(${x}, ${y})`);

    const line = group.querySelector('[data-name="handle-line"]');
    if (line) {
        line.setAttribute('height', String(height));
    }

    const hitArea = group.querySelector('[data-name="handle-hit-area"]');
    if (hitArea) {
        hitArea.setAttribute('height', String(height));
    }
}

/**
 * Sets the hover state of the resize handle.
 * @param group - The resize handle group.
 * @param isHovered - Whether the handle is hovered.
 */
export function setResizeHandleHover(group: SVGGElement, isHovered: boolean): void {
    const line = group.querySelector('[data-name="handle-line"]');
    if (line) {
        line.setAttribute('fill', isHovered ? COLORS.navbarResizeHandleHover : COLORS.navbarResizeHandle);
        line.setAttribute(
            'width',
            String(isHovered ? NAVBAR.resizeHandle.hoverWidth : NAVBAR.resizeHandle.width),
        );
        line.setAttribute(
            'x',
            String(isHovered ? -NAVBAR.resizeHandle.hoverWidth / 2 : -NAVBAR.resizeHandle.width / 2),
        );
    }
}

/**
 * Creates resize drag handlers.
 * @param group - The resize handle group.
 * @param options - Handler options.
 * @returns Cleanup function.
 */
export function setupResizeDragHandlers(
    group: SVGGElement,
    options: {
        isRtl: () => boolean;
        getCurrentWidth: () => number;
        onDragStart: () => void;
        onDrag: (newWidth: number) => void;
        onDragEnd: () => void;
        onDragCancel: () => void;
    },
): () => void {
    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    const handleMouseDown = (event: MouseEvent): void => {
        if (event.button !== 0) return; // Only left click

        isDragging = true;
        startX = event.clientX;
        startWidth = options.getCurrentWidth();

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ew-resize';

        options.onDragStart();

        event.preventDefault();
        event.stopPropagation();
    };

    const handleMouseMove = (event: MouseEvent): void => {
        if (!isDragging) return;

        const deltaX = options.isRtl() ? startX - event.clientX : event.clientX - startX;

        const newWidth = Math.max(
            NAVBAR.width.min,
            Math.min(NAVBAR.width.max, startWidth + deltaX),
        );

        options.onDrag(newWidth);
    };

    const handleMouseUp = (): void => {
        if (!isDragging) return;

        isDragging = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';

        options.onDragEnd();
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (!isDragging) return;

        if (event.key === 'Escape') {
            isDragging = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';

            options.onDragCancel();
        }
    };

    const handleMouseEnter = (): void => {
        if (!isDragging) {
            setResizeHandleHover(group, true);
        }
    };

    const handleMouseLeave = (): void => {
        if (!isDragging) {
            setResizeHandleHover(group, false);
        }
    };

    // Add event listeners
    const hitArea = group.querySelector('[data-name="handle-hit-area"]');
    if (hitArea) {
        hitArea.addEventListener('mousedown', handleMouseDown as EventListener);
        hitArea.addEventListener('mouseenter', handleMouseEnter);
        hitArea.addEventListener('mouseleave', handleMouseLeave);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
        if (hitArea) {
            hitArea.removeEventListener('mousedown', handleMouseDown as EventListener);
            hitArea.removeEventListener('mouseenter', handleMouseEnter);
            hitArea.removeEventListener('mouseleave', handleMouseLeave);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('keydown', handleKeyDown);
    };
}
