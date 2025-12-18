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
    class="rounded-lg bg-button-bg px-3 py-2 text-sm shadow-sm text-button-text
        active:bg-button-bg-active
        disabled:cursor-not-allowed disabled:opacity-50"
    {onclick}
    {disabled}
>
    {@render children()}
</button>
