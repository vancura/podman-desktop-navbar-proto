<!--
  Tooltip Component
  Global tooltip overlay that displays item name and keyboard shortcut on hover.
  Only shown when navbar is in collapsed (icon-only) mode.
  Supports RTL layouts by positioning tooltip on the appropriate side.
-->

<script lang="ts">
    import { formatShortcut, t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';

    const tooltip = $derived(appState.ui.tooltip);
    const targetItem = $derived(tooltip?.itemId ? actions.findItem(tooltip.itemId) : null);
    const isRtl = $derived(appState.isRtl);
    const locale = $derived(appState.locale);

    const label = $derived(targetItem ? t(targetItem.labelKey as TranslationKey) : '');
    const shortcut = $derived(targetItem?.shortcut ? formatShortcut(targetItem.shortcut) : null);

    // Position tooltip with offset, adjusting for RTL
    // In RTL mode, x coordinate represents the left edge of the item (tooltip goes left)
    // In LTR mode, x coordinate represents the right edge of the item (tooltip goes right)
    const tooltipStyle = $derived.by(() => {
        if (!tooltip) return '';

        const offset = 8;
        const y = tooltip.y;

        if (isRtl) {
            // In RTL, position tooltip to the left of the item
            // Use 'right' positioning from the right edge of the viewport
            const rightPos = window.innerWidth - tooltip.x + offset;
            return `right: ${rightPos}px; top: ${y}px; transform: translateY(-50%);`;
        } else {
            // In LTR, position tooltip to the right of the item
            return `left: ${tooltip.x}px; top: ${y}px; transform: translateY(-50%);`;
        }
    });
</script>

{#if tooltip && targetItem}
    {#key locale}
        <div
            class="pointer-events-none fixed z-(--z-tooltip) whitespace-nowrap rounded-md border border-tooltip-border bg-tooltip-bg px-2.5 py-1.5 text-sm shadow-lg"
            style={tooltipStyle}
            role="tooltip"
        >
            <span class="text-tooltip-text">{label}</span>

            {#if shortcut}
                <span class="ms-2 text-(--color-tooltip-shortcut)">{shortcut}</span>
            {/if}
        </div>
    {/key}
{/if}
