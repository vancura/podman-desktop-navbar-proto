<!--
  Podman Desktop Navigation Bar Prototype
  Root application component.
-->
<script lang="ts">
    import { onMount } from 'svelte';
    import WindowFrame from './lib/components/window/WindowFrame.svelte';
    import { initKeyboardHandling } from './lib/utils/keyboard.js';

    onMount(() => {
        // Initialize keyboard shortcuts
        const cleanup = initKeyboardHandling();
        return cleanup;
    });
</script>

<WindowFrame />
