<!--
  TipSection Component
  Displays tips and tricks for the application.
-->

<script lang="ts">
    import { formatKeyboardShortcut, subscribeToPlatformChanges } from '../../utils/keyboard.js';

    // Reactive state for platform changes - increments to force re-computation
    let platformChangeCount = $state(0);

    // Subscribe to platform override changes
    $effect(() => {
        const unsubscribe = subscribeToPlatformChanges(() => {
            platformChangeCount++;
        });
        return unsubscribe;
    });

    // Platform-aware keyboard shortcut for the tip (reactive to platform changes)
    const cmdKey = $derived.by(() => {
        // Access platformChangeCount to create reactive dependency
        platformChangeCount;
        return formatKeyboardShortcut({ cmd: true, key: '' }).replace(/\+$/, '');
    });
</script>

<div class="rounded-2xl border-2 border-content-border bg-content-bg-secondary p-6 mt-6">
    <h3 class="text-md font-semibold text-text-primary mb-4">Tips and Tricks</h3>

    <ul class="list-disc list-inside space-y-2">
        <li>Hold <kbd>{cmdKey}</kbd> for to see keyboard shortcuts above navigation bar items.</li>
        <li>Right click on a navigation bar items or empty space to see a context menu with additional actions.</li>
        <li>Pin/unpin, and hide/show items in the navigation bar.</li>
    </ul>
</div>
