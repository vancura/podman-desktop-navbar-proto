<!--
  ActionButton Component
  Button for control actions in the content area.
-->
<script lang="ts">
    interface Props {
        onclick?: () => void;
        disabled?: boolean;
        children: import('svelte').Snippet;
    }

    const { onclick, disabled = false, children }: Props = $props();
</script>

<button
    type="button"
    class="rounded-md bg-[var(--color-button-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-button-text)] transition-colors
        hover:bg-[var(--color-button-bg-hover)]
        active:bg-[var(--color-button-bg-active)]
        disabled:cursor-not-allowed disabled:opacity-50"
    {onclick}
    {disabled}
>
    {@render children()}
</button>

