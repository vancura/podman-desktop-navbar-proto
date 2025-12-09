<!--
  ContentArea Component
  Main content area with control buttons for testing.
-->
<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children?: Snippet;
    }

    const { children }: Props = $props();
</script>

<main class="flex flex-1 flex-col overflow-hidden bg-[var(--color-content-bg)]">
    {#if children}
        {@render children()}
    {:else}
        <div class="flex flex-1 items-center justify-center">
            <p class="text-[var(--color-text-muted)]">Content Area</p>
        </div>
    {/if}
</main>

