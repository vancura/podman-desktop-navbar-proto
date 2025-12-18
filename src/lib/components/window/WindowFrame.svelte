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
    import Tooltip from '../overlays/Tooltip.svelte';
    import ContentArea from './ContentArea.svelte';
    import StatusBar from './StatusBar.svelte';
    import TitleBar from './TitleBar.svelte';

    const isRtl = $derived(appState.isRtl);
</script>

<div
    class="flex h-screen w-full items-center justify-center bg-canvas-bg p-10"
    style="padding-top: 60px; padding-left: 60px; padding-right: 60px; padding-bottom: 60px;"
    dir={isRtl ? 'rtl' : 'ltr'}
>
    <div
        class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-window-bg shadow-2xl ring-2 ring-window-border"
    >
        <TitleBar />

        <!-- Main content area with navbar - dir="rtl" handles the visual reversal -->
        <div class="flex flex-1 overflow-hidden py-px">
            <Navbar />

            <ContentArea>
                {#snippet children()}
                    <div class="flex flex-1 items-start justify-center overflow-auto p-4">
                        <ControlPanel />
                    </div>
                {/snippet}
            </ContentArea>
        </div>

        <StatusBar />
    </div>
</div>

<!-- Global overlays -->
<Tooltip />
<ContextMenu />
<MoreMenu />
<InfoBanner />
<ModalDialog />
