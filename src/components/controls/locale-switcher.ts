/**
 * Locale Switcher Component
 * Toggle buttons for switching between languages.
 */

import { t } from '../../i18n/i18n.js';
import type { Locale } from '../../state/navigation-items.js';
import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Locale switcher configuration. */
export interface LocaleSwitcherConfig {
    x: number;
    y: number;
    currentLocale: Locale;
}

const LOCALES: Locale[] = ['en', 'de', 'ja', 'ar'];

const SWITCHER_CONFIG = {
    buttonWidth: 40,
    buttonHeight: 28,
    buttonGap: 4,
    borderRadius: 6,
} as const;

/**
 * Creates a locale switcher component.
 * @param config - The switcher configuration.
 * @param onLocaleChange - Callback when locale changes.
 * @returns The switcher group element.
 */
export function createLocaleSwitcher(
    config: LocaleSwitcherConfig,
    onLocaleChange: (locale: Locale) => void,
): SVGGElement {
    const { x, y, currentLocale } = config;

    const group = createSvgElement('g', {
        'data-name': 'locale-switcher',
        transform: `translate(${x}, ${y})`,
    });

    // Label
    const label = createSvgElement('text', {
        x: '0',
        y: '0',
        fill: COLORS.textSecondary,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': '11',
        'font-weight': '600',
        'text-transform': 'uppercase',
    });
    label.textContent = t('controls.language');
    group.appendChild(label);

    // Buttons container
    const buttonsGroup = createSvgElement('g', {
        'data-name': 'locale-buttons',
        transform: 'translate(0, 16)',
    });
    group.appendChild(buttonsGroup);

    // Create locale buttons
    let currentX = 0;
    for (const locale of LOCALES) {
        const isActive = locale === currentLocale;
        const button = createLocaleButton(locale, currentX, 0, isActive, () => {
            onLocaleChange(locale);
        });
        buttonsGroup.appendChild(button);
        currentX += SWITCHER_CONFIG.buttonWidth + SWITCHER_CONFIG.buttonGap;
    }

    return group;
}

/**
 * Creates a single locale button.
 */
function createLocaleButton(
    locale: Locale,
    x: number,
    y: number,
    isActive: boolean,
    onClick: () => void,
): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': `locale-button-${locale}`,
        'data-locale': locale,
        transform: `translate(${x}, ${y})`,
        cursor: 'pointer',
    });

    // Background
    const background = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(SWITCHER_CONFIG.buttonWidth),
        height: String(SWITCHER_CONFIG.buttonHeight),
        fill: isActive ? COLORS.focusRing : COLORS.buttonBackground,
        rx: String(SWITCHER_CONFIG.borderRadius),
        ry: String(SWITCHER_CONFIG.borderRadius),
        'data-name': 'button-background',
    });
    group.appendChild(background);

    // Label
    const label = createSvgElement('text', {
        x: String(SWITCHER_CONFIG.buttonWidth / 2),
        y: String(SWITCHER_CONFIG.buttonHeight / 2 + TYPOGRAPHY.buttonFontSize * 0.35),
        fill: isActive ? '#ffffff' : COLORS.buttonText,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.buttonFontSize),
        'font-weight': isActive ? '600' : TYPOGRAPHY.buttonFontWeight,
        'text-anchor': 'middle',
        'pointer-events': 'none',
    });
    label.textContent = locale.toUpperCase();
    group.appendChild(label);

    // Hover effect (only if not active)
    if (!isActive) {
        group.addEventListener('mouseenter', () => {
            background.setAttribute('fill', COLORS.buttonBackgroundHover);
        });

        group.addEventListener('mouseleave', () => {
            background.setAttribute('fill', COLORS.buttonBackground);
        });
    }

    // Click handler
    group.addEventListener('click', onClick);

    return group;
}

/**
 * Updates the locale switcher.
 * @param group - The switcher group element.
 * @param currentLocale - The current locale.
 */
export function updateLocaleSwitcher(group: SVGGElement, currentLocale: Locale): void {
    const buttons = group.querySelectorAll('[data-locale]');

    buttons.forEach((button) => {
        const locale = button.getAttribute('data-locale');
        const isActive = locale === currentLocale;

        const background = button.querySelector('[data-name="button-background"]');
        const label = button.querySelector('text');

        if (background) {
            background.setAttribute('fill', isActive ? COLORS.focusRing : COLORS.buttonBackground);
        }

        if (label) {
            label.setAttribute('fill', isActive ? '#ffffff' : COLORS.buttonText);
            label.setAttribute('font-weight', isActive ? '600' : TYPOGRAPHY.buttonFontWeight);
        }
    });
}
