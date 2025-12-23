<!--
  MoreMenu Component
  Popup menu showing hidden navbar items.
-->

<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import { getMenuKeyAction, navigateNext, navigatePrevious } from '../../utils/menu-navigation.js';
    import Icon from '../Icon.svelte';
    import Backdrop from './Backdrop.svelte';

    const moreMenu = $derived(appState.ui.moreMenu);
    const hiddenItems = $derived(appState.items.hidden);
    const locale = $derived(appState.locale);

    // Total menu items: hidden items + separator + reset item
    const totalMenuItems = $derived(hiddenItems.length + 1);
    const resetItemIndex = $derived(hiddenItems.length);

    let focusedIndex = $state(0);

    // Reset focus when menu opens
    $effect(() => {
        if (moreMenu) {
            focusedIndex = 0;
        }
    });

    function handleUnhide(itemId: string) {
        actions.unhideItem(itemId);
        // Close menu if no more hidden items
        if (appState.items.hidden.length <= 1) {
            actions.hideMoreMenu();
        }
    }

    function handleResetLayout() {
        actions.unhideAll();
        actions.hideMoreMenu();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!moreMenu || hiddenItems.length === 0) return;

        const action = getMenuKeyAction(e.key);
        if (action === 'none') return;

        e.preventDefault();

        switch (action) {
            case 'close':
                actions.hideMoreMenu();
                break;
            case 'up':
                focusedIndex = navigatePrevious(focusedIndex, totalMenuItems);
                break;
            case 'down':
                focusedIndex = navigateNext(focusedIndex, totalMenuItems);
                break;
            case 'first':
                focusedIndex = 0;
                break;
            case 'last':
                focusedIndex = totalMenuItems - 1;
                break;
            case 'select': {
                if (focusedIndex === resetItemIndex) {
                    handleResetLayout();
                } else {
                    const focusedItem = hiddenItems[focusedIndex];
                    if (focusedItem) {
                        handleUnhide(focusedItem.id);
                    }
                }
                break;
            }
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if moreMenu && hiddenItems.length > 0}
    <Backdrop zIndex="z-context-menu" onClose={() => actions.hideMoreMenu()}>
        {#key locale}
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div
                class="absolute min-w-56 rounded-lg border border-(--color-menu-border) bg-(--color-menu-bg) py-1 shadow-xl"
                style="left: {moreMenu.x}px; bottom: calc(100vh - {moreMenu.y}px);"
                role="menu"
                tabindex="-1"
                onclick={(e) => e.stopPropagation()}
                onmouseleave={() => {
                    focusedIndex = -1;
                }}
            >
                {#each hiddenItems as item, index (item.id)}
                    <button
                        type="button"
                        class="flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm rounded-sm text-(--color-menu-text)
                        {focusedIndex === index ? 'bg-menu-item-selected' : ''}"
                        role="menuitem"
                        tabindex="-1"
                        onclick={() => handleUnhide(item.id)}
                        onmouseenter={() => {
                            focusedIndex = index;
                        }}
                    >
                        <Icon name="checkbox" size={16} class="text-(--color-menu-text)" />
                        <span class="flex-1">{t(item.labelKey as TranslationKey)}</span>
                    </button>
                {/each}

                <div class="my-1 h-px bg-menu-separator"></div>

                <button
                    type="button"
                    class="flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm rounded-sm text-(--color-menu-text)
                    {focusedIndex === resetItemIndex ? 'bg-menu-item-selected' : ''}"
                    role="menuitem"
                    tabindex="-1"
                    onclick={handleResetLayout}
                    onmouseenter={() => {
                        focusedIndex = resetItemIndex;
                    }}
                >
                    <Icon name="reset" size={16} class="text-(--color-menu-text)" />
                    <span class="flex-1">{t('menu.resetLayout' as TranslationKey)}</span>
                </button>
            </div>
        {/key}
    </Backdrop>
{/if}
