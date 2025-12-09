/**
 * Hebrew Translations (RTL)
 */

import type { TranslationKey } from './en.js';

export const he: Partial<Record<TranslationKey, string>> = {
    // Navigation items
    'nav.containers': 'מכולות',
    'nav.images': 'תמונות',
    'nav.pods': 'פודים',
    'nav.volumes': 'כרכים',
    'nav.kubernetes': 'Kubernetes',
    'nav.extensions': 'תוספות',
    'nav.terminal': 'מסוף',
    'nav.account': 'חשבון',
    'nav.settings': 'הגדרות',
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',
    'nav.more': 'עוד',

    // Context menu - Item actions
    'menu.pinToTop': 'הצמד לראש',
    'menu.unpin': 'הסר הצמדה',
    'menu.hideFromNavBar': 'הסתר משורת הניווט',
    'menu.keyboardShortcut': 'קיצור מקלדת...',
    'menu.extensionSettings': 'הגדרות תוספת',
    'menu.removeExtension': 'הסר תוספת',
    'menu.configureNavbar': 'הגדר שורת ניווט',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'הצג סמלים וכותרות',
    'menu.showIconsOnly': 'הצג סמלים בלבד',
    'menu.showHiddenItems': 'הצג פריטים מוסתרים',
    'menu.noHiddenItems': '(אין פריטים מוסתרים)',
    'menu.resetNavbar': 'איפוס שורת ניווט',

    // Context menu - Settings/Account
    'menu.settings': 'הגדרות',
    'menu.extensions': 'תוספות',
    'menu.keyboardShortcuts': 'קיצורי מקלדת',
    'menu.aboutPodmanDesktop': 'אודות Podman Desktop',
    'menu.signOut': 'התנתק',

    // Modal dialog
    'modal.hideItem': 'הסתר פריט',
    'modal.hideItemDescription': 'פריט זה יוסתר. תוכל לשחזר אותו מההגדרות.',
    'modal.dontShowAgain': 'אל תציג שוב',
    'modal.ok': 'אישור',
    'modal.cancel': 'ביטול',

    // Controls
    'controls.itemManagement': 'ניהול פריטים',
    'controls.addItem': 'הוסף פריט',
    'controls.removeLast': 'הסר אחרון',
    'controls.removeRandom': 'הסר אקראי',
    'controls.pinning': 'הצמדה',
    'controls.pinRandom': 'הצמד אקראי',
    'controls.unpinAll': 'הסר הכל',
    'controls.visibility': 'נראות',
    'controls.hideRandom': 'הסתר אקראי',
    'controls.unhideAll': 'הצג הכל',
    'controls.language': 'שפה',

    // Locale names
    'locale.en': 'English',
    'locale.de': 'Deutsch',
    'locale.ja': '日本語',
    'locale.ar': 'العربية',
    'locale.he': 'עברית',

    // Accessibility
    'a11y.navigationBar': 'שורת ניווט',
    'a11y.mainNavigation': 'ניווט ראשי',
    'a11y.pinnedItems': 'פריטים מוצמדים',
    'a11y.moreOptions': 'אפשרויות נוספות',
    'a11y.closeMenu': 'סגור תפריט',
};
