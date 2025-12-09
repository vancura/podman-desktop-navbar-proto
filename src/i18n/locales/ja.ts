/**
 * Japanese Translations
 * Note: Japanese text is typically shorter than English
 */

export const ja = {
    // Navigation items
    'nav.containers': 'コンテナ',
    'nav.images': 'イメージ',
    'nav.pods': 'Pod',
    'nav.volumes': 'ボリューム',
    'nav.kubernetes': 'Kubernetes',
    'nav.extensions': '拡張機能',
    'nav.terminal': 'ターミナル',
    'nav.account': 'アカウント',
    'nav.settings': '設定',

    // Extension items
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',

    // More button
    'nav.more': 'その他',

    // Context menu - Item
    'menu.pinToTop': '上部に固定',
    'menu.unpin': '固定解除',
    'menu.hideFromNavBar': 'ナビバーから非表示',
    'menu.keyboardShortcut': 'キーボードショートカット...',
    'menu.extensionSettings': '拡張機能の設定',
    'menu.removeExtension': '拡張機能を削除',
    'menu.configureNavbar': 'ナビバーの設定',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'アイコンとタイトルを表示',
    'menu.showIconsOnly': 'アイコンのみ表示',
    'menu.showHiddenItems': '非表示の項目を表示',
    'menu.noHiddenItems': '（非表示の項目はありません）',
    'menu.resetNavbar': 'ナビバーをリセット',

    // Context menu - Settings
    'menu.settings': '設定',
    'menu.extensions': '拡張機能',
    'menu.keyboardShortcuts': 'キーボードショートカット',
    'menu.aboutPodmanDesktop': 'Podman Desktopについて',

    // Context menu - Account
    'menu.signOut': 'サインアウト',

    // Tooltips
    'tooltip.shortcut': 'ショートカット',

    // Modal dialog
    'modal.hideItem': '項目を非表示',
    'modal.hideItemDescription': 'この項目はナビバーから非表示になります。Podman Desktop設定で復元できます。',
    'modal.dontShowAgain': '今後表示しない',
    'modal.ok': 'OK',
    'modal.cancel': 'キャンセル',

    // Content area controls
    'controls.itemManagement': '項目管理',
    'controls.addItem': '項目を追加',
    'controls.removeLastItem': '最後の項目を削除',
    'controls.removeRandomItem': 'ランダムな項目を削除',
    'controls.pinning': '固定',
    'controls.pinRandomItem': 'ランダムな項目を固定',
    'controls.unpinAllItems': 'すべての固定を解除',
    'controls.visibility': '表示',
    'controls.hideRandomItem': 'ランダムな項目を非表示',
    'controls.unhideAllItems': 'すべての項目を表示',
    'controls.language': '言語',

    // Locale names
    'locale.en': 'English',
    'locale.de': 'Deutsch',
    'locale.ja': '日本語',
    'locale.ar': 'العربية',
    'locale.he': 'עברית',

    // Accessibility
    'a11y.navigationBar': 'ナビゲーションバー',
    'a11y.mainNavigation': 'メインナビゲーション',
    'a11y.pinnedItems': '固定された項目',
    'a11y.moreOptions': 'その他のオプション',
    'a11y.closeMenu': 'メニューを閉じる',
} as const;
