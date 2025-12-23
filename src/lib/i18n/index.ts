/**
 * Internationalization Module
 * Provides translation functions and locale management.
 *
 * Note: This module uses module-level state for the current locale.
 * The app state (app-state.svelte.ts) also tracks locale for reactivity.
 * Always use actions.setLocale() to change the locale - it updates both.
 */

import type { Locale } from '../state/types.js';
import { formatKeyboardShortcut } from '../utils/keyboard.js';
import { ar } from './locales/ar.js';
import { de } from './locales/de.js';
import { en, type TranslationKey } from './locales/en.js';
import { he } from './locales/he.js';
import { zh } from './locales/zh.js';

// ============================================================================
// Configuration
// ============================================================================

/** All available translations indexed by locale code. */
const TRANSLATIONS: Record<Locale, Partial<Record<TranslationKey, string>>> = {
    en,
    de,
    zh,
    ar,
    he,
};

/** Locales that use right-to-left text direction. */
const RTL_LOCALES: Locale[] = ['ar', 'he'];

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
 * @param locale
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
 * Uses the centralized keyboard utility for consistent formatting.
 * @param shortcut - Shortcut string (e.g., 'cmd+1', 'shift+cmd+p')
 * @returns Formatted shortcut (e.g., '⌘1' on Mac, 'Ctrl+1' on Windows)
 * @deprecated Consider using formatKeyboardShortcut from keyboard.ts directly
 */
export function formatShortcut(shortcut: string): string {
    // Note: This function is kept for backward compatibility
    // but uses the centralized keyboard utility internally.
    // For new code, import and use formatKeyboardShortcut directly.

    // Parse the shortcut string into modifier keys and main key
    const lowerShortcut = shortcut.toLowerCase();
    const hasCmd = lowerShortcut.includes('cmd');
    const hasShift = lowerShortcut.includes('shift');
    const hasAlt = lowerShortcut.includes('alt');

    // Extract the main key (last part after all modifiers)
    const key = shortcut.split('+').pop() || '';

    return formatKeyboardShortcut({
        cmd: hasCmd,
        shift: hasShift,
        alt: hasAlt,
        key: key,
    });
}

/** Available locales with their native display names. */
export const AVAILABLE_LOCALES: ReadonlyArray<{ code: Locale; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic (RTL)' },
    { code: 'he', name: 'Hebrew (RTL)' },
];

// Re-export types for consumers
export type { TranslationKey };
