/**
 * RTL (Right-to-Left) Utilities
 * Handles layout transformations for RTL languages like Arabic.
 */

import { isRtl } from '../i18n/i18n.js';

/**
 * Gets the horizontal alignment based on RTL mode.
 * @param alignment - The original alignment ('left' or 'right').
 * @returns The adjusted alignment for RTL.
 */
export function getHorizontalAlignment(alignment: 'left' | 'right' | 'center'): 'left' | 'right' | 'center' {
    if (alignment === 'center') return 'center';
    if (!isRtl()) return alignment;
    return alignment === 'left' ? 'right' : 'left';
}

/**
 * Gets the text anchor based on RTL mode.
 * @param anchor - The original anchor ('start', 'middle', 'end').
 * @returns The adjusted anchor for RTL.
 */
export function getTextAnchor(anchor: 'start' | 'middle' | 'end'): 'start' | 'middle' | 'end' {
    if (anchor === 'middle') return 'middle';
    if (!isRtl()) return anchor;
    return anchor === 'start' ? 'end' : 'start';
}

/**
 * Calculates an X position adjusted for RTL.
 * @param x - The original X position.
 * @param containerWidth - The container width.
 * @returns The adjusted X position.
 */
export function getRtlX(x: number, containerWidth: number): number {
    if (!isRtl()) return x;
    return containerWidth - x;
}

/**
 * Gets the transform for mirroring in RTL mode.
 * @param width - The width to use for the mirror point.
 * @returns SVG transform string, or empty string if LTR.
 */
export function getRtlTransform(width: number): string {
    if (!isRtl()) return '';
    return `translate(${width}, 0) scale(-1, 1)`;
}

/**
 * Gets the counter-transform for text in RTL mode.
 * This keeps text readable when the parent is mirrored.
 * @param x - The X position of the text.
 * @param width - The width of the text container.
 * @returns SVG transform string, or empty string if LTR.
 */
export function getRtlTextTransform(x: number, width: number): string {
    if (!isRtl()) return '';
    return `translate(${x + width}, 0) scale(-1, 1)`;
}

/**
 * Gets the direction attribute value.
 * @returns 'rtl' or 'ltr'.
 */
export function getDirection(): 'rtl' | 'ltr' {
    return isRtl() ? 'rtl' : 'ltr';
}

/**
 * Calculates the navbar X position based on RTL mode.
 * @param windowWidth - The total window width.
 * @param navbarWidth - The navbar width.
 * @param borderPadding - The border padding.
 * @returns The X position for the navbar.
 */
export function getNavbarX(windowWidth: number, navbarWidth: number, borderPadding: number): number {
    if (!isRtl()) return borderPadding;
    return windowWidth - navbarWidth - borderPadding;
}

/**
 * Calculates the content area X position based on RTL mode.
 * @param navbarWidth - The navbar width.
 * @param borderPadding - The border padding.
 * @param _windowWidth - The total window width (unused, kept for API consistency).
 * @returns The X position for the content area.
 */
export function getContentAreaX(navbarWidth: number, borderPadding: number, _windowWidth: number): number {
    if (!isRtl()) return borderPadding + navbarWidth;
    return borderPadding;
}

/**
 * Calculates the resize handle X position based on RTL mode.
 * @param navbarWidth - The navbar width.
 * @param borderPadding - The border padding.
 * @param handleWidth - The resize handle width.
 * @param windowWidth - The total window width (needed for RTL).
 * @returns The X position for the resize handle.
 */
export function getResizeHandleX(
    navbarWidth: number,
    borderPadding: number,
    handleWidth: number,
    windowWidth: number,
): number {
    if (!isRtl()) {
        return borderPadding + navbarWidth - handleWidth / 2;
    }
    return windowWidth - navbarWidth - borderPadding - handleWidth / 2;
}

/**
 * Calculates the context menu X position based on RTL mode and viewport bounds.
 * @param clickX - The click X position.
 * @param menuWidth - The menu width.
 * @param viewportWidth - The viewport width.
 * @returns The X position for the context menu.
 */
export function getContextMenuX(clickX: number, menuWidth: number, viewportWidth: number): number {
    if (isRtl()) {
        // In RTL, prefer opening to the left of the click
        const leftX = clickX - menuWidth;
        if (leftX >= 0) return leftX;
        // If not enough space on left, open to the right
        return Math.min(clickX, viewportWidth - menuWidth);
    }

    // In LTR, prefer opening to the right of the click
    if (clickX + menuWidth <= viewportWidth) {
        return clickX;
    }
    // If not enough space on right, open to the left
    return Math.max(0, clickX - menuWidth);
}

/**
 * Calculates the tooltip X position based on RTL mode.
 * @param itemX - The item X position.
 * @param itemWidth - The item width.
 * @param tooltipWidth - The tooltip width.
 * @param viewportWidth - The viewport width.
 * @param gap - Gap between item and tooltip.
 * @returns The X position for the tooltip.
 */
export function getTooltipX(
    itemX: number,
    itemWidth: number,
    tooltipWidth: number,
    viewportWidth: number,
    gap = 8,
): number {
    if (isRtl()) {
        // In RTL, prefer showing tooltip to the left
        const leftX = itemX - tooltipWidth - gap;
        if (leftX >= 0) return leftX;
        // Fallback to right
        return itemX + itemWidth + gap;
    }

    // In LTR, prefer showing tooltip to the right
    const rightX = itemX + itemWidth + gap;
    if (rightX + tooltipWidth <= viewportWidth) {
        return rightX;
    }
    // Fallback to left
    return Math.max(0, itemX - tooltipWidth - gap);
}

/**
 * Gets the flex direction for RTL support.
 * @param direction - The original direction ('row' or 'row-reverse').
 * @returns The adjusted direction.
 */
export function getFlexDirection(direction: 'row' | 'row-reverse'): 'row' | 'row-reverse' {
    if (!isRtl()) return direction;
    return direction === 'row' ? 'row-reverse' : 'row';
}

/**
 * Mirrors an icon path for RTL if it's directional.
 * Note: Most icons don't need mirroring. Only use for directional icons like arrows.
 * @param pathData - The SVG path data.
 * @param _shouldMirror - Whether to mirror the icon (placeholder for future implementation).
 * @returns The potentially mirrored path data.
 */
export function mirrorIconPath(pathData: string, _shouldMirror = false): string {
    // For simplicity, directional icons should have pre-computed mirrored versions
    // This function is a placeholder for icons that need runtime mirroring
    return pathData;
}

/**
 * Checks if an icon should be mirrored in RTL mode.
 * @param iconName - The icon name.
 * @returns True if the icon should be mirrored.
 */
export function shouldMirrorIcon(iconName: string): boolean {
    // Icons that indicate direction should be mirrored
    const directionalIcons = ['chevronRight', 'chevronLeft', 'logout', 'arrowRight', 'arrowLeft'];
    return isRtl() && directionalIcons.includes(iconName);
}
