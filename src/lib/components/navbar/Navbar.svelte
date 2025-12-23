<!--
  Navbar Component
  Main navigation bar container with panels and resize handle.
-->

<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import { formatKeyboardShortcut, subscribeToPlatformChanges } from '../../utils/keyboard.js';
    import Icon from '../Icon.svelte';
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
    const locale = $derived(appState.locale);

    // Reactive state for platform changes - increments to force re-computation
    let platformChangeCount = $state(0);

    // Subscribe to platform override changes
    $effect(() => {
        const unsubscribe = subscribeToPlatformChanges(() => {
            platformChangeCount++;
        });
        return unsubscribe;
    });

    // Helper function to get keyboard shortcut for specific item IDs
    // Made reactive by depending on platformChangeCount
    function getKeyboardShortcut(itemId: string): string | undefined {
        // Access platformChangeCount to create reactive dependency
        platformChangeCount;

        const shortcuts: Record<string, string> = {
            containers: formatKeyboardShortcut({ cmd: true, key: '1' }),
            images: formatKeyboardShortcut({ cmd: true, key: '2' }),
            pods: formatKeyboardShortcut({ cmd: true, key: '3' }),
            volumes: formatKeyboardShortcut({ cmd: true, key: '4' }),
            kubernetes: formatKeyboardShortcut({ cmd: true, key: '5' }),
            terminal: hasPinnedItems ? '' : formatKeyboardShortcut({ cmd: true, key: '6' }),
            settings: formatKeyboardShortcut({ cmd: true, key: '0' }),
        };
        return shortcuts[itemId] || undefined;
    }

    // Helper function to get keyboard shortcut for pinned items by index
    // Made reactive by depending on platformChangeCount
    function getPinnedKeyboardShortcut(index: number): string | undefined {
        // Access platformChangeCount to create reactive dependency
        platformChangeCount;

        if (index >= 0 && index < 4) {
            return formatKeyboardShortcut({ cmd: true, key: String(index + 6) });
        }
        return undefined;
    }

    // Translated "more" text (without count)
    const moreButtonText = $derived(t('nav.more' as TranslationKey));
    const hiddenItemCount = $derived(items.hidden.length);

    // Scroll state for fade gradients
    let scrollContainer: HTMLElement | null = $state(null);
    let scrollTop = $state(0);
    let scrollHeight = $state(0);
    let clientHeight = $state(0);

    // Calculate opacity for bottom fade (0-1) based on distance from bottom
    // Fades out in the last 100pt: 100% visible until last 100pt, then fades to 0%
    const bottomFadeOpacity = $derived.by(() => {
        if (scrollHeight === 0) return 1; // Show on initial load

        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        if (distanceFromBottom >= 100) return 1; // 100% visible when more than 100pt from bottom
        if (distanceFromBottom <= 0) return 0; // 0% visible at the end

        return distanceFromBottom / 100; // Gradual fade from 100% to 0% in last 100pt
    });

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

{#key locale}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <nav
        class="relative flex shrink-0 flex-col bg-navbar-bg"
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
            <!-- Essential items (always visible) -->
            <div class="flex flex-col gap-1">
                {#each items.essential as navItem (navItem.id)}
                    <NavbarItem
                        {navItem}
                        {isExpanded}
                        isActive={activeItemId === navItem.id}
                        isFocused={focusedItemId === navItem.id}
                        keyboardShortcut={getKeyboardShortcut(navItem.id) || ''}
                        onclick={() => handleItemClick(navItem.id)}
                        oncontextmenu={(e) => handleItemContextMenu(e, navItem.id)}
                    />
                {/each}
            </div>

            <!-- Pinned items (if any) -->
            {#if hasPinnedItems}
                <NavbarDivider />

                <div class="flex flex-col gap-1">
                    {#each items.pinned as navItem, index (navItem.id)}
                        <NavbarItem
                            {navItem}
                            {isExpanded}
                            isActive={activeItemId === navItem.id}
                            isFocused={focusedItemId === navItem.id}
                            isPinned={true}
                            keyboardShortcut={getPinnedKeyboardShortcut(index) || ''}
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
                            keyboardShortcut={getKeyboardShortcut(navItem.id) || ''}
                            onclick={() => handleItemClick(navItem.id)}
                            oncontextmenu={(e) => handleItemContextMenu(e, navItem.id)}
                        />
                    {/each}
                </div>
            {/if}

            <!-- Spacer to push bottom panel down -->
            <div class="flex-1"></div>
        </div>

        <!-- More button (if hidden items exist) -->
        {#if hasHiddenItems}
            <div class="px-6 pb-1 z-10">
                <button
                    type="button"
                    class="flex h-8 w-full items-center justify-start gap-2 rounded-lg text-[11px] font-medium leading-tight text-navbar-text"
                    onclick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        actions.showMoreMenu(rect.left, rect.top);
                    }}
                >
                    <Icon name="pen" size={14} class="text-navbar-text" />
                    <span>{moreButtonText}</span>
                    <span
                        class="flex h-5 w-5 items-center justify-center rounded-full bg-navbar-text text-navbar-bg text-[11px] font-medium leading-tight"
                    >
                        {hiddenItemCount}
                    </span>
                </button>
            </div>
        {/if}

        {#if bottomFadeOpacity > 0}
            <div
                class="absolute w-full left-0 bg-linear-to-b pointer-events-none h-30 from-transparent to-navbar-bg {isExpanded
                    ? 'my-[-48px]'
                    : 'my-[-24px]'} "
                style="bottom: {isExpanded ? '158px' : '134px'}; opacity: {bottomFadeOpacity};"
                aria-hidden="true"
            ></div>
        {/if}

        <NavbarDivider />

        <!-- Bottom panel (Settings, Account) -->
        <div class="flex flex-col gap-1 p-2 pt-0">
            {#each items.bottom as navItem (navItem.id)}
                <NavbarItem
                    {navItem}
                    {isExpanded}
                    isActive={activeItemId === navItem.id}
                    isFocused={focusedItemId === navItem.id}
                    keyboardShortcut={getKeyboardShortcut(navItem.id) || ''}
                    onclick={() => handleItemClick(navItem.id)}
                    oncontextmenu={(e) => handleItemContextMenu(e, navItem.id)}
                />
            {/each}
        </div>

        <!-- Resize handle -->
        <ResizeHandle />
    </nav>
{/key}
