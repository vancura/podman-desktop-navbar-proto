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
                focusedIndex = navigatePrevious(focusedIndex, hiddenItems.length);
                break;
            case 'down':
                focusedIndex = navigateNext(focusedIndex, hiddenItems.length);
                break;
            case 'first':
                focusedIndex = 0;
                break;
            case 'last':
                focusedIndex = hiddenItems.length - 1;
                break;
            case 'select': {
                const focusedItem = hiddenItems[focusedIndex];
                if (focusedItem) {
                    handleUnhide(focusedItem.id);
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
            >
                <div
                    class="px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-(--color-menu-text-disabled)"
                >
                    {t('menu.hiddenItems' as TranslationKey)}
                </div>

                {#each hiddenItems as item, index (item.id)}
                    <button
                        type="button"
                        class="flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm text-(--color-menu-text)
                        {focusedIndex === index ? 'bg-(--color-menu-item-disabled)' : ''}"
                        role="menuitem"
                        tabindex="-1"
                        onclick={() => handleUnhide(item.id)}
                        onmouseenter={() => {
                            focusedIndex = index;
                        }}
                    >
                        <Icon name={item.icon} variant="outline" size={16} class="text-(--color-menu-text)" />

                        <span class="flex-1">{t(item.labelKey as TranslationKey)}</span>

                        <span class="text-sm text-(--color-menu-text-disabled)">{t('menu.show' as TranslationKey)}</span
                        >
                    </button>
                {/each}
            </div>
        {/key}
    </Backdrop>
{/if}
