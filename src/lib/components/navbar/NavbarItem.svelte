<!--
  NavbarItem Component
  Individual navigation item with icon and optional title.
-->

<script lang="ts">
    import type { NavItem } from '../../state/types.js';
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import Icon from '../Icon.svelte';

    const isRtl = $derived(appState.isRtl);

    interface Props {
        navItem: NavItem;
        isExpanded: boolean;
        isActive?: boolean;
        isFocused?: boolean;
        isPinned?: boolean;
        onclick?: () => void;
        oncontextmenu?: (e: MouseEvent) => void;
    }

    const {
        navItem,
        isExpanded,
        isActive = false,
        isFocused = false,
        isPinned = false,
        onclick,
        oncontextmenu,
    }: Props = $props();

    // Re-derive when locale changes (tracked via appState.locale)
    const _locale = $derived(appState.locale);
    const label = $derived(t(navItem.labelKey as TranslationKey));
    const heightClass = $derived(isExpanded ? 'h-14' : 'h-11');

    // Show tooltip only when collapsed (icon-only mode)
    const shouldShowTooltip = $derived(!isExpanded);

    function handleMouseEnter(e: MouseEvent) {
        if (!shouldShowTooltip) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        // Position tooltip to the appropriate side based on RTL mode
        // In RTL: tooltip goes to the left of the item (pass left edge)
        // In LTR: tooltip goes to the right of the item (pass right edge)
        const x = isRtl ? rect.left : rect.right + 8;
        const y = rect.top + rect.height / 2;

        actions.showTooltip(x, y, navItem.id);
    }

    function handleMouseLeave() {
        actions.hideTooltip();
    }
</script>

{#key _locale}
    <button
        type="button"
        class="focus-ring group flex w-full cursor-pointer flex-col items-center justify-center rounded-lg
        {heightClass}
        {isActive ? 'bg-navbar-item-selected' : 'hover:bg-(--color-navbar-item-hover)'}
        {isFocused ? 'ring-2 ring-focus-ring ring-offset-2 ring-offset-navbar-bg' : ''}"
        {onclick}
        {oncontextmenu}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
    >
        <div class="relative">
            <Icon
                name={navItem.icon}
                size={isExpanded ? 24 : 20}
                class={isActive ? 'text-navbar-text-active' : 'text-navbar-text'}
            />

            {#if isPinned}
                <div
                    class="absolute -bottom-1 -right-2 rounded-full p-0.5 {isActive
                        ? 'bg-navbar-item-selected'
                        : 'bg-navbar-bg'}"
                >
                    <Icon name="pin" size={10} class={isActive ? 'text-navbar-text-active' : 'text-navbar-text'} />
                </div>
            {/if}
        </div>

        {#if isExpanded}
            <span
                class="mt-1 max-w-full truncate px-1 text-[11px] font-medium leading-tight
                {isActive ? 'text-navbar-text-active' : 'text-navbar-text'}"
            >
                {label}
            </span>
        {/if}
    </button>
{/key}
