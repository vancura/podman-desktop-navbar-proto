/**
 * Internationalization Module
 * Provides translation functions and locale management.
 *
 * Note: This module uses module-level state for the current locale.
 * The app state (app-state.svelte.ts) also tracks locale for reactivity.
 * Always use actions.setLocale() to change the locale - it updates both.
 */

import type { Locale } from '../state/types.js';
import { ar } from './locales/ar.js';
import { de } from './locales/de.js';
import { en, type TranslationKey } from './locales/en.js';
import { he } from './locales/he.js';
import { ja } from './locales/ja.js';

// ============================================================================
// Configuration
// ============================================================================

/** All available translations indexed by locale code. */
const TRANSLATIONS: Record<Locale, Partial<Record<TranslationKey, string>>> = {
    en,
    de,
    ja,
    ar,
    he,
};

/** Locales that use right-to-left text direction. */
const RTL_LOCALES: Locale[] = ['ar', 'he'];

/** Platform detection for keyboard shortcut formatting. */
const IS_MAC = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');

// ============================================================================
// State
// ============================================================================

/** Current locale (module-level, synchronized with app state). */
let currentLocale: Locale = 'en';

// ============================================================================
// Public API
// ============================================================================

/** Get the current locale code. */
export function getLocale(): Locale {
    return currentLocale;
}

/**
 * Set the current locale and update document attributes.
 * Note: Prefer using actions.setLocale() for reactivity.
 */
export function setLocale(locale: Locale): void {
    currentLocale = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
}

/** Check if current locale uses right-to-left text direction. */
export function isRtl(): boolean {
    return RTL_LOCALES.includes(currentLocale);
}

/**
 * Translate a key to the current locale.
 * Falls back to English if the translation is missing in the current locale.
 * @param key - Translation key from the English translations
 * @returns Translated string
 */
export function t(key: TranslationKey): string {
    return TRANSLATIONS[currentLocale][key] ?? en[key];
}

/**
 * Format a keyboard shortcut for display based on platform.
 * @param shortcut - Shortcut string (e.g., 'cmd+1', 'shift+cmd+p')
 * @returns Formatted shortcut (e.g., '⌘1' on Mac, 'Ctrl+1' on Windows)
 */
export function formatShortcut(shortcut: string): string {
    return shortcut
        .replace(/cmd\+/gi, IS_MAC ? '⌘' : 'Ctrl+')
        .replace(/alt\+/gi, IS_MAC ? '⌥' : 'Alt+')
        .replace(/shift\+/gi, IS_MAC ? '⇧' : 'Shift+')
        .replace(/ctrl\+/gi, IS_MAC ? '⌃' : 'Ctrl+')
        .toUpperCase();
}

/** Available locales with their native display names. */
export const AVAILABLE_LOCALES: ReadonlyArray<{ code: Locale; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic (RTL)' },
    { code: 'he', name: 'Hebrew (RTL)' },
];

// Re-export types for consumers
export type { TranslationKey };
