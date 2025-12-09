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
        item: NavItem;
        isExpanded: boolean;
        isActive?: boolean;
        isFocused?: boolean;
        onclick?: () => void;
        oncontextmenu?: (e: MouseEvent) => void;
    }

    const { item, isExpanded, isActive = false, isFocused = false, onclick, oncontextmenu }: Props = $props();

    // Force re-translation when locale changes
    const locale = $derived(appState.locale);
    const label = $derived(t(item.labelKey as TranslationKey));
    const shortcut = $derived(item.shortcut ? formatShortcut(item.shortcut) : null);

    /** Height changes based on expanded state. */
    const itemHeight = $derived(isExpanded ? 'h-14' : 'h-11');
</script>

{#key locale}
<button
    type="button"
    class="focus-ring group flex w-full cursor-pointer flex-col items-center justify-center rounded-lg transition-colors duration-100
        {itemHeight}
        {isActive ? 'bg-[var(--color-navbar-item-selected)]' : 'hover:bg-[var(--color-navbar-item-hover)]'}
        {isFocused ? 'ring-2 ring-[var(--color-focus-ring)] ring-offset-2 ring-offset-[var(--color-navbar-bg)]' : ''}"
    {onclick}
    {oncontextmenu}
    title={!isExpanded ? `${label}${shortcut ? ` (${shortcut})` : ''}` : undefined}
>
    <Icon
        name={item.icon}
        variant={item.iconVariant}
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
