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
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',
    'nav.more': 'More',
    'nav.moreCount': '{count} more',

    // Context menu - Item actions
    'menu.pinToTop': 'Pin to Top',
    'menu.unpin': 'Unpin',
    'menu.hideFromNavBar': 'Hide From Navigation Bar',
    'menu.keyboardShortcut': 'Keyboard Shortcut...',
    'menu.extensionSettings': 'Extension Settings',
    'menu.removeExtension': 'Remove Extension',
    'menu.configureNavbar': 'Configure Navigation Bar',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'Show Icons and Titles',
    'menu.showIconsOnly': 'Show Icons Only',
    'menu.showHiddenItems': 'Show Hidden Items',
    'menu.noHiddenItems': '(No hidden items)',
    'menu.resetNavbar': 'Reset Navigation Bar',
    'menu.hiddenItems': 'Hidden Items',
    'menu.show': 'Show',

    // Context menu - Settings/Account
    'menu.settings': 'Settings',
    'menu.extensions': 'Extensions',
    'menu.keyboardShortcuts': 'Keyboard Shortcuts',
    'menu.aboutPodmanDesktop': 'About Podman Desktop',
    'menu.signOut': 'Sign Out',

    // Info banner messages
    'banner.featureOutOfScope': 'Feature out of scope',
    'banner.featureOutOfScopeDesc': 'This feature is out of scope for this prototype.',
    'banner.keyboardShortcut': 'Keyboard Shortcut',
    'banner.keyboardShortcutDesc': 'This would open a dialog to assign a keyboard shortcut.',
    'banner.extensionSettings': 'Extension Settings',
    'banner.extensionSettingsDesc': 'This would open the settings for this extension.',
    'banner.removeExtension': 'Remove Extension',
    'banner.removeExtensionDesc': 'This would start the extension uninstall process.',
    'banner.configureNavbar': 'Configure Navigation Bar',
    'banner.configureNavbarDesc': 'This would open Navigation Bar settings.',
    'banner.settings': 'Settings',
    'banner.settingsDesc': 'This would open Podman Desktop Settings.',
    'banner.extensions': 'Extensions',
    'banner.extensionsDesc': 'This would open the Extensions panel.',
    'banner.keyboardShortcuts': 'Keyboard Shortcuts',
    'banner.keyboardShortcutsDesc': 'This would open Keyboard Shortcuts settings.',
    'banner.about': 'About Podman Desktop',
    'banner.aboutDesc': 'This would show the About dialog.',
    'banner.signOut': 'Sign Out',
    'banner.signOutDesc': 'This would sign you out.',
    'banner.pinLimitReached': 'Pinning Limit Reached',
    'banner.pinLimitReachedDesc': 'You can pin up to 10 items.',
    'banner.clickToDismiss': 'Click anywhere to dismiss',

    // Modal dialog
    'modal.hideItem': 'Hide Item',
    'modal.hideItemDescription': 'This item will be hidden. You can restore it in Settings.',
    'modal.dontShowAgain': "Don't show this again",
    'modal.ok': 'OK',
    'modal.cancel': 'Cancel',

    // Accessibility
    'a11y.navigationBar': 'Navigation Bar',
    'a11y.mainNavigation': 'Main Navigation',
    'a11y.pinnedItems': 'Pinned Items',
    'a11y.moreOptions': 'More Options',
    'a11y.closeMenu': 'Close Menu',
} as const;

export type TranslationKey = keyof typeof en;
