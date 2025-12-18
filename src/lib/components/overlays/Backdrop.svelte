<!--
  Backdrop Component
  Reusable overlay backdrop for modals, menus, and dialogs.
  Handles click-outside dismissal and provides consistent styling.
-->

<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        /** Z-index layer (uses CSS custom property name). */
        zIndex: 'z-context-menu' | 'z-modal' | 'z-banner';

        /** Whether to show semi-transparent background. */
        showOverlay?: boolean;

        /** Called when backdrop is clicked. */
        onClose: () => void;

        /** Content to render inside the backdrop. */
        children: Snippet;
    }

    const { zIndex, showOverlay = false, onClose, children }: Props = $props();

    /** Map z-index prop to CSS custom property value. */
    const zIndexValue = $derived(
        {
            'z-context-menu': 'var(--z-context-menu)',
            'z-modal': 'var(--z-modal)',
            'z-banner': 'var(--z-banner)',
        }[zIndex],
    );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    class="fixed inset-0"
    class:bg-[var(--color-overlay-bg)]={showOverlay}
    class:flex={showOverlay}
    class:items-center={showOverlay}
    class:justify-center={showOverlay}
    style="z-index: {zIndexValue};"
    onclick={onClose}
    role="presentation"
>
    {@render children()}
</div>
