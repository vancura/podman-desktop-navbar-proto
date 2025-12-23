/**
 * Chinese Translations
 */

import type { TranslationKey } from './en.js';

export const zh: Partial<Record<TranslationKey, string>> = {
    // Navigation items
    'nav.dashboard': '仪表板',
    'nav.containers': '容器',
    'nav.images': '镜像',
    'nav.pods': '容器组',
    'nav.volumes': '卷',
    'nav.kubernetes': 'Kubernetes',
    'nav.networks': '网络',
    'nav.secrets': '密钥',
    'nav.extensions': '扩展',
    'nav.account': '账户',
    'nav.settings': '设置',
    'nav.dockerCompose': 'Docker Compose',
    'nav.kind': 'Kind',
    'nav.lima': 'Lima',
    'nav.bootc': 'Bootc',
    'nav.minikube': 'Minikube',
    'nav.more': '更多',
    'nav.moreCount': '还有 {count} 个',

    // Context menu - Item actions
    'menu.pinToTop': '固定到顶部',
    'menu.unpin': '取消固定',
    'menu.hideFromNavBar': '从导航栏隐藏',
    'menu.keyboardShortcut': '键盘快捷键...',
    'menu.extensionSettings': '扩展设置',
    'menu.removeExtension': '删除扩展',
    'menu.configureNavbar': '配置导航栏',

    // Context menu - Empty space
    'menu.showIconsAndTitles': '显示图标和标题',
    'menu.showIconsOnly': '仅显示图标',
    'menu.showHiddenItems': '显示隐藏项',
    'menu.noHiddenItems': '（没有隐藏项）',
    'menu.resetNavbar': '重置导航栏',
    'menu.resetLayout': '重置布局',
    'menu.hiddenItems': '隐藏项',
    'menu.show': '显示',

    // Context menu - Settings/Account
    'menu.settings': '设置',
    'menu.extensions': '扩展',
    'menu.keyboardShortcuts': '键盘快捷键',
    'menu.aboutPodmanDesktop': '关于 Podman Desktop',
    'menu.signOut': '退出登录',

    // Accessibility
    'a11y.navigationBar': '导航栏',
    'a11y.mainNavigation': '主导航',
    'a11y.pinnedItems': '固定项',
    'a11y.moreOptions': '更多选项',
    'a11y.closeMenu': '关闭菜单',
};
