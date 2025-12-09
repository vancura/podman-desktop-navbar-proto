<!--
  ControlPanel Component
  Control buttons for testing navbar functionality.
-->
<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import type { NavItem } from '../../state/types.js';
    import ActionButton from './ActionButton.svelte';
    import KeyboardShortcutsHelp from './KeyboardShortcutsHelp.svelte';
    import LocaleSwitcher from './LocaleSwitcher.svelte';

    // Force re-render when locale changes by reading it
    const locale = $derived(appState.locale);

    function handleAddItem() {
        const newItem: NavItem = {
            id: `ext-${Date.now()}`,
            labelKey: 'nav.extensions',
            icon: 'plug',
            iconVariant: 'outline',
            canPin: true,
            canHide: true,
            originalCategory: 'regular',
        };
        actions.addItem(newItem);
    }

    // Re-translate when locale changes
    const labels = $derived({
        itemManagement: t('controls.itemManagement' as TranslationKey),
        addItem: t('controls.addItem' as TranslationKey),
        removeLast: t('controls.removeLast' as TranslationKey),
        removeRandom: t('controls.removeRandom' as TranslationKey),
        pinning: t('controls.pinning' as TranslationKey),
        pinRandom: t('controls.pinRandom' as TranslationKey),
        unpinAll: t('controls.unpinAll' as TranslationKey),
        visibility: t('controls.visibility' as TranslationKey),
        hideRandom: t('controls.hideRandom' as TranslationKey),
        unhideAll: t('controls.unhideAll' as TranslationKey),
        language: t('controls.language' as TranslationKey),
    });
</script>

{#key locale}
<div class="flex flex-col gap-6 p-6">
    <div class="flex flex-wrap gap-8">
        <!-- Item Management -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                {labels.itemManagement}
            </h3>
            <div class="flex flex-wrap gap-2">
                <ActionButton onclick={handleAddItem}>
                    {labels.addItem}
                </ActionButton>
                <ActionButton onclick={() => actions.removeLastItem()}>
                    {labels.removeLast}
                </ActionButton>
                <ActionButton onclick={() => actions.removeRandomItem()}>
                    {labels.removeRandom}
                </ActionButton>
            </div>
        </section>

        <!-- Pinning -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                {labels.pinning}
            </h3>
            <div class="flex flex-wrap gap-2">
                <ActionButton onclick={() => actions.pinRandomItem()}>
                    {labels.pinRandom}
                </ActionButton>
                <ActionButton onclick={() => actions.unpinAll()}>
                    {labels.unpinAll}
                </ActionButton>
            </div>
        </section>

        <!-- Visibility -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                {labels.visibility}
            </h3>
            <div class="flex flex-wrap gap-2">
                <ActionButton onclick={() => actions.hideRandomItem()}>
                    {labels.hideRandom}
                </ActionButton>
                <ActionButton onclick={() => actions.unhideAll()}>
                    {labels.unhideAll}
                </ActionButton>
            </div>
        </section>

        <!-- Language -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                {labels.language}
            </h3>
            <LocaleSwitcher />
        </section>

        <!-- Reset -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Reset
            </h3>
            <ActionButton onclick={() => actions.reset()}>Reset All</ActionButton>
        </section>
    </div>

    <!-- Keyboard Shortcuts -->
    <KeyboardShortcutsHelp />
</div>
{/key}
