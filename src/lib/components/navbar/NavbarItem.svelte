<!--
  NavbarItem Component
  Individual navigation item with icon and optional title.
-->
<script lang="ts">
    import type { NavItem } from '../../state/types.js';
    import { t, formatShortcut, type TranslationKey } from '../../i18n/index.js';
    import { appState } from '../../state/app-state.svelte.js';
    import Icon from '../Icon.svelte';

    interface Props {
        navItem: NavItem;
        isExpanded: boolean;
        isActive?: boolean;
        isFocused?: boolean;
        onclick?: () => void;
        oncontextmenu?: (e: MouseEvent) => void;
    }

    const { navItem, isExpanded, isActive = false, isFocused = false, onclick, oncontextmenu }: Props = $props();

    // Re-derive when locale changes (tracked via appState.locale)
    const _locale = $derived(appState.locale);
    const label = $derived(t(navItem.labelKey as TranslationKey));
    const shortcutDisplay = $derived(navItem.shortcut ? formatShortcut(navItem.shortcut) : null);
    const heightClass = $derived(isExpanded ? 'h-14' : 'h-11');
    const tooltipText = $derived(!isExpanded ? `${label}${shortcutDisplay ? ` (${shortcutDisplay})` : ''}` : undefined);
</script>

{#key _locale}
<button
    type="button"
    class="focus-ring group flex w-full cursor-pointer flex-col items-center justify-center rounded-lg transition-colors duration-100
        {heightClass}
        {isActive ? 'bg-[var(--color-navbar-item-selected)]' : 'hover:bg-[var(--color-navbar-item-hover)]'}
        {isFocused ? 'ring-2 ring-[var(--color-focus-ring)] ring-offset-2 ring-offset-[var(--color-navbar-bg)]' : ''}"
    {onclick}
    {oncontextmenu}
    title={tooltipText}
>
    <Icon
        name={navItem.icon}
        variant={navItem.iconVariant}
        size={isExpanded ? 24 : 20}
        class={isActive ? 'text-[var(--color-navbar-text-active)]' : 'text-[var(--color-navbar-text)]'}
    />

    {#if isExpanded}
        <span
            class="mt-1 max-w-full truncate px-1 text-[11px] font-medium leading-tight
                {isActive ? 'text-[var(--color-navbar-text-active)]' : 'text-[var(--color-navbar-text)]'}"
        >
            {label}
        </span>
    {/if}
</button>
{/key}
