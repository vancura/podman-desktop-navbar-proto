/**
 * German Translations
 */

import type { TranslationKey } from './en.js';

export const de: Partial<Record<TranslationKey, string>> = {
    // Navigation items
    'nav.containers': 'Container',
    'nav.images': 'Abbilder',
    'nav.pods': 'Pods',
    'nav.volumes': 'Datenträger',
    'nav.kubernetes': 'Kubernetes',
    'nav.extensions': 'Erweiterungen',
    'nav.terminal': 'Terminal',
    'nav.account': 'Konto',
    'nav.settings': 'Einstellungen',
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',
    'nav.more': 'Mehr',

    // Context menu - Item actions
    'menu.pinToTop': 'Nach oben anheften',
    'menu.unpin': 'Lösen',
    'menu.hideFromNavBar': 'Aus Navigationsleiste ausblenden',
    'menu.keyboardShortcut': 'Tastenkürzel...',
    'menu.extensionSettings': 'Erweiterungseinstellungen',
    'menu.removeExtension': 'Erweiterung entfernen',
    'menu.configureNavbar': 'Navigationsleiste konfigurieren',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'Symbole und Titel anzeigen',
    'menu.showIconsOnly': 'Nur Symbole anzeigen',
    'menu.showHiddenItems': 'Ausgeblendete Elemente anzeigen',
    'menu.noHiddenItems': '(Keine ausgeblendeten Elemente)',
    'menu.resetNavbar': 'Navigationsleiste zurücksetzen',

    // Context menu - Settings/Account
    'menu.settings': 'Einstellungen',
    'menu.extensions': 'Erweiterungen',
    'menu.keyboardShortcuts': 'Tastenkürzel',
    'menu.aboutPodmanDesktop': 'Über Podman Desktop',
    'menu.signOut': 'Abmelden',

    // Modal dialog
    'modal.hideItem': 'Element ausblenden',
    'modal.hideItemDescription':
        'Dieses Element wird ausgeblendet. Sie können es in den Einstellungen wiederherstellen.',
    'modal.dontShowAgain': 'Nicht mehr anzeigen',
    'modal.ok': 'OK',
    'modal.cancel': 'Abbrechen',

    // Controls
    'controls.itemManagement': 'Elementverwaltung',
    'controls.addItem': 'Element hinzufügen',
    'controls.removeLast': 'Letztes entfernen',
    'controls.removeRandom': 'Zufällig entfernen',
    'controls.pinning': 'Anheften',
    'controls.pinRandom': 'Zufällig anheften',
    'controls.unpinAll': 'Alle lösen',
    'controls.visibility': 'Sichtbarkeit',
    'controls.hideRandom': 'Zufällig ausblenden',
    'controls.unhideAll': 'Alle einblenden',
    'controls.language': 'Sprache',

    // Locale names
    'locale.en': 'English',
    'locale.de': 'Deutsch',
    'locale.ja': '日本語',
    'locale.ar': 'العربية',
    'locale.he': 'עברית',

    // Accessibility
    'a11y.navigationBar': 'Navigationsleiste',
    'a11y.mainNavigation': 'Hauptnavigation',
    'a11y.pinnedItems': 'Angeheftete Elemente',
    'a11y.moreOptions': 'Weitere Optionen',
    'a11y.closeMenu': 'Menü schließen',
};
