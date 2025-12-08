/**
 * English Translations (Default)
 */

export const en = {
    // Navigation items
    'nav.containers': 'Containers',
    'nav.images': 'Images',
    'nav.pods': 'Pods',
    'nav.volumes': 'Volumes',
    'nav.kubernetes': 'Kubernetes',
    'nav.extensions': 'Extensions',
    'nav.terminal': 'Terminal',
    'nav.account': 'Account',
    'nav.settings': 'Settings',

    // Extension items
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',

    // More button
    'nav.more': 'More',

    // Context menu - Item
    'menu.pinToTop': 'Pin to Top',
    'menu.unpin': 'Unpin',
    'menu.hideFromNavBar': 'Hide From Navigation Bar',
    'menu.keyboardShortcut': 'Keyboard Shortcut...',
    'menu.extensionSettings': 'Extension Settings',
    'menu.removeExtension': 'Remove Extension',
    'menu.configureNavBar': 'Configure Navigation Bar',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'Show Icons and Titles',
    'menu.showIconsOnly': 'Show Icons Only',
    'menu.showHiddenItems': 'Show Hidden Items',
    'menu.resetNavBar': 'Reset Navigation Bar',

    // Context menu - Settings
    'menu.settings': 'Settings',
    'menu.extensions': 'Extensions',
    'menu.keyboardShortcuts': 'Keyboard Shortcuts',
    'menu.aboutPodmanDesktop': 'About Podman Desktop',

    // Context menu - Account
    'menu.signOut': 'Sign Out',

    // Tooltips
    'tooltip.shortcut': 'Shortcut',

    // Info banner
    'banner.settingsWouldOpen': 'Settings would open',
    'banner.settingsDescription': 'In the real application, this would open the Podman Desktop Settings panel.',
    'banner.extensionSettingsWouldOpen': 'Extension Settings would open',
    'banner.extensionSettingsDescription': 'In the real application, this would open the settings for this extension.',
    'banner.removeExtensionWouldStart': 'Remove Extension flow would start',
    'banner.removeExtensionDescription': 'In the real application, this would start the extension uninstall flow.',
    'banner.navBarSettingsWouldOpen': 'Navigation Bar Settings would open',
    'banner.navBarSettingsDescription': 'In the real application, this would open the Navigation Bar configuration in Settings.',
    'banner.keyboardShortcutWouldOpen': 'Keyboard Shortcut dialog would open',
    'banner.keyboardShortcutDescription': 'In the real application, this would open a dialog to assign or change the keyboard shortcut.',
    'banner.signOutWouldStart': 'Sign Out flow would start',
    'banner.signOutDescription': 'In the real application, this would sign you out of your account.',
    'banner.aboutWouldOpen': 'About dialog would open',
    'banner.aboutDescription': 'In the real application, this would show the About Podman Desktop dialog.',
    'banner.extensionsWouldOpen': 'Extensions panel would open',
    'banner.extensionsDescription': 'In the real application, this would open the Extensions management panel.',
    'banner.shortcutsWouldOpen': 'Keyboard Shortcuts panel would open',
    'banner.shortcutsDescription': 'In the real application, this would open the Keyboard Shortcuts configuration panel.',
    'banner.clickToDismiss': 'Click anywhere to dismiss',

    // Modal dialog
    'modal.hideItem': 'Hide Item',
    'modal.hideItemDescription': 'This item will be hidden from the Navigation Bar. You can restore it in Podman Desktop Settings.',
    'modal.dontShowAgain': "Don't show this again",
    'modal.ok': 'OK',
    'modal.cancel': 'Cancel',

    // Content area controls
    'controls.itemManagement': 'Item Management',
    'controls.addItem': 'Add Item',
    'controls.removeLastItem': 'Remove Last Item',
    'controls.removeRandomItem': 'Remove Random Item',
    'controls.pinning': 'Pinning',
    'controls.pinRandomItem': 'Pin Random Item',
    'controls.unpinAllItems': 'Unpin All Items',
    'controls.visibility': 'Visibility',
    'controls.hideRandomItem': 'Hide Random Item',
    'controls.unhideAllItems': 'Unhide All Items',
    'controls.language': 'Language',

    // Locale names
    'locale.en': 'English',
    'locale.de': 'Deutsch',
    'locale.ja': '日本語',
    'locale.ar': 'العربية',

    // Accessibility
    'a11y.navigationBar': 'Navigation Bar',
    'a11y.mainNavigation': 'Main Navigation',
    'a11y.pinnedItems': 'Pinned Items',
    'a11y.moreOptions': 'More Options',
    'a11y.closeMenu': 'Close Menu',
} as const;

export type TranslationKey = keyof typeof en;
