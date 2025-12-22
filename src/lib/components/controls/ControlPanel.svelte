<!--
  ControlPanel Component
  Control buttons for testing navbar functionality.
-->

<script lang="ts">
    import { actions } from '../../state/app-state.svelte.js';
    import type { NavItem } from '../../state/types.js';
    import ActionButton from './ActionButton.svelte';
    import KeyboardShortcutsHelp from './KeyboardShortcutsHelp.svelte';
    import LocaleSwitcher from './LocaleSwitcher.svelte';

    function handleAddItem() {
        const newItem: NavItem = {
            id: `ext-${Date.now()}`,
            labelKey: 'nav.extensions',
            icon: 'plug',
            canPin: true,
            canHide: true,
            originalCategory: 'regular',
        };

        actions.addItem(newItem);
    }
</script>

<!-- Always LTR - this is a debug/testing panel that stays in English -->
<div class="flex flex-col gap-6 p-6" dir="ltr">
    <h1 class="text-2xl font-bold">Podman Desktop Navigation Bar Prototype</h1>

    <div class="flex flex-wrap gap-8">
        <!-- Item Management -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-text-secondary">Item Management</h3>

            <div class="flex flex-wrap gap-2">
                <ActionButton onclick={handleAddItem}>Add Item</ActionButton>
                <ActionButton onclick={() => actions.removeLastItem()}>Remove Last</ActionButton>
                <ActionButton onclick={() => actions.removeRandomItem()}>Remove Random</ActionButton>
            </div>
        </section>

        <!-- Pinning -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-text-secondary">Pinning</h3>

            <div class="flex flex-wrap gap-2">
                <ActionButton onclick={() => actions.pinRandomItem()}>Pin Random</ActionButton>
                <ActionButton onclick={() => actions.unpinAll()}>Unpin All</ActionButton>
            </div>
        </section>

        <!-- Visibility -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-text-secondary">Visibility</h3>

            <div class="flex flex-wrap gap-2">
                <ActionButton onclick={() => actions.hideRandomItem()}>Hide Random</ActionButton>
                <ActionButton onclick={() => actions.unhideAll()}>Unhide All</ActionButton>
            </div>
        </section>

        <!-- Language -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-text-secondary">Language</h3>

            <LocaleSwitcher />
        </section>

        <!-- Reset -->
        <section>
            <h3 class="mb-2 text-sm font-medium text-text-secondary">Reset</h3>

            <ActionButton onclick={() => actions.reset()}>Reset All</ActionButton>
        </section>
    </div>

    <!-- Keyboard Shortcuts -->
    <KeyboardShortcutsHelp />
</div>
