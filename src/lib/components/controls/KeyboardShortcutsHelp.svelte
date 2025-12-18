<!--
  KeyboardShortcutsHelp Component
  Displays all available keyboard shortcuts organized by category.
-->

<script lang="ts">
    import { appState } from '../../state/app-state.svelte.js';

    // Force re-render when locale changes
    const locale = $derived(appState.locale);

    /** Shortcut group definition. */
    interface ShortcutGroup {
        title: string;
        shortcuts: Array<{ key: string; description: string }>;
    }

    /** All shortcut groups to display. */
    const SHORTCUT_GROUPS: ShortcutGroup[] = [
        {
            title: 'Navigation',
            shortcuts: [
                { key: '⌘1', description: 'Containers' },
                { key: '⌘2', description: 'Images' },
                { key: '⌘3', description: 'Pods' },
                { key: '⌘4', description: 'Kubernetes' },
                { key: '⌘5', description: 'Terminal' },
                { key: '⌘0', description: 'Settings' },
            ],
        },
        {
            title: 'Pinned Items',
            shortcuts: [{ key: '⌘6 – 9', description: 'Pinned 1–4' }],
        },
        {
            title: 'Focus Navigation',
            shortcuts: [
                { key: '↑ / ↓', description: 'Navigate items' },
                { key: 'Home / End', description: 'First / Last' },
                { key: 'Enter', description: 'Activate item' },
                { key: 'Tab', description: 'Focus next' },
                { key: '⇧Tab', description: 'Focus previous' },
            ],
        },
        {
            title: 'Other',
            shortcuts: [
                { key: '⌘B', description: 'Toggle navbar' },
                { key: '⌘⇧P', description: 'Pin current item' },
                { key: '⌘⇧K', description: 'Show hidden items' },
                { key: 'Esc', description: 'Close overlay' },
            ],
        },
    ];
</script>

{#key locale}
    <div class="rounded-2xl border-2 border-content-border bg-content-bg-secondary p-6 my-6">
        <h3 class="mb-4 text-md font-semibold text-text-primary">Keyboard Shortcuts</h3>

        <div class="grid grid-cols-2 gap-6">
            {#each SHORTCUT_GROUPS as group (group.title)}
                <div>
                    <h4 class="mb-3 text-sm font-medium text-text-secondary">
                        {group.title}:
                    </h4>

                    <div class="space-y-1.5">
                        {#each group.shortcuts as shortcut (shortcut.key)}
                            <div class="flex items-center justify-between text-sm">
                                <kbd
                                    class="min-w-24 rounded-lg border border-content-border px-2 py-1.25 text-sm text-text-secondary text-center tracking-wide"
                                >
                                    {shortcut.key}
                                </kbd>

                                <span class="flex-1 pl-3 text-text-secondary">
                                    {shortcut.description}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/key}
