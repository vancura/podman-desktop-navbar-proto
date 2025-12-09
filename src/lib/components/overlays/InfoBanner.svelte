<!--
  InfoBanner Component
  Full-screen overlay with informational message.
-->
<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';

    const banner = $derived(appState.ui.banner);
    const title = $derived(banner ? t(banner.titleKey as TranslationKey) : '');
    const description = $derived(banner ? t(banner.descriptionKey as TranslationKey) : '');

    function handleClick() {
        actions.hideBanner();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && banner) {
            actions.hideBanner();
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if banner}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-[var(--z-banner)] flex items-center justify-center bg-[var(--color-overlay-bg)]"
        onclick={handleClick}
    >
        <div
            class="mx-4 max-w-md rounded-lg border border-[var(--color-banner-border)] bg-[var(--color-banner-bg)] p-6 text-center shadow-2xl"
        >
            <h2 class="text-lg font-semibold text-[var(--color-banner-text)]">{title}</h2>
            <p class="mt-2 text-sm text-[var(--color-banner-text-secondary)]">{description}</p>
            <p class="mt-4 text-xs text-[var(--color-banner-text-secondary)]">
                {t('banner.clickToDismiss' as TranslationKey)}
            </p>
        </div>
    </div>
{/if}
