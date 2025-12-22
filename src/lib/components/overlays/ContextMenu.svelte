<!--
  ContextMenu Component
  Context menu overlay with actions for navbar items.
-->

<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import { getMenuKeyAction, navigateActionable } from '../../utils/menu-navigation.js';
    import Backdrop from './Backdrop.svelte';

    /** Context menu item definition. */
    interface ContextMenuItem {
        labelKey: string;
        action: string;
        disabled?: boolean;
        separator?: boolean;
    }

    const contextMenu = $derived(appState.ui.contextMenu);
    const targetItem = $derived(contextMenu?.itemId ? actions.findItem(contextMenu.itemId) : null);
    const isExpanded = $derived(appState.isExpanded);
    const locale = $derived(appState.locale);

    let focusedIndex = $state(0);

    // Reset focus when menu opens
    $effect(() => {
        if (contextMenu) {
            focusedIndex = 0;
        }
    });

    // Determine item category for menu building
    const isEssential = $derived(targetItem ? appState.items.essential.some((i) => i.id === targetItem.id) : false);
    const isPinned = $derived(targetItem ? appState.items.pinned.some((i) => i.id === targetItem.id) : false);
    const isRegular = $derived(targetItem ? appState.items.regular.some((i) => i.id === targetItem.id) : false);
    const isSettings = $derived(targetItem?.id === 'settings');
    const isAccount = $derived(targetItem?.id === 'account');

    /** Build menu items based on context. */
    const menuItems = $derived.by((): ContextMenuItem[] => {
        if (!contextMenu) return [];

        // Settings item menu
        if (isSettings) {
            return [
                { labelKey: 'menu.settings', action: 'settings' },
                { labelKey: 'menu.extensions', action: 'extensions' },
                { labelKey: 'menu.keyboardShortcuts', action: 'keyboardShortcuts' },
                { labelKey: 'menu.aboutPodmanDesktop', action: 'about' },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            ];
        }

        // Account item menu
        if (isAccount) {
            return [
                { labelKey: 'menu.signOut', action: 'signOut' },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            ];
        }

        // Essential items (Containers, Images) - cannot be pinned/hidden
        if (isEssential) {
            return [
                { labelKey: 'menu.keyboardShortcut', action: 'shortcut' },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            ];
        }

        // Pinned items
        if (isPinned && targetItem) {
            return [
                { labelKey: 'menu.unpin', action: 'unpin' },
                { labelKey: 'menu.hideFromNavBar', action: 'hide', disabled: !targetItem.canHide },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.keyboardShortcut', action: 'shortcut' },
                { labelKey: 'menu.extensionSettings', action: 'extensionSettings' },
                { labelKey: 'menu.removeExtension', action: 'removeExtension' },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            ];
        }

        // Regular items
        if (isRegular && targetItem) {
            const canPin = targetItem.canPin && appState.canPinMore;
            return [
                { labelKey: 'menu.pinToTop', action: 'pin', disabled: !canPin },
                { labelKey: 'menu.hideFromNavBar', action: 'hide', disabled: !targetItem.canHide },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.keyboardShortcut', action: 'shortcut' },
                { labelKey: 'menu.extensionSettings', action: 'extensionSettings' },
                { labelKey: 'menu.removeExtension', action: 'removeExtension' },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            ];
        }

        // Empty space menu - toggle between expanded/collapsed
        const toggleItem = isExpanded
            ? { labelKey: 'menu.showIconsOnly', action: 'showIconsOnly' }
            : { labelKey: 'menu.showIconsAndTitles', action: 'showIconsAndTitles' };

        return [
            toggleItem,
            { labelKey: 'menu.showHiddenItems', action: 'showHidden', disabled: !appState.hasHiddenItems },
            { labelKey: '', action: '', separator: true },
            { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            { labelKey: 'menu.resetNavbar', action: 'reset' },
        ];
    });

    // Indices of actionable (non-separator, non-disabled) items for keyboard navigation
    const actionableIndices = $derived(
        menuItems
            .map((entry, index) => ({ entry, index }))
            .filter(({ entry }) => !entry.separator && !entry.disabled)
            .map(({ index }) => index),
    );

    /** Execute menu action. */
    function executeAction(action: string) {
        if (!contextMenu) return;

        // Map action strings to their handlers
        const actionHandlers: Record<string, () => void> = {
            pin: () => targetItem && actions.pinItem(targetItem.id),
            unpin: () => targetItem && actions.unpinItem(targetItem.id),
            hide: () => handleHideAction(),
            showIconsOnly: () => actions.setNavbarWidth(80),
            showIconsAndTitles: () => actions.setNavbarWidth(200),
            showHidden: () => actions.showMoreMenu(contextMenu.x, contextMenu.y),
            reset: () => actions.reset(),
            // Banner notifications for prototype features
            shortcut: () => actions.showBanner('banner.keyboardShortcut', 'banner.keyboardShortcutDesc'),
            extensionSettings: () => actions.showBanner('banner.extensionSettings', 'banner.extensionSettingsDesc'),
            removeExtension: () => actions.showBanner('banner.removeExtension', 'banner.removeExtensionDesc'),
            configureNavbar: () => actions.showBanner('banner.configureNavbar', 'banner.configureNavbarDesc'),
            settings: () => actions.showBanner('banner.settings', 'banner.settingsDesc'),
            extensions: () => actions.showBanner('banner.extensions', 'banner.extensionsDesc'),
            keyboardShortcuts: () => actions.showBanner('banner.keyboardShortcuts', 'banner.keyboardShortcutsDesc'),
            about: () => actions.showBanner('banner.about', 'banner.aboutDesc'),
            signOut: () => actions.showBanner('banner.signOut', 'banner.signOutDesc'),
        };

        const handler = actionHandlers[action];
        if (handler) {
            handler();
        } else {
            actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
        }

        actions.hideContextMenu();
    }

    /** Handle hide action with optional confirmation modal. */
    function handleHideAction() {
        if (!targetItem) return;

        const itemIdToHide = targetItem.id;

        if (!appState.ui.hideWarningDismissed) {
            actions.showModal({
                titleKey: 'modal.hideItem',
                descriptionKey: 'modal.hideItemDescription',
                checkboxKey: 'modal.doNotShowAgain',
                onConfirm: (checked) => {
                    if (checked) actions.dismissHideWarning();
                    actions.hideItem(itemIdToHide);
                },
            });
        } else {
            actions.hideItem(itemIdToHide);
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!contextMenu) return;

        const action = getMenuKeyAction(e.key);
        if (action === 'none') return;

        e.preventDefault();

        switch (action) {
            case 'close':
                actions.hideContextMenu();
                break;
            case 'up':
            case 'down':
            case 'first':
            case 'last':
                focusedIndex = navigateActionable(action, focusedIndex, actionableIndices);
                break;
            case 'select': {
                const focusedItem = menuItems[focusedIndex];
                if (focusedItem && !focusedItem.separator && !focusedItem.disabled) {
                    executeAction(focusedItem.action);
                }
                break;
            }
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if contextMenu}
    {#key locale}
        <Backdrop zIndex="z-context-menu" onClose={() => actions.hideContextMenu()}>
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div
                class="absolute min-w-52 rounded-lg border border-(--color-menu-border) bg-(--color-menu-bg) py-1 shadow-xl"
                style="left: {contextMenu.x}px; top: {contextMenu.y}px;"
                role="menu"
                tabindex="-1"
                onclick={(e) => e.stopPropagation()}
            >
                {#each menuItems as entry, index (index)}
                    {#if entry.separator}
                        <div class="my-1 h-px bg-menu-separator"></div>
                    {:else}
                        <button
                            type="button"
                            class="flex w-full px-3 py-1.5 text-left text-sm rounded-sm
                            {entry.disabled ? 'text-(--color-menu-text-disabled)' : 'text-menu-text'}
                            {focusedIndex === index && !entry.disabled ? 'bg-menu-item-selected' : ''}"
                            role="menuitem"
                            disabled={entry.disabled}
                            tabindex="-1"
                            onclick={() => !entry.disabled && executeAction(entry.action)}
                            onmouseenter={() => {
                                if (!entry.disabled) focusedIndex = index;
                            }}
                        >
                            {t(entry.labelKey as TranslationKey)}
                        </button>
                    {/if}
                {/each}
            </div>
        </Backdrop>
    {/key}
{/if}
