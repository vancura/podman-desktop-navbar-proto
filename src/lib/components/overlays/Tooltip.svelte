<!--
  Tooltip Component
  Displays item name and keyboard shortcut on hover.
-->
<script lang="ts">
    import { formatShortcut, t, type TranslationKey } from '../../i18n/index.js';
    import type { NavItem } from '../../state/types.js';

    interface Props {
        item: NavItem;
        x: number;
        y: number;
    }

    const { item, x, y }: Props = $props();

    const label = $derived(t(item.labelKey as TranslationKey));
    const shortcut = $derived(item.shortcut ? formatShortcut(item.shortcut) : null);
</script>

<div
    class="pointer-events-none fixed z-[var(--z-tooltip)] rounded-md border border-[var(--color-tooltip-border)] bg-[var(--color-tooltip-bg)] px-2.5 py-1.5 text-sm shadow-lg"
    style="left: {x}px; top: {y}px;"
>
    <span class="text-[var(--color-tooltip-text)]">{label}</span>
    {#if shortcut}
        <span class="ml-2 text-[var(--color-tooltip-shortcut)]">{shortcut}</span>
    {/if}
</div>

