<!--
  ContextMenu Component
  Context menu overlay with actions for navbar items.
-->
<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';

    /** Menu item definition. */
    interface MenuItem {
        labelKey: string;
        action: string;
        disabled?: boolean;
        separator?: boolean;
    }

    const contextMenu = $derived(appState.ui.contextMenu);
    const item = $derived(contextMenu?.itemId ? actions.findItem(contextMenu.itemId) : null);
    const isExpanded = $derived(appState.isExpanded);

    // Keyboard navigation state
    let focusedIndex = $state(-1);

    // Reset focus when menu opens
    $effect(() => {
        if (contextMenu) {
            focusedIndex = 0; // Focus first item when menu opens
        }
    });

    // Determine item category
    const isEssential = $derived(item ? appState.items.essential.some(i => i.id === item.id) : false);
    const isPinned = $derived(item ? appState.items.pinned.some(i => i.id === item.id) : false);
    const isRegular = $derived(item ? appState.items.regular.some(i => i.id === item.id) : false);
    const isSettings = $derived(item?.id === 'settings');
    const isAccount = $derived(item?.id === 'account');

    // Build menu items reactively based on item type
    const menuItems = $derived.by((): MenuItem[] => {
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
        if (isPinned && item) {
            return [
                { labelKey: 'menu.unpin', action: 'unpin' },
                { labelKey: 'menu.hideFromNavBar', action: 'hide', disabled: !item.canHide },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.keyboardShortcut', action: 'shortcut' },
                { labelKey: 'menu.extensionSettings', action: 'extensionSettings' },
                { labelKey: 'menu.removeExtension', action: 'removeExtension' },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            ];
        }

        // Regular items
        if (isRegular && item) {
            const canPin = item.canPin && appState.canPinMore;
            return [
                { labelKey: 'menu.pinToTop', action: 'pin', disabled: !canPin },
                { labelKey: 'menu.hideFromNavBar', action: 'hide', disabled: !item.canHide },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.keyboardShortcut', action: 'shortcut' },
                { labelKey: 'menu.extensionSettings', action: 'extensionSettings' },
                { labelKey: 'menu.removeExtension', action: 'removeExtension' },
                { labelKey: '', action: '', separator: true },
                { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            ];
        }

        // Empty space menu
        return [
            // Toggle between modes - show the opposite action
            isExpanded
                ? { labelKey: 'menu.showIconsOnly', action: 'showIconsOnly' }
                : { labelKey: 'menu.showIconsAndTitles', action: 'showIconsAndTitles' },
            { labelKey: 'menu.showHiddenItems', action: 'showHidden', disabled: !appState.hasHiddenItems },
            { labelKey: '', action: '', separator: true },
            { labelKey: 'menu.configureNavbar', action: 'configureNavbar' },
            { labelKey: 'menu.resetNavbar', action: 'reset' },
        ];
    });

    // Get actionable (non-separator, non-disabled) item indices
    const actionableIndices = $derived(
        menuItems
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => !item.separator && !item.disabled)
            .map(({ index }) => index)
    );

    function handleAction(action: string) {
        if (!contextMenu) return;

        switch (action) {
            case 'pin':
                if (item) actions.pinItem(item.id);
                break;
            case 'unpin':
                if (item) actions.unpinItem(item.id);
                break;
            case 'hide':
                if (item) {
                    const itemIdToHide = item.id;
                    if (!appState.ui.hideWarningDismissed) {
                        actions.showModal({
                            titleKey: 'modal.hideItem',
                            descriptionKey: 'modal.hideItemDescription',
                            checkboxKey: 'modal.dontShowAgain',
                            onConfirm: (checked) => {
                                if (checked) actions.dismissHideWarning();
                                actions.hideItem(itemIdToHide);
                            },
                        });
                    } else {
                        actions.hideItem(itemIdToHide);
                    }
                }
                break;
            case 'showIconsOnly':
                actions.setNavbarWidth(80);
                break;
            case 'showIconsAndTitles':
                actions.setNavbarWidth(200);
                break;
            case 'showHidden':
                // Show the more menu at the context menu position
                actions.showMoreMenu(contextMenu.x, contextMenu.y);
                break;
            case 'reset':
                actions.reset();
                break;
            // All these show banners explaining what would happen
            case 'shortcut':
                actions.showBanner('banner.keyboardShortcut', 'banner.keyboardShortcutDesc');
                break;
            case 'extensionSettings':
                actions.showBanner('banner.extensionSettings', 'banner.extensionSettingsDesc');
                break;
            case 'removeExtension':
                actions.showBanner('banner.removeExtension', 'banner.removeExtensionDesc');
                break;
            case 'configureNavbar':
                actions.showBanner('banner.configureNavbar', 'banner.configureNavbarDesc');
                break;
            case 'settings':
                actions.showBanner('banner.settings', 'banner.settingsDesc');
                break;
            case 'extensions':
                actions.showBanner('banner.extensions', 'banner.extensionsDesc');
                break;
            case 'keyboardShortcuts':
                actions.showBanner('banner.keyboardShortcuts', 'banner.keyboardShortcutsDesc');
                break;
            case 'about':
                actions.showBanner('banner.about', 'banner.aboutDesc');
                break;
            case 'signOut':
                actions.showBanner('banner.signOut', 'banner.signOutDesc');
                break;
            default:
                actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
        }

        actions.hideContextMenu();
    }

    function handleBackdropClick() {
        actions.hideContextMenu();
    }

    function navigateUp() {
        if (actionableIndices.length === 0) return;
        const currentPos = actionableIndices.indexOf(focusedIndex);
        if (currentPos > 0) {
            focusedIndex = actionableIndices[currentPos - 1]!;
        } else {
            // Wrap to bottom
            focusedIndex = actionableIndices[actionableIndices.length - 1]!;
        }
    }

    function navigateDown() {
        if (actionableIndices.length === 0) return;
        const currentPos = actionableIndices.indexOf(focusedIndex);
        if (currentPos < actionableIndices.length - 1) {
            focusedIndex = actionableIndices[currentPos + 1]!;
        } else {
            // Wrap to top
            focusedIndex = actionableIndices[0]!;
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!contextMenu) return;

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                actions.hideContextMenu();
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateUp();
                break;
            case 'ArrowDown':
                e.preventDefault();
                navigateDown();
                break;
            case 'Home':
                e.preventDefault();
                if (actionableIndices.length > 0) {
                    focusedIndex = actionableIndices[0]!;
                }
                break;
            case 'End':
                e.preventDefault();
                if (actionableIndices.length > 0) {
                    focusedIndex = actionableIndices[actionableIndices.length - 1]!;
                }
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                const focusedItem = menuItems[focusedIndex];
                if (focusedItem && !focusedItem.separator && !focusedItem.disabled) {
                    handleAction(focusedItem.action);
                }
                break;
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if contextMenu}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-[var(--z-context-menu)]"
        onclick={handleBackdropClick}
    >
        <div
            class="absolute min-w-52 rounded-lg border border-[var(--color-menu-border)] bg-[var(--color-menu-bg)] py-1 shadow-xl"
            style="left: {contextMenu.x}px; top: {contextMenu.y}px;"
            role="menu"
            tabindex="-1"
            onclick={(e) => e.stopPropagation()}
        >
            {#each menuItems as menuItem, index (index)}
                {#if menuItem.separator}
                    <div class="my-1 h-px bg-[var(--color-menu-separator)]"></div>
                {:else}
                    <button
                        type="button"
                        class="flex w-full px-3 py-1.5 text-left text-sm transition-colors
                            {menuItem.disabled ? 'cursor-not-allowed text-[var(--color-menu-text-disabled)]' : 'text-[var(--color-menu-text)] hover:bg-[var(--color-menu-item-hover)]'}
                            {focusedIndex === index && !menuItem.disabled ? 'bg-[var(--color-menu-item-hover)]' : ''}"
                        role="menuitem"
                        disabled={menuItem.disabled}
                        tabindex="-1"
                        onclick={() => !menuItem.disabled && handleAction(menuItem.action)}
                        onmouseenter={() => { if (!menuItem.disabled) focusedIndex = index; }}
                    >
                        {t(menuItem.labelKey as TranslationKey)}
                    </button>
                {/if}
            {/each}
        </div>
    </div>
{/if}
