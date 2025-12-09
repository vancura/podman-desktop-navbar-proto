<!--
  WindowFrame Component
  macOS-style window container with title bar, navbar, content area, and status bar.
-->
<script lang="ts">
    import { appState } from '../../state/app-state.svelte.js';
    import ControlPanel from '../controls/ControlPanel.svelte';
    import Navbar from '../navbar/Navbar.svelte';
    import ContextMenu from '../overlays/ContextMenu.svelte';
    import InfoBanner from '../overlays/InfoBanner.svelte';
    import ModalDialog from '../overlays/ModalDialog.svelte';
    import MoreMenu from '../overlays/MoreMenu.svelte';
    import ContentArea from './ContentArea.svelte';
    import StatusBar from './StatusBar.svelte';
    import TitleBar from './TitleBar.svelte';

    const isRtl = $derived(appState.isRtl);
</script>

<div
    class="flex h-screen w-full items-center justify-center bg-[var(--color-window-bg)] p-10"
    style="padding-top: 54px; padding-left: 40px; padding-right: 40px; padding-bottom: 40px;"
    dir={isRtl ? 'rtl' : 'ltr'}
>
    <div
        class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-[var(--color-window-bg)] shadow-2xl ring-2 ring-[var(--color-window-border)]"
    >
        <TitleBar title="Podman Desktop Navigation Bar Prototype" />

        <div class="flex flex-1 overflow-hidden" class:flex-row-reverse={isRtl}>
            <Navbar />
            <ContentArea>
                {#snippet children()}
                    <div class="flex flex-1 items-center justify-center overflow-auto p-4">
                        <ControlPanel />
                    </div>
                {/snippet}
            </ContentArea>
        </div>

        <StatusBar />
    </div>
</div>

<!-- Global overlays -->
<ContextMenu />
<MoreMenu />
<InfoBanner />
<ModalDialog />
