<!--
  TitleBar Component
  macOS-style title bar with traffic lights and centered title.
  Displays dynamic window dimensions.
-->

<script lang="ts">
    import { appState } from '../../state/app-state.svelte.js';
    import TrafficLights from './TrafficLights.svelte';

    const isRtl = $derived(appState.isRtl);

    // Track window dimensions
    let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 0);
    let windowHeight = $state(typeof window !== 'undefined' ? window.innerHeight : 0);

    // Computed title with dimensions
    const displayTitle = $derived(`Window Frame (${Math.round(windowWidth)} × ${Math.round(windowHeight)} px)`);

    // Set up resize listener
    $effect(() => {
        function handleResize() {
            windowWidth = window.innerWidth - 120; // Adjust for padding
            windowHeight = window.innerHeight - 120;
        }

        // Initial update
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<!-- Title bar always LTR for macOS traffic lights placement -->
<header class="flex h-8 shrink-0 items-center bg-(--color-titlebar-bg) px-3" dir="ltr">
    <TrafficLights />

    <span class="flex-1 text-center text-sm text-text-secondary" dir={isRtl ? 'rtl' : 'ltr'}> {displayTitle}</span>

    <!-- Spacer to balance traffic lights -->
    <div class="w-14"></div>
</header>
