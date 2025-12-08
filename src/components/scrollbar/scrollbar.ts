/**
 * Scrollbar Component
 * macOS-style scrollbar that appears on scroll and fades after idle.
 */

import { COLORS, NAVBAR } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Scrollbar configuration. */
export interface ScrollbarConfig {
    x: number;
    y: number;
    height: number;
    contentHeight: number;
    scrollTop: number;
}


/**
 * Creates a scrollbar component.
 * @param config - The scrollbar configuration.
 * @returns The scrollbar group element.
 */
export function createScrollbar(config: ScrollbarConfig): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'scrollbar',
        opacity: '0',
    });

    // Create track (invisible, just for hit area)
    const track = createSvgElement('rect', {
        'data-name': 'scrollbar-track',
        x: String(config.x),
        y: String(config.y),
        width: String(NAVBAR.scrollbar.width),
        height: String(config.height),
        fill: COLORS.scrollbarTrack,
        rx: String(NAVBAR.scrollbar.borderRadius),
        ry: String(NAVBAR.scrollbar.borderRadius),
    });

    // Calculate thumb dimensions
    const thumbHeight = calculateThumbHeight(config.height, config.contentHeight);
    const thumbY = calculateThumbY(config.y, config.height, config.contentHeight, config.scrollTop, thumbHeight);

    // Create thumb
    const thumb = createSvgElement('rect', {
        'data-name': 'scrollbar-thumb',
        x: String(config.x),
        y: String(thumbY),
        width: String(NAVBAR.scrollbar.width),
        height: String(thumbHeight),
        fill: COLORS.scrollbarThumb,
        rx: String(NAVBAR.scrollbar.borderRadius),
        ry: String(NAVBAR.scrollbar.borderRadius),
        cursor: 'pointer',
    });

    group.appendChild(track);
    group.appendChild(thumb);

    return group;
}

/**
 * Calculates the thumb height based on viewport and content ratio.
 */
function calculateThumbHeight(viewportHeight: number, contentHeight: number): number {
    if (contentHeight <= viewportHeight) {
        return viewportHeight;
    }
    const ratio = viewportHeight / contentHeight;
    const minHeight = 30;
    return Math.max(minHeight, viewportHeight * ratio);
}

/**
 * Calculates the thumb Y position based on scroll position.
 */
function calculateThumbY(
    trackY: number,
    trackHeight: number,
    contentHeight: number,
    scrollTop: number,
    thumbHeight: number,
): number {
    if (contentHeight <= trackHeight) {
        return trackY;
    }
    const maxScroll = contentHeight - trackHeight;
    const scrollRatio = scrollTop / maxScroll;
    const availableTrack = trackHeight - thumbHeight;
    return trackY + availableTrack * scrollRatio;
}

/**
 * Updates the scrollbar position and dimensions.
 * @param group - The scrollbar group element.
 * @param config - The new configuration.
 */
export function updateScrollbar(group: SVGGElement, config: ScrollbarConfig): void {
    const track = group.querySelector('[data-name="scrollbar-track"]');
    const thumb = group.querySelector('[data-name="scrollbar-thumb"]');

    if (!track || !thumb) return;

    // Update track
    track.setAttribute('x', String(config.x));
    track.setAttribute('y', String(config.y));
    track.setAttribute('height', String(config.height));

    // Update thumb
    const thumbHeight = calculateThumbHeight(config.height, config.contentHeight);
    const thumbY = calculateThumbY(config.y, config.height, config.contentHeight, config.scrollTop, thumbHeight);

    thumb.setAttribute('x', String(config.x));
    thumb.setAttribute('y', String(thumbY));
    thumb.setAttribute('height', String(thumbHeight));
}

/**
 * Shows the scrollbar with optional auto-hide.
 * @param group - The scrollbar group element.
 * @param autoHide - Whether to automatically hide after delay.
 * @returns A function to cancel the auto-hide timer.
 */
export function showScrollbar(group: SVGGElement, autoHide = true): (() => void) | null {
    group.setAttribute('opacity', '1');

    if (!autoHide) return null;

    const timeoutId = window.setTimeout(() => {
        hideScrollbar(group);
    }, NAVBAR.scrollbar.hideDelay);

    return () => window.clearTimeout(timeoutId);
}

/**
 * Hides the scrollbar with fade animation.
 * @param group - The scrollbar group element.
 */
export function hideScrollbar(group: SVGGElement): void {
    group.setAttribute('opacity', '0');
}

/**
 * Sets the scrollbar hover state.
 * @param group - The scrollbar group element.
 * @param hovered - Whether the scrollbar is hovered.
 */
export function setScrollbarHovered(group: SVGGElement, hovered: boolean): void {
    const thumb = group.querySelector('[data-name="scrollbar-thumb"]');
    if (thumb) {
        thumb.setAttribute('fill', hovered ? COLORS.scrollbarThumbHover : COLORS.scrollbarThumb);
    }
}

/**
 * Checks if scrolling is needed.
 * @param viewportHeight - The viewport height.
 * @param contentHeight - The content height.
 * @returns True if content exceeds viewport.
 */
export function needsScrollbar(viewportHeight: number, contentHeight: number): boolean {
    return contentHeight > viewportHeight;
}

/**
 * Sets up scrollbar drag handlers.
 * @param group - The scrollbar group element.
 * @param callbacks - Drag callbacks.
 * @returns Cleanup function.
 */
export function setupScrollbarDragHandlers(
    group: SVGGElement,
    callbacks: {
        getConfig: () => ScrollbarConfig;
        onScroll: (scrollTop: number) => void;
        onDragStart?: () => void;
        onDragEnd?: () => void;
    },
): () => void {
    const thumb = group.querySelector('[data-name="scrollbar-thumb"]');
    if (!thumb) return () => {};

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    const handleMouseDown = (e: Event): void => {
        const mouseEvent = e as MouseEvent;
        isDragging = true;
        startY = mouseEvent.clientY;
        const config = callbacks.getConfig();
        startScrollTop = config.scrollTop;

        callbacks.onDragStart?.();
        setScrollbarHovered(group, true);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        mouseEvent.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent): void => {
        if (!isDragging) return;

        const config = callbacks.getConfig();
        const deltaY = e.clientY - startY;

        // Calculate scroll delta based on thumb movement
        const thumbHeight = calculateThumbHeight(config.height, config.contentHeight);
        const availableTrack = config.height - thumbHeight;
        const maxScroll = config.contentHeight - config.height;

        if (availableTrack > 0) {
            const scrollDelta = (deltaY / availableTrack) * maxScroll;
            const newScrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + scrollDelta));
            callbacks.onScroll(newScrollTop);
        }
    };

    const handleMouseUp = (): void => {
        isDragging = false;
        callbacks.onDragEnd?.();
        setScrollbarHovered(group, false);

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseEnter = (): void => {
        if (!isDragging) {
            setScrollbarHovered(group, true);
        }
    };

    const handleMouseLeave = (): void => {
        if (!isDragging) {
            setScrollbarHovered(group, false);
        }
    };

    thumb.addEventListener('mousedown', handleMouseDown);
    thumb.addEventListener('mouseenter', handleMouseEnter);
    thumb.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        thumb.removeEventListener('mousedown', handleMouseDown);
        thumb.removeEventListener('mouseenter', handleMouseEnter);
        thumb.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
}
