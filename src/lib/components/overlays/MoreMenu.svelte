<!--
  MoreMenu Component
  Popup menu showing hidden navbar items.
-->
<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import Icon from '../Icon.svelte';

    const moreMenu = $derived(appState.ui.moreMenu);
    const hiddenItems = $derived(appState.items.hidden);
    const locale = $derived(appState.locale);

    // Keyboard navigation state
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

    function handleBackdropClick() {
        actions.hideMoreMenu();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!moreMenu || hiddenItems.length === 0) return;

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                actions.hideMoreMenu();
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : hiddenItems.length - 1;
                break;
            case 'ArrowDown':
                e.preventDefault();
                focusedIndex = focusedIndex < hiddenItems.length - 1 ? focusedIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                focusedIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                focusedIndex = hiddenItems.length - 1;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                const focusedItem = hiddenItems[focusedIndex];
                if (focusedItem) {
                    handleUnhide(focusedItem.id);
                }
                break;
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if moreMenu && hiddenItems.length > 0}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-[var(--z-context-menu)]"
        onclick={handleBackdropClick}
    >
        {#key locale}
        <div
            class="absolute min-w-56 rounded-lg border border-[var(--color-menu-border)] bg-[var(--color-menu-bg)] py-1 shadow-xl"
            style="left: {moreMenu.x}px; bottom: calc(100vh - {moreMenu.y}px);"
            role="menu"
            tabindex="-1"
            onclick={(e) => e.stopPropagation()}
        >
            <div class="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-menu-text-disabled)]">
                Hidden Items
            </div>
            {#each hiddenItems as item, index (item.id)}
                <button
                    type="button"
                    class="flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm text-[var(--color-menu-text)] transition-colors hover:bg-[var(--color-menu-item-hover)]
                        {focusedIndex === index ? 'bg-[var(--color-menu-item-hover)]' : ''}"
                    role="menuitem"
                    tabindex="-1"
                    onclick={() => handleUnhide(item.id)}
                    onmouseenter={() => { focusedIndex = index; }}
                >
                    <Icon name={item.icon} variant="outline" size={16} class="text-[var(--color-menu-text)]" />
                    <span class="flex-1">{t(item.labelKey as TranslationKey)}</span>
                    <span class="text-xs text-[var(--color-menu-text-disabled)]">Show</span>
                </button>
            {/each}
        </div>
        {/key}
    </div>
{/if}
