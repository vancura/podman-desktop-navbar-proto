<!--
  KeyboardShortcutsHelp Component
  Displays all available keyboard shortcuts organized by category.
  Includes platform toggle to preview shortcuts for macOS or Windows/Linux.
-->

<script lang="ts">
    import { appState } from '../../state/app-state.svelte.js';
    import {
        formatKeyboardShortcut,
        getPlatformOverride,
        setPlatformOverride,
        getEffectivePlatformName,
    } from '../../utils/keyboard.js';
    import ActionButton from './ActionButton.svelte';

    // Force re-render when locale changes
    const locale = $derived(appState.locale);

    // Platform override state - initialize to macOS by default
    let platformOverride = $state<'mac' | 'windows'>('mac');
    let effectivePlatform = $derived(getEffectivePlatformName());

    // Initialize platform override on mount
    $effect(() => {
        const current = getPlatformOverride();
        if (current === 'mac' || current === 'windows') {
            platformOverride = current;
        } else {
            // Default to mac if auto
            setPlatformOverride('mac');
            platformOverride = 'mac';
        }
    });

    // Toggle between mac/windows
    function togglePlatform() {
        const next: 'mac' | 'windows' = platformOverride === 'mac' ? 'windows' : 'mac';
        setPlatformOverride(next);
        platformOverride = next;
    }

    // Get display label for current platform setting (reactive to platformOverride)
    const platformLabel = $derived(platformOverride === 'mac' ? 'macOS' : 'Windows/Linux');

    /** Shortcut group definition. */
    interface ShortcutGroup {
        title: string;
        shortcuts: Array<{ keys: any; description: string }>;
    }

    /** All shortcut groups to display. */
    const SHORTCUT_GROUPS: ShortcutGroup[] = [
        {
            title: 'Navigation',
            shortcuts: [
                { keys: { cmd: true, key: '1' }, description: 'Dashboard' },
                { keys: { cmd: true, key: '2' }, description: 'Containers' },
                { keys: { cmd: true, key: '3' }, description: 'Images' },
                { keys: { cmd: true, key: '4' }, description: 'Pods' },
                { keys: { cmd: true, key: '5' }, description: 'Kubernetes' },
                { keys: { cmd: true, key: '6' }, description: 'Terminal' },
                { keys: { cmd: true, key: ',' }, description: 'Settings' },
            ],
        },
        {
            title: 'Pinned Items',
            shortcuts: [{ keys: { cmd: true, key: '7 – 9' }, description: 'Pinned 1–3' }],
        },
        {
            title: 'Focus Navigation',
            shortcuts: [
                { keys: { key: '↑ / ↓' }, description: 'Navigate items' },
                { keys: { key: 'Home / End' }, description: 'First / Last' },
                { keys: { key: 'Enter' }, description: 'Activate item' },
                { keys: { key: 'Tab' }, description: 'Focus next' },
                { keys: { shift: true, key: 'Tab' }, description: 'Focus previous' },
            ],
        },
        {
            title: 'Other',
            shortcuts: [
                { keys: { cmd: true, key: 'B' }, description: 'Toggle navbar size' },
                { keys: { cmd: true, key: 'P' }, description: 'Pin current item' },
                { keys: { cmd: true, shift: true, key: 'K' }, description: 'Show hidden items' },
                { keys: { key: 'Esc' }, description: 'Close overlay' },
            ],
        },
    ];
</script>

{#key locale + platformOverride + effectivePlatform}
    <div class="rounded-2xl border-2 border-content-border bg-content-bg-secondary p-6 my-6">
        <div class="mb-4 flex items-center justify-between">
            <h3 class="text-md font-semibold text-text-primary">Keyboard Shortcuts</h3>

            <ActionButton onclick={togglePlatform}>
                Platform: {platformLabel} (Click to Toggle)
            </ActionButton>
        </div>

        <div class="grid grid-cols-2 gap-6">
            {#each SHORTCUT_GROUPS as group (group.title)}
                <div>
                    <h4 class="mb-3 text-sm font-medium text-text-secondary">
                        {group.title}:
                    </h4>

                    <div class="space-y-1.5">
                        {#each group.shortcuts as shortcut, index (group.title + index)}
                            <div class="flex items-center justify-between text-sm">
                                <kbd
                                    class="min-w-24 rounded-lg border border-content-border px-2 py-1.25 text-sm text-text-secondary text-center tracking-wide"
                                >
                                    {formatKeyboardShortcut(shortcut.keys)}
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
