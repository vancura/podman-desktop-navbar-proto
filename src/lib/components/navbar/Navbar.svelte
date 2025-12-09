<!--
  Navbar Component
  Main navigation bar container with panels and resize handle.
-->
<script lang="ts">
    import { actions, appState } from '../../state/app-state.svelte.js';
    import FadeGradient from '../scrollbar/FadeGradient.svelte';
    import NavbarDivider from './NavbarDivider.svelte';
    import NavbarItem from './NavbarItem.svelte';
    import ResizeHandle from './ResizeHandle.svelte';

    const items = $derived(appState.items);
    const isExpanded = $derived(appState.isExpanded);
    const navbarWidth = $derived(appState.navbarWidth);
    const hasPinnedItems = $derived(appState.hasPinnedItems);
    const hasHiddenItems = $derived(appState.hasHiddenItems);
    const activeItemId = $derived(appState.ui.activeItemId);
    const focusedItemId = $derived(appState.ui.focusedItemId);

    // Scroll state for fade gradients
    let scrollContainer: HTMLElement | null = $state(null);
    let scrollTop = $state(0);
    let scrollHeight = $state(0);
    let clientHeight = $state(0);

    const showTopFade = $derived(scrollTop > 0);
    const showBottomFade = $derived(scrollTop + clientHeight < scrollHeight - 1);

    function handleScroll() {
        if (scrollContainer) {
            scrollTop = scrollContainer.scrollTop;
            scrollHeight = scrollContainer.scrollHeight;
            clientHeight = scrollContainer.clientHeight;
        }
    }

    function handleItemClick(itemId: string) {
        actions.setActiveItem(itemId);
        actions.setFocusedItem(itemId);
        actions.showBanner('banner.featureOutOfScope', 'banner.featureOutOfScopeDesc');
    }

    function handleItemContextMenu(e: MouseEvent, itemId: string) {
        e.preventDefault();
        e.stopPropagation(); // Prevent bubbling to nav element
        actions.showContextMenu(e.clientX, e.clientY, itemId);
    }

    function handleEmptyContextMenu(e: MouseEvent) {
        e.preventDefault();
        actions.showContextMenu(e.clientX, e.clientY, null);
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<nav
    class="relative flex shrink-0 flex-col bg-[var(--color-navbar-bg)]"
    style="width: {navbarWidth}px;"
    aria-label="Main Navigation"
    oncontextmenu={handleEmptyContextMenu}
>
    <!-- Scrollable content area -->
    <div
        bind:this={scrollContainer}
        class="navbar-scrollbar relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-2"
        onscroll={handleScroll}
    >
        <!-- Top fade gradient -->
        <FadeGradient position="top" visible={showTopFade} />

        <!-- Essential items (always visible) -->
        <div class="flex flex-col gap-1">
            {#each items.essential as navItem (navItem.id)}
                <NavbarItem
                    {navItem}
                    {isExpanded}
                    isActive={activeItemId === navItem.id}
                    isFocused={focusedItemId === navItem.id}
                    onclick={() => handleItemClick(navItem.id)}
                    oncontextmenu={(e) => handleItemContextMenu(e, navItem.id)}
                />
            {/each}
        </div>

        <!-- Pinned items (if any) -->
        {#if hasPinnedItems}
            <NavbarDivider />
            <div class="flex flex-col gap-1">
                {#each items.pinned as navItem (navItem.id)}
                    <NavbarItem
                        {navItem}
                        {isExpanded}
                        isActive={activeItemId === navItem.id}
                        isFocused={focusedItemId === navItem.id}
                        onclick={() => handleItemClick(navItem.id)}
                        oncontextmenu={(e) => handleItemContextMenu(e, navItem.id)}
                    />
                {/each}
            </div>
        {/if}

        <!-- Regular items -->
        {#if items.regular.length > 0}
            <NavbarDivider />
            <div class="flex flex-col gap-1">
                {#each items.regular as navItem (navItem.id)}
                    <NavbarItem
                        {navItem}
                        {isExpanded}
                        isActive={activeItemId === navItem.id}
                        isFocused={focusedItemId === navItem.id}
                        onclick={() => handleItemClick(navItem.id)}
                        oncontextmenu={(e) => handleItemContextMenu(e, navItem.id)}
                    />
                {/each}
            </div>
        {/if}

        <!-- Spacer to push bottom panel down -->
        <div class="flex-1"></div>

        <!-- Bottom fade gradient -->
        <FadeGradient position="bottom" visible={showBottomFade} />
    </div>

    <!-- More button (if hidden items exist) -->
    {#if hasHiddenItems}
        <div class="px-2 pb-1">
            <button
                type="button"
                class="flex h-8 w-full items-center justify-center gap-1 rounded-lg text-sm text-[var(--color-navbar-text)] transition-colors hover:bg-[var(--color-navbar-item-hover)]"
                onclick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    actions.showMoreMenu(rect.left, rect.top);
                }}
            >
                <span>{items.hidden.length} more</span>
            </button>
        </div>
    {/if}

    <!-- Bottom panel (Settings, Account) -->
    <NavbarDivider />
    <div class="flex flex-col gap-1 p-2 pt-0">
        {#each items.bottom as navItem (navItem.id)}
            <NavbarItem
                {navItem}
                {isExpanded}
                isActive={activeItemId === navItem.id}
                isFocused={focusedItemId === navItem.id}
                onclick={() => handleItemClick(navItem.id)}
                oncontextmenu={(e) => handleItemContextMenu(e, navItem.id)}
            />
        {/each}
    </div>

    <!-- Resize handle -->
    <ResizeHandle />
</nav>
