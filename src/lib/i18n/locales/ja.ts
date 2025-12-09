/**
 * Japanese Translations
 */

import type { TranslationKey } from './en.js';

export const ja: Partial<Record<TranslationKey, string>> = {
    // Navigation items
    'nav.containers': 'コンテナ',
    'nav.images': 'イメージ',
    'nav.pods': 'ポッド',
    'nav.volumes': 'ボリューム',
    'nav.kubernetes': 'Kubernetes',
    'nav.extensions': '拡張機能',
    'nav.terminal': 'ターミナル',
    'nav.account': 'アカウント',
    'nav.settings': '設定',
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',
    'nav.more': 'その他',

    // Context menu - Item actions
    'menu.pinToTop': '上部にピン留め',
    'menu.unpin': 'ピン留め解除',
    'menu.hideFromNavBar': 'ナビゲーションバーから非表示',
    'menu.keyboardShortcut': 'キーボードショートカット...',
    'menu.extensionSettings': '拡張機能の設定',
    'menu.removeExtension': '拡張機能を削除',
    'menu.configureNavbar': 'ナビゲーションバーの設定',

    // Context menu - Empty space
    'menu.showIconsAndTitles': 'アイコンとタイトルを表示',
    'menu.showIconsOnly': 'アイコンのみ表示',
    'menu.showHiddenItems': '非表示の項目を表示',
    'menu.noHiddenItems': '（非表示の項目はありません）',
    'menu.resetNavbar': 'ナビゲーションバーをリセット',

    // Context menu - Settings/Account
    'menu.settings': '設定',
    'menu.extensions': '拡張機能',
    'menu.keyboardShortcuts': 'キーボードショートカット',
    'menu.aboutPodmanDesktop': 'Podman Desktopについて',
    'menu.signOut': 'ログアウト',

    // Modal dialog
    'modal.hideItem': '項目を非表示',
    'modal.hideItemDescription': 'この項目は非表示になります。設定から復元できます。',
    'modal.dontShowAgain': '今後表示しない',
    'modal.ok': '確認',
    'modal.cancel': 'キャンセル',

    // Controls
    'controls.itemManagement': '項目管理',
    'controls.addItem': '項目を追加',
    'controls.removeLast': '最後の項目を削除',
    'controls.removeRandom': 'ランダムに削除',
    'controls.pinning': 'ピン留め',
    'controls.pinRandom': 'ランダムにピン留め',
    'controls.unpinAll': 'すべてのピン留めを解除',
    'controls.visibility': '表示設定',
    'controls.hideRandom': 'ランダムに非表示',
    'controls.unhideAll': 'すべて表示',
    'controls.language': '言語',

    // Locale names (intentionally in native scripts for language selector UX)
    'locale.en': 'English',
    'locale.de': 'Deutsch',
    'locale.ja': '日本語',
    'locale.ar': 'العربية',
    'locale.he': 'עברית',

    // Accessibility
    'a11y.navigationBar': 'ナビゲーションバー',
    'a11y.mainNavigation': 'メインナビゲーション',
    'a11y.pinnedItems': 'ピン留めされた項目',
    'a11y.moreOptions': 'その他のオプション',
    'a11y.closeMenu': 'メニューを閉じる',
};
