/**
 * Internationalization Module
 * Simple i18n implementation without runes (module-level state).
 */

import type { Locale } from '../state/types.js';
import { ar } from './locales/ar.js';
import { de } from './locales/de.js';
import { en, type TranslationKey } from './locales/en.js';
import { he } from './locales/he.js';
import { ja } from './locales/ja.js';

/** All available translations indexed by locale. */
const translations: Record<Locale, Record<TranslationKey, string>> = {
    en,
    de,
    ja,
    ar,
    he,
};

/** RTL locales. */
const RTL_LOCALES: Locale[] = ['ar', 'he'];

/** Current locale - simple module-level variable. */
let currentLocale: Locale = 'en';

/**
 * Get the current locale.
 */
export function getLocale(): Locale {
    return currentLocale;
}

/**
 * Set the current locale.
 */
export function setLocale(locale: Locale): void {
    currentLocale = locale;

    // Update document direction for RTL support
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
}

/**
 * Check if current locale is RTL.
 */
export function isRtl(): boolean {
    return RTL_LOCALES.includes(currentLocale);
}

/**
 * Translate a key to the current locale.
 * @param key - Translation key
 * @returns Translated string
 */
export function t(key: TranslationKey): string {
    return translations[currentLocale][key];
}

/**
 * Format a keyboard shortcut for display.
 * Converts 'cmd+1' to '⌘1' on Mac or 'Ctrl+1' on other platforms.
 */
export function formatShortcut(shortcut: string): string {
    const isMac = navigator.platform.includes('Mac');
    const modifier = isMac ? '⌘' : 'Ctrl+';

    return shortcut
        .replace(/cmd\+/gi, modifier)
        .replace(/alt\+/gi, isMac ? '⌥' : 'Alt+')
        .replace(/shift\+/gi, isMac ? '⇧' : 'Shift+')
        .replace(/ctrl\+/gi, isMac ? '⌃' : 'Ctrl+')
        .toUpperCase();
}

/** Available locales with display names. */
export const AVAILABLE_LOCALES: { code: Locale; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ar', name: 'العربية' },
    { code: 'he', name: 'עברית' },
];

// Re-export types
export type { TranslationKey };
