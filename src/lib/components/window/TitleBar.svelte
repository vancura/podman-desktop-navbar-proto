<!--
  TitleBar Component
  macOS-style title bar with traffic lights and centered title.
-->
<script lang="ts">
    import { appState } from '../../state/app-state.svelte.js';
    import TrafficLights from './TrafficLights.svelte';

    interface Props {
        title?: string;
    }

    const { title = 'Podman Desktop' }: Props = $props();
    const isRtl = $derived(appState.isRtl);
</script>

<!-- Title bar always LTR for macOS traffic lights placement -->
<header class="flex h-8 shrink-0 items-center bg-[var(--color-titlebar-bg)] px-3" dir="ltr">
    <TrafficLights />
    <span class="flex-1 text-center text-sm text-[var(--color-text-secondary)]" dir={isRtl ? 'rtl' : 'ltr'}>
        {title}
    </span>
    <!-- Spacer to balance traffic lights -->
    <div class="w-14"></div>
</header>
