/**
 * Arabic Translations (RTL)
 */

import type { TranslationKey } from './en.js';

export const ar: Partial<Record<TranslationKey, string>> = {
    // Navigation items
    'nav.containers': 'الحاويات',
    'nav.images': 'الصور',
    'nav.pods': 'البودات',
    'nav.volumes': 'وحدات التخزين',
    'nav.kubernetes': 'كوبرنيتيس',
    'nav.extensions': 'الإضافات',
    'nav.terminal': 'الطرفية',
    'nav.account': 'الحساب',
    'nav.settings': 'الإعدادات',
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',
    'nav.more': 'المزيد',
    'nav.moreCount': '{count} المزيد',

    // Context menu - Item actions
    'menu.pinToTop': 'تثبيت في الأعلى',
    'menu.unpin': 'إلغاء التثبيت',
    'menu.hideFromNavBar': 'إخفاء من شريط التنقل',
    'menu.keyboardShortcut': 'اختصار لوحة المفاتيح...',
    'menu.extensionSettings': 'إعدادات الإضافة',
    'menu.removeExtension': 'إزالة الإضافة',
    'menu.configureNavbar': 'تكوين شريط التنقل',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'إظهار الأيقونات والعناوين',
    'menu.showIconsOnly': 'إظهار الأيقونات فقط',
    'menu.showHiddenItems': 'إظهار العناصر المخفية',
    'menu.noHiddenItems': '(لا توجد عناصر مخفية)',
    'menu.resetNavbar': 'إعادة تعيين شريط التنقل',
    'menu.hiddenItems': 'العناصر المخفية',
    'menu.show': 'إظهار',

    // Context menu - Settings/Account
    'menu.settings': 'الإعدادات',
    'menu.extensions': 'الإضافات',
    'menu.keyboardShortcuts': 'اختصارات لوحة المفاتيح',
    'menu.aboutPodmanDesktop': 'حول Podman Desktop',
    'menu.signOut': 'تسجيل الخروج',

    // Accessibility
    'a11y.navigationBar': 'شريط التنقل',
    'a11y.mainNavigation': 'التنقل الرئيسي',
    'a11y.pinnedItems': 'العناصر المثبتة',
    'a11y.moreOptions': 'خيارات إضافية',
    'a11y.closeMenu': 'إغلاق القائمة',
};
