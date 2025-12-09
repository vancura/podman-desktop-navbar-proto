/**
 * Internationalization Manager
 * Handles translations and locale switching.
 */

import type { Locale } from '../state/navigation-items.js';
import { ar } from './locales/ar.js';
import { de } from './locales/de.js';
import { en, type TranslationKey } from './locales/en.js';
import { he } from './locales/he.js';
import { ja } from './locales/ja.js';

/** All available translations. */
const translations: Record<Locale, Record<string, string>> = {
    en,
    de,
    ja,
    ar,
    he,
};

/** Current locale. */
let currentLocale: Locale = 'en';

/** Locale change listeners. */
const listeners: Set<(locale: Locale) => void> = new Set();

/**
 * Sets the current locale.
 * @param locale - The locale to set.
 */
export function setLocale(locale: Locale): void {
    if (currentLocale === locale) return;

    currentLocale = locale;

    // Notify listeners
    for (const listener of listeners) {
        listener(locale);
    }
}

/**
 * Gets the current locale.
 * @returns The current locale.
 */
export function getLocale(): Locale {
    return currentLocale;
}

/**
 * Checks if the current locale is RTL.
 * @returns True if the current locale is RTL.
 */
export function isRtl(): boolean {
    return currentLocale === 'ar' || currentLocale === 'he';
}

/**
 * Translates a key to the current locale.
 * @param key - The translation key.
 * @param fallback - Optional fallback value.
 * @returns The translated string.
 */
export function t(key: TranslationKey | string, fallback?: string): string {
    const translation = translations[currentLocale][key];

    if (translation !== undefined) {
        return translation;
    }

    // Fall back to English
    const englishTranslation = translations.en[key];
    if (englishTranslation !== undefined) {
        return englishTranslation;
    }

    // Use provided fallback or key itself
    return fallback ?? key;
}

/**
 * Translates a key with interpolation.
 * @param key - The translation key.
 * @param params - Parameters to interpolate.
 * @returns The translated string with interpolated values.
 */
export function tInterpolate(key: TranslationKey | string, params: Record<string, string | number>): string {
    let result = t(key);

    for (const [param, value] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
    }

    return result;
}

/**
 * Subscribes to locale changes.
 * @param listener - Callback function for locale changes.
 * @returns Unsubscribe function.
 */
export function subscribeToLocale(listener: (locale: Locale) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * Gets all available locales.
 * @returns Array of available locale codes.
 */
export function getAvailableLocales(): Locale[] {
    return ['en', 'de', 'ja', 'ar', 'he'];
}

/**
 * Gets the display name for a locale.
 * @param locale - The locale code.
 * @returns The display name.
 */
export function getLocaleDisplayName(locale: Locale): string {
    return t(`locale.${locale}` as TranslationKey);
}

/**
 * Formats a keyboard shortcut for display.
 * @param shortcut - The shortcut string (e.g., 'cmd+1').
 * @returns The formatted shortcut (e.g., '⌘1').
 */
export function formatShortcut(shortcut: string): string {
    return shortcut
        .replace(/cmd\+/gi, '⌘')
        .replace(/ctrl\+/gi, '⌃')
        .replace(/alt\+/gi, '⌥')
        .replace(/shift\+/gi, '⇧')
        .replace(/\+/g, '')
        .toUpperCase();
}

/**
 * Gets the text direction for the current locale.
 * @returns 'rtl' or 'ltr'.
 */
export function getTextDirection(): 'rtl' | 'ltr' {
    return isRtl() ? 'rtl' : 'ltr';
}

export type { TranslationKey };
