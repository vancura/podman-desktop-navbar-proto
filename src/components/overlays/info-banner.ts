/**
 * Info Banner Component
 * Full-screen overlay with centered message, dismissed by clicking anywhere.
 */

import { t } from '../../i18n/i18n.js';
import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { disableKeyboardHandling, enableKeyboardHandling } from '../../utils/keyboard-utils.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Banner configuration. */
export interface InfoBannerConfig {
    titleKey: string;
    descriptionKey: string;
    width: number;
    height: number;
}

const BANNER_CONFIG = {
    maxWidth: 400,
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 12,
    titleMarginBottom: 12,
    descriptionLineHeight: 1.5,
    dismissMarginTop: 20,
} as const;

/**
 * Creates an info banner overlay.
 * @param config - The banner configuration.
 * @param onDismiss - Callback when the banner is dismissed.
 * @returns The banner group element.
 */
export function createInfoBanner(config: InfoBannerConfig, onDismiss: () => void): SVGGElement {
    const { titleKey, descriptionKey, width, height } = config;

    const title = t(titleKey);
    const description = t(descriptionKey);
    const dismissText = t('banner.clickToDismiss');

    // Create main group
    const group = createSvgElement('g', {
        'data-name': 'info-banner',
    });

    // Fullscreen overlay background
    const overlay = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        fill: COLORS.overlayBackground,
        cursor: 'pointer',
        'data-name': 'banner-overlay',
    });
    group.appendChild(overlay);

    // Calculate banner dimensions
    const bannerWidth = Math.min(BANNER_CONFIG.maxWidth, width - 80);
    const bannerX = (width - bannerWidth) / 2;

    // Calculate text layout first to determine banner height
    const maxCharsPerLine = Math.floor((bannerWidth - BANNER_CONFIG.paddingHorizontal * 2) / 7);
    const lines = wrapText(description, maxCharsPerLine);

    // Calculate positions
    const titleY = BANNER_CONFIG.paddingVertical + TYPOGRAPHY.bannerTitleFontSize;
    const descY = titleY + BANNER_CONFIG.titleMarginBottom + TYPOGRAPHY.bannerTextFontSize;
    const dismissY =
        descY +
        lines.length * TYPOGRAPHY.bannerTextFontSize * BANNER_CONFIG.descriptionLineHeight +
        BANNER_CONFIG.dismissMarginTop;

    // Calculate actual banner height
    const actualHeight = dismissY + BANNER_CONFIG.paddingVertical;
    const bannerY = (height - actualHeight) / 2;

    // Banner background
    const bannerBg = createSvgElement('rect', {
        x: String(bannerX),
        y: String(bannerY),
        width: String(bannerWidth),
        height: String(actualHeight),
        fill: COLORS.bannerBackground,
        stroke: COLORS.bannerBorder,
        'stroke-width': '1',
        rx: String(BANNER_CONFIG.borderRadius),
        ry: String(BANNER_CONFIG.borderRadius),
        'data-name': 'banner-background',
        'pointer-events': 'none',
    });
    group.appendChild(bannerBg);

    // Title
    const titleText = createSvgElement('text', {
        x: String(bannerX + BANNER_CONFIG.paddingHorizontal),
        y: String(bannerY + titleY),
        fill: COLORS.bannerText,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.bannerTitleFontSize),
        'font-weight': TYPOGRAPHY.bannerTitleFontWeight,
        'pointer-events': 'none',
    });
    titleText.textContent = title;
    group.appendChild(titleText);

    // Description (wrapped text)
    lines.forEach((line, index) => {
        const lineText = createSvgElement('text', {
            x: String(bannerX + BANNER_CONFIG.paddingHorizontal),
            y: String(bannerY + descY + index * TYPOGRAPHY.bannerTextFontSize * BANNER_CONFIG.descriptionLineHeight),
            fill: COLORS.bannerTextSecondary,
            'font-family': TYPOGRAPHY.tooltipFontFamily,
            'font-size': String(TYPOGRAPHY.bannerTextFontSize),
            'font-weight': TYPOGRAPHY.bannerTextFontWeight,
            'pointer-events': 'none',
        });
        lineText.textContent = line;
        group.appendChild(lineText);
    });

    // Dismiss text
    const dismissTextEl = createSvgElement('text', {
        x: String(bannerX + bannerWidth / 2),
        y: String(bannerY + dismissY),
        fill: COLORS.bannerTextSecondary,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.shortcutFontSize),
        'font-weight': TYPOGRAPHY.shortcutFontWeight,
        'text-anchor': 'middle',
        'font-style': 'italic',
        'pointer-events': 'none',
    });
    dismissTextEl.textContent = dismissText;
    group.appendChild(dismissTextEl);

    // Click handler
    const handleClick = (): void => {
        group.removeEventListener('click', handleClick);
        onDismiss();
    };

    group.addEventListener('click', handleClick);

    return group;
}

/**
 * Wraps text into lines.
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
            currentLine = (currentLine + ' ' + word).trim();
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) lines.push(currentLine);

    return lines;
}

/**
 * Info Banner Manager
 */
export class InfoBannerManager {
    private container: SVGGElement;
    private currentBanner: SVGGElement | null = null;
    private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;

    constructor(container: SVGGElement) {
        this.container = container;
    }

    /**
     * Shows an info banner.
     */
    show(config: InfoBannerConfig): void {
        this.hide();

        // Disable keyboard navigation while banner is shown
        disableKeyboardHandling();

        this.currentBanner = createInfoBanner(config, () => {
            this.hide();
        });

        this.container.appendChild(this.currentBanner);

        // Add keyboard handler for Escape key only
        this.boundHandleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.hide();
            }
        };
        document.addEventListener('keydown', this.boundHandleKeyDown);
    }

    /**
     * Hides the current banner.
     */
    hide(): void {
        // Remove keyboard handler
        if (this.boundHandleKeyDown) {
            document.removeEventListener('keydown', this.boundHandleKeyDown);
            this.boundHandleKeyDown = null;
        }

        if (this.currentBanner) {
            this.currentBanner.remove();
            this.currentBanner = null;

            // Re-enable keyboard navigation after banner is dismissed
            enableKeyboardHandling();
        }
    }

    /**
     * Destroys the manager.
     */
    destroy(): void {
        this.hide();
    }
}
