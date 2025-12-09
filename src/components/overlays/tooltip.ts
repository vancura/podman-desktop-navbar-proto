/**
 * Tooltip Component
 * Displays item name and keyboard shortcut on hover.
 * Only shown in icon-only mode to prevent duplication.
 */

import { formatShortcut, t } from '../../i18n/i18n.js';
import type { NavItem } from '../../state/navigation-items.js';
import { ANIMATIONS, COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { isRtl } from '../../i18n/i18n.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Tooltip configuration. */
export interface TooltipConfig {
    item: NavItem;
    anchorX: number;
    anchorY: number;
    anchorWidth: number;
    anchorHeight: number;
    navbarWidth: number;
}

/** Tooltip position. */
interface TooltipPosition {
    x: number;
    y: number;
}

const TOOLTIP_CONFIG = {
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
    borderRadius: 6,
    shortcutGap: 8,
    maxWidth: 200,
    arrowSize: 6,
} as const;

/**
 * Measures text width using a temporary SVG text element.
 */
function measureTextWidth(text: string, fontSize: number, fontFamily: string): number {
    // Create temporary SVG for measurement
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.visibility = 'hidden';
    svg.style.pointerEvents = 'none';
    document.body.appendChild(svg);

    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('font-size', String(fontSize));
    textElement.setAttribute('font-family', fontFamily);
    textElement.textContent = text;
    svg.appendChild(textElement);

    const bbox = textElement.getBBox();
    document.body.removeChild(svg);

    return bbox.width;
}

/**
 * Calculates tooltip position.
 */
function calculateTooltipPosition(config: TooltipConfig, tooltipWidth: number, tooltipHeight: number): TooltipPosition {
    const { anchorX, anchorY, anchorHeight, navbarWidth } = config;
    const gap = TOOLTIP_CONFIG.gap;

    // In RTL, show tooltip to the left of the item
    // In LTR, show to the right
    const rtl = isRtl();

    let x: number;
    if (rtl) {
        // Position to the left of the navbar
        x = anchorX - tooltipWidth - gap;
    } else {
        // Position to the right of the navbar
        x = navbarWidth + gap;
    }

    // Center vertically with the item
    const y = anchorY + (anchorHeight - tooltipHeight) / 2;

    return { x, y };
}

/**
 * Creates a tooltip element.
 * @param config - The tooltip configuration.
 * @returns The tooltip group element.
 */
export function createTooltip(config: TooltipConfig): SVGGElement {
    const { item } = config;
    const translatedLabel = t(item.labelKey);
    const shortcut = item.shortcut ? formatShortcut(item.shortcut) : null;

    // Measure text widths
    const labelWidth = measureTextWidth(translatedLabel, TYPOGRAPHY.tooltipFontSize, TYPOGRAPHY.tooltipFontFamily);
    const shortcutWidth = shortcut
        ? measureTextWidth(shortcut, TYPOGRAPHY.shortcutFontSize, TYPOGRAPHY.shortcutFontFamily)
        : 0;

    // Calculate total content width
    let contentWidth = labelWidth;
    if (shortcutWidth > 0) {
        contentWidth += TOOLTIP_CONFIG.shortcutGap + shortcutWidth;
    }

    // Calculate tooltip dimensions
    const tooltipWidth = Math.min(contentWidth + TOOLTIP_CONFIG.paddingHorizontal * 2, TOOLTIP_CONFIG.maxWidth);
    const tooltipHeight = TYPOGRAPHY.tooltipFontSize + TOOLTIP_CONFIG.paddingVertical * 2;

    // Calculate position
    const position = calculateTooltipPosition(config, tooltipWidth, tooltipHeight);

    // Create tooltip group
    const group = createSvgElement('g', {
        'data-name': 'tooltip',
        transform: `translate(${position.x}, ${position.y})`,
        opacity: '0',
    });

    // Background
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(tooltipWidth),
        height: String(tooltipHeight),
        fill: COLORS.tooltipBackground,
        stroke: COLORS.tooltipBorder,
        'stroke-width': '1',
        rx: String(TOOLTIP_CONFIG.borderRadius),
        ry: String(TOOLTIP_CONFIG.borderRadius),
    });
    group.appendChild(background);

    // Label text
    const textY = TOOLTIP_CONFIG.paddingVertical + TYPOGRAPHY.tooltipFontSize * 0.85;
    const labelText = createSvgElement('text', {
        x: String(TOOLTIP_CONFIG.paddingHorizontal),
        y: String(textY),
        fill: COLORS.tooltipText,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.tooltipFontSize),
        'font-weight': TYPOGRAPHY.tooltipFontWeight,
    });
    labelText.textContent = translatedLabel;
    group.appendChild(labelText);

    // Shortcut text (if present)
    if (shortcut) {
        const shortcutX = tooltipWidth - TOOLTIP_CONFIG.paddingHorizontal - shortcutWidth;
        const shortcutText = createSvgElement('text', {
            x: String(shortcutX),
            y: String(textY),
            fill: COLORS.tooltipShortcut,
            'font-family': TYPOGRAPHY.shortcutFontFamily,
            'font-size': String(TYPOGRAPHY.shortcutFontSize),
            'font-weight': TYPOGRAPHY.shortcutFontWeight,
        });
        shortcutText.textContent = shortcut;
        group.appendChild(shortcutText);
    }

    return group;
}

/**
 * Shows a tooltip with animation.
 * @param group - The tooltip group element.
 */
export function showTooltip(group: SVGGElement): void {
    group.setAttribute('opacity', '1');
}

/**
 * Hides a tooltip with animation.
 * @param group - The tooltip group element.
 */
export function hideTooltip(group: SVGGElement): void {
    group.setAttribute('opacity', '0');
}

/**
 * Updates tooltip position.
 * @param group - The tooltip group element.
 * @param config - The new configuration.
 */
export function updateTooltipPosition(group: SVGGElement, config: TooltipConfig): void {
    const background = group.querySelector('rect');
    if (!background) return;

    const tooltipWidth = parseFloat(background.getAttribute('width') ?? '0');
    const tooltipHeight = parseFloat(background.getAttribute('height') ?? '0');
    const position = calculateTooltipPosition(config, tooltipWidth, tooltipHeight);

    group.setAttribute('transform', `translate(${position.x}, ${position.y})`);
}

/**
 * Tooltip manager for handling show/hide with delays.
 */
export class TooltipManager {
    private tooltipGroup: SVGGElement | null = null;
    private container: SVGGElement;
    private showTimeout: number | null = null;
    private hideTimeout: number | null = null;
    private currentItemId: string | null = null;

    constructor(container: SVGGElement) {
        this.container = container;
    }

    /**
     * Schedules showing a tooltip for an item.
     * @param config - The tooltip configuration.
     */
    scheduleShow(config: TooltipConfig): void {
        // If already showing this item, do nothing
        if (this.currentItemId === config.item.id && this.tooltipGroup) {
            this.cancelHide();
            return;
        }

        // Clear any pending hide
        this.cancelHide();

        // If showing a different item, hide current first
        if (this.tooltipGroup && this.currentItemId !== config.item.id) {
            this.hideImmediate();
        }

        // Schedule show
        this.cancelShow();
        this.showTimeout = window.setTimeout(() => {
            this.show(config);
        }, ANIMATIONS.tooltip.showDelay);
    }

    /**
     * Schedules hiding the current tooltip.
     */
    scheduleHide(): void {
        this.cancelShow();

        if (!this.tooltipGroup) return;

        this.hideTimeout = window.setTimeout(() => {
            this.hideImmediate();
        }, ANIMATIONS.tooltip.hideDelay);
    }

    /**
     * Shows a tooltip immediately.
     */
    private show(config: TooltipConfig): void {
        this.hideImmediate();

        this.tooltipGroup = createTooltip(config);
        this.container.appendChild(this.tooltipGroup);
        this.currentItemId = config.item.id;

        // Animate in
        requestAnimationFrame(() => {
            if (this.tooltipGroup) {
                showTooltip(this.tooltipGroup);
            }
        });
    }

    /**
     * Hides the tooltip immediately.
     */
    private hideImmediate(): void {
        if (this.tooltipGroup) {
            this.tooltipGroup.remove();
            this.tooltipGroup = null;
        }
        this.currentItemId = null;
    }

    /**
     * Cancels a pending show.
     */
    private cancelShow(): void {
        if (this.showTimeout !== null) {
            window.clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }

    /**
     * Cancels a pending hide.
     */
    private cancelHide(): void {
        if (this.hideTimeout !== null) {
            window.clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    /**
     * Cancels any pending operations and hides tooltip.
     */
    cancel(): void {
        this.cancelShow();
        this.cancelHide();
        this.hideImmediate();
    }

    /**
     * Destroys the tooltip manager.
     */
    destroy(): void {
        this.cancel();
    }
}
