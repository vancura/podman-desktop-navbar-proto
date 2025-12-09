/**
 * German Translations
 * Note: German text is typically 30-35% longer than English
 */

export const de = {
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

    // Extension items
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',

    // More button
    'nav.more': 'Mehr',

    // Context menu - Item
    'menu.pinToTop': 'Nach oben anheften',
    'menu.unpin': 'Lösen',
    'menu.hideFromNavBar': 'Aus Navigationsleiste ausblenden',
    'menu.keyboardShortcut': 'Tastenkürzel...',
    'menu.extensionSettings': 'Erweiterungseinstellungen',
    'menu.removeExtension': 'Erweiterung entfernen',
    'menu.configureNavBar': 'Navigationsleiste konfigurieren',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'Symbole und Titel anzeigen',
    'menu.showIconsOnly': 'Nur Symbole anzeigen',
    'menu.showHiddenItems': 'Ausgeblendete Elemente anzeigen',
    'menu.resetNavBar': 'Navigationsleiste zurücksetzen',

    // Context menu - Settings
    'menu.settings': 'Einstellungen',
    'menu.extensions': 'Erweiterungen',
    'menu.keyboardShortcuts': 'Tastenkürzel',
    'menu.aboutPodmanDesktop': 'Über Podman Desktop',

    // Context menu - Account
    'menu.signOut': 'Abmelden',

    // Tooltips
    'tooltip.shortcut': 'Tastenkürzel',

    // Modal dialog
    'modal.hideItem': 'Element ausblenden',
    'modal.hideItemDescription':
        'Dieses Element wird aus der Navigationsleiste ausgeblendet. Sie können es in den Podman Desktop Einstellungen wiederherstellen.',
    'modal.dontShowAgain': 'Nicht mehr anzeigen',
    'modal.ok': 'OK',
    'modal.cancel': 'Abbrechen',

    // Content area controls
    'controls.itemManagement': 'Elementverwaltung',
    'controls.addItem': 'Element hinzufügen',
    'controls.removeLastItem': 'Letztes Element entfernen',
    'controls.removeRandomItem': 'Zufälliges Element entfernen',
    'controls.pinning': 'Anheften',
    'controls.pinRandomItem': 'Zufälliges Element anheften',
    'controls.unpinAllItems': 'Alle Elemente lösen',
    'controls.visibility': 'Sichtbarkeit',
    'controls.hideRandomItem': 'Zufälliges Element ausblenden',
    'controls.unhideAllItems': 'Alle Elemente einblenden',
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
} as const;
