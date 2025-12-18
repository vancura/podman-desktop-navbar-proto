<!--
  InfoBanner Component
  Full-screen overlay with informational message.
  Always displayed in English (LTR) as it's a debug/testing feature.
-->

<script lang="ts">
    import { actions, appState } from '../../state/app-state.svelte.js';
    import { en } from '../../i18n/locales/en.js';
    import Backdrop from './Backdrop.svelte';

    const banner = $derived(appState.ui.banner);

    // Always use English translations for the banner (it's a debug feature)
    const title = $derived(banner ? (en[banner.titleKey as keyof typeof en] ?? banner.titleKey) : '');
    const description = $derived(banner ? (en[banner.descriptionKey as keyof typeof en] ?? banner.descriptionKey) : '');

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && banner) {
            actions.hideBanner();
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if banner}
    <Backdrop zIndex="z-banner" showOverlay onClose={() => actions.hideBanner()}>
        <!-- Always LTR - this is a debug/testing banner that stays in English -->
        <div class="mx-4 max-w-md rounded-3xl border bg-banner-bg p-6 text-center shadow-2xl" dir="ltr">
            <h2 class="text-2xl text-(--color-banner-text)">{title}</h2>
            <p class="mt-3 text-sm text-banner-text-secondary">{description}</p>
            <p class="mt-8 mb-1 text-sm text-banner-text-tertiary">Click anywhere to dismiss</p>
        </div>
    </Backdrop>
{/if}
