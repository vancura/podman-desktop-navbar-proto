<!--
  ControlPanel Component
  Control buttons for testing navbar functionality.
-->

<script lang="ts">
    import { actions } from '../../state/app-state.svelte.js';
    import type { NavItem } from '../../state/types.js';
    import { subscribeToPlatformChanges } from '../../utils/keyboard.js';
    import ActionButton from './ActionButton.svelte';
    import KeyboardShortcutsHelp from './KeyboardShortcutsHelp.svelte';
    import TipSection from './TipSection.svelte';
    import LocaleSwitcher from './LocaleSwitcher.svelte';

    // Reactive state for platform changes - increments to force re-computation
    let platformChangeCount = $state(0);

    // Subscribe to platform override changes
    $effect(() => {
        const unsubscribe = subscribeToPlatformChanges(() => {
            platformChangeCount++;
        });
        return unsubscribe;
    });

    function handleAddItem() {
        const itemTypes = [
            { labelKey: 'nav.extensions', icon: 'plug', prefix: 'ext' },
            { labelKey: 'nav.containers', icon: 'box', prefix: 'con' },
            { labelKey: 'nav.images', icon: 'gallery', prefix: 'img' },
            { labelKey: 'nav.volumes', icon: 'database', prefix: 'vol' },
            { labelKey: 'nav.pods', icon: 'widget', prefix: 'pod' },
            { labelKey: 'nav.kubernetes', icon: 'server', prefix: 'k8s' },
            { labelKey: 'nav.terminal', icon: 'terminal', prefix: 'term' },
            { labelKey: 'nav.dockerCompose', icon: 'box', prefix: 'dc' },
            { labelKey: 'nav.kind', icon: 'widget', prefix: 'kind' },
            { labelKey: 'nav.lima', icon: 'server', prefix: 'lima' },
            { labelKey: 'nav.bootc', icon: 'database', prefix: 'bootc' },
            { labelKey: 'nav.minikube', icon: 'server', prefix: 'mini' },
        ];

        const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];

        if (!randomType) {
            throw new Error('Failed to pick a random item type');
        }

        const newItem: NavItem = {
            id: `${randomType.prefix}-${Date.now()}`,
            labelKey: randomType.labelKey,
            icon: randomType.icon as any,
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

    <TipSection />

    <!-- Keyboard Shortcuts -->
    <KeyboardShortcutsHelp />

    <p>
        GitHub: <a href="https://github.com/vancura/podman-desktop-navbar-proto">
            @vancura/podman-desktop-navbar-proto
        </a>
    </p>
</div>
