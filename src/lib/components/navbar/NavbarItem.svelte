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
    const showKeyboardShortcuts = $derived(appState.ui.showKeyboardShortcuts);

    interface Props {
        navItem: NavItem;
        isExpanded: boolean;
        isActive?: boolean;
        isFocused?: boolean;
        isPinned?: boolean;
        keyboardShortcut?: string;
        onclick?: () => void;
        oncontextmenu?: (e: MouseEvent) => void;
    }

    const {
        navItem,
        isExpanded,
        isActive = false,
        isFocused = false,
        isPinned = false,
        keyboardShortcut,
        onclick,
        oncontextmenu,
    }: Props = $props();

    // Re-derive when locale changes (tracked via appState.locale)
    const _locale = $derived(appState.locale);
    const label = $derived(t(navItem.labelKey as TranslationKey));
    const heightClass = $derived(isExpanded ? 'h-14' : 'h-11');

    // Show tooltip only when collapsed (icon-only mode)
    const shouldShowTooltip = $derived(!isExpanded);

    // Reference to the button element for programmatic focus
    let buttonElement: HTMLButtonElement | null = $state(null);

    // Auto-focus this button when it becomes focused via state
    $effect(() => {
        if (isFocused && buttonElement && document.activeElement !== buttonElement) {
            buttonElement.focus();
        }
    });

    // Determine if this item should be tabbable
    // When nothing is focused, the first essential item should be the default tab entry point
    const isDefaultTabbable = $derived(() => {
        if (isFocused) return true;
        if (appState.ui.focusedItemId !== null) return false;
        // Check if this is the first essential item
        const firstItem = appState.items.essential[0];
        return firstItem?.id === navItem.id;
    });

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

    function handleKeyDown(e: KeyboardEvent) {
        // Intercept Tab/Shift+Tab to keep navigation within navbar
        if (e.key === 'Tab') {
            e.preventDefault();
            // Navigate same as arrow keys: Tab = down, Shift+Tab = up
            const delta = e.shiftKey ? -1 : 1;

            // Get all visible items
            const { essential, pinned, regular, bottom } = appState.items;
            const allItems = [...essential, ...pinned, ...regular, ...bottom];

            const currentIndex = allItems.findIndex((i) => i.id === navItem.id);
            if (currentIndex !== -1) {
                const newIndex = (currentIndex + delta + allItems.length) % allItems.length;
                const nextItem = allItems[newIndex];
                if (nextItem) {
                    actions.setFocusedItem(nextItem.id);
                }
            }
        }
    }
</script>

{#key _locale}
    <button
        bind:this={buttonElement}
        type="button"
        class="focus-ring group flex w-full cursor-pointer items-center rounded-lg
        {isExpanded ? 'h-11 flex-row justify-start px-3' : 'h-11 flex-col justify-center'}
        {isActive ? 'bg-navbar-item-selected' : 'hover:bg-(--color-navbar-item-hover)'}
        {isFocused ? 'ring-2 ring-focus-ring ring-offset-2 ring-offset-navbar-bg' : ''}"
        tabindex={isDefaultTabbable ? 0 : -1}
        {onclick}
        {oncontextmenu}
        onfocus={() => actions.setFocusedItem(navItem.id)}
        onkeydown={handleKeyDown}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
    >
        <div class="relative">
            <Icon
                name={navItem.icon}
                size={isExpanded ? 24 : 18}
                class={isActive ? 'text-navbar-text-active' : 'text-navbar-text'}
            />

            {#if keyboardShortcut && showKeyboardShortcuts}
                <!-- Keyboard shortcut indicator -->
                <div
                    class="absolute left-[-22px] top-[-6px] flex items-center justify-center rounded-full border border-gray-300 bg-white px-1 py-0.5 text-[10px] font-medium leading-tight text-gray-500"
                >
                    {keyboardShortcut}
                </div>
            {/if}

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
                class="ml-3 max-w-full truncate text-[13px] font-medium leading-tight
                {isActive ? 'text-navbar-text-active' : 'text-navbar-text'}"
            >
                {label}
            </span>
        {/if}
    </button>
{/key}
