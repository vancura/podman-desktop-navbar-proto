/**
 * Info Banner Component
 * Full-screen overlay with centered message, dismissed by clicking anywhere.
 */

import { t } from '../../i18n/i18n.js';
import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
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

    // We'll calculate height after measuring text, but estimate for now
    const estimatedHeight = 150;
    const bannerY = (height - estimatedHeight) / 2;

    // Banner background
    const bannerBg = createSvgElement('rect', {
        x: String(bannerX),
        y: String(bannerY),
        width: String(bannerWidth),
        height: String(estimatedHeight),
        fill: COLORS.bannerBackground,
        stroke: COLORS.bannerBorder,
        'stroke-width': '1',
        rx: String(BANNER_CONFIG.borderRadius),
        ry: String(BANNER_CONFIG.borderRadius),
        'data-name': 'banner-background',
    });
    group.appendChild(bannerBg);

    // Title
    const titleY = bannerY + BANNER_CONFIG.paddingVertical + TYPOGRAPHY.bannerTitleFontSize;
    const titleText = createSvgElement('text', {
        x: String(bannerX + BANNER_CONFIG.paddingHorizontal),
        y: String(titleY),
        fill: COLORS.bannerText,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.bannerTitleFontSize),
        'font-weight': TYPOGRAPHY.bannerTitleFontWeight,
        'pointer-events': 'none',
    });
    titleText.textContent = title;
    group.appendChild(titleText);

    // Description (wrapped text)
    const descY = titleY + BANNER_CONFIG.titleMarginBottom + TYPOGRAPHY.bannerTextFontSize;
    const maxCharsPerLine = Math.floor((bannerWidth - BANNER_CONFIG.paddingHorizontal * 2) / 7);
    const lines = wrapText(description, maxCharsPerLine);

    lines.forEach((line, index) => {
        const lineText = createSvgElement('text', {
            x: String(bannerX + BANNER_CONFIG.paddingHorizontal),
            y: String(descY + index * TYPOGRAPHY.bannerTextFontSize * BANNER_CONFIG.descriptionLineHeight),
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
    const dismissY =
        descY +
        lines.length * TYPOGRAPHY.bannerTextFontSize * BANNER_CONFIG.descriptionLineHeight +
        BANNER_CONFIG.dismissMarginTop;

    const dismissTextEl = createSvgElement('text', {
        x: String(bannerX + bannerWidth / 2),
        y: String(dismissY),
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

    // Update banner height
    const actualHeight = dismissY - bannerY + BANNER_CONFIG.paddingVertical;
    bannerBg.setAttribute('height', String(actualHeight));
    bannerBg.setAttribute('y', String((height - actualHeight) / 2));

    // Reposition all content based on new Y
    const newBannerY = (height - actualHeight) / 2;
    const yOffset = newBannerY - bannerY;

    titleText.setAttribute('y', String(titleY + yOffset));
    group.querySelectorAll('text').forEach((text) => {
        const currentY = parseFloat(text.getAttribute('y') ?? '0');
        if (currentY !== titleY + yOffset) {
            text.setAttribute('y', String(currentY + yOffset));
        }
    });

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

    constructor(container: SVGGElement) {
        this.container = container;
    }

    /**
     * Shows an info banner.
     */
    show(config: InfoBannerConfig): void {
        this.hide();

        this.currentBanner = createInfoBanner(config, () => {
            this.hide();
        });

        this.container.appendChild(this.currentBanner);
    }

    /**
     * Hides the current banner.
     */
    hide(): void {
        if (this.currentBanner) {
            this.currentBanner.remove();
            this.currentBanner = null;
        }
    }

    /**
     * Destroys the manager.
     */
    destroy(): void {
        this.hide();
    }
}
