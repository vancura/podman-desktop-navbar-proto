<!--
  ContentArea Component
  Main content area container.
-->

<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children: Snippet;
    }

    const { children }: Props = $props();
</script>

<main class="flex flex-1 flex-col overflow-hidden bg-(--color-content-bg) ps-px">{@render children()}</main>
