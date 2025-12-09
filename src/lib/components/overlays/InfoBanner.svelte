<!--
  InfoBanner Component
  Full-screen overlay with informational message.
-->
<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import Backdrop from './Backdrop.svelte';

    const banner = $derived(appState.ui.banner);
    const title = $derived(banner ? t(banner.titleKey as TranslationKey) : '');
    const description = $derived(banner ? t(banner.descriptionKey as TranslationKey) : '');

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && banner) {
            actions.hideBanner();
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if banner}
    <Backdrop zIndex="z-banner" showOverlay onClose={() => actions.hideBanner()}>
        <div
            class="mx-4 max-w-md rounded-lg border border-[var(--color-banner-border)] bg-[var(--color-banner-bg)] p-6 text-center shadow-2xl"
        >
            <h2 class="text-lg font-semibold text-[var(--color-banner-text)]">{title}</h2>
            <p class="mt-2 text-sm text-[var(--color-banner-text-secondary)]">{description}</p>
            <p class="mt-4 text-xs text-[var(--color-banner-text-secondary)]">
                {t('banner.clickToDismiss' as TranslationKey)}
            </p>
        </div>
    </Backdrop>
{/if}
