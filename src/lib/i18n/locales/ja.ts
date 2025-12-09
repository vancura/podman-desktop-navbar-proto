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
    'nav.moreCount': 'あと{count}件',

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
    'menu.hiddenItems': '非表示の項目',
    'menu.show': '表示',

    // Context menu - Settings/Account
    'menu.settings': '設定',
    'menu.extensions': '拡張機能',
    'menu.keyboardShortcuts': 'キーボードショートカット',
    'menu.aboutPodmanDesktop': 'Podman Desktopについて',
    'menu.signOut': 'ログアウト',

    // Accessibility
    'a11y.navigationBar': 'ナビゲーションバー',
    'a11y.mainNavigation': 'メインナビゲーション',
    'a11y.pinnedItems': 'ピン留めされた項目',
    'a11y.moreOptions': 'その他のオプション',
    'a11y.closeMenu': 'メニューを閉じる',
};
