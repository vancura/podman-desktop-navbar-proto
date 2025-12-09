<!--
  ModalDialog Component
  Confirmation dialog with optional checkbox.
-->
<script lang="ts">
    import { t, type TranslationKey } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';

    const modalConfig = $derived(appState.ui.modalConfig);
    const checkboxChecked = $derived(appState.ui.modalCheckboxChecked);

    const title = $derived(modalConfig ? t(modalConfig.titleKey as TranslationKey) : '');
    const description = $derived(modalConfig ? t(modalConfig.descriptionKey as TranslationKey) : '');
    const checkboxLabel = $derived(modalConfig?.checkboxKey ? t(modalConfig.checkboxKey as TranslationKey) : null);

    function handleConfirm() {
        if (modalConfig) {
            modalConfig.onConfirm(checkboxChecked);
        }
        actions.hideModal();
    }

    function handleCancel() {
        actions.hideModal();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && modalConfig) {
            handleCancel();
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if modalConfig}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[var(--color-overlay-bg)]"
        onclick={handleCancel}
    >
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
        <div
            class="mx-4 w-full max-w-sm rounded-lg border border-[var(--color-banner-border)] bg-[var(--color-banner-bg)] p-6 shadow-2xl"
            onclick={(e) => e.stopPropagation()}
        >
            <h2 class="text-lg font-semibold text-[var(--color-banner-text)]">{title}</h2>
            <p class="mt-2 text-sm text-[var(--color-banner-text-secondary)]">{description}</p>

            {#if checkboxLabel}
                <label class="mt-4 flex items-center gap-2 text-sm text-[var(--color-banner-text-secondary)]">
                    <input
                        type="checkbox"
                        checked={checkboxChecked}
                        onchange={() => actions.toggleModalCheckbox()}
                        class="h-4 w-4 rounded border-[var(--color-button-border)] bg-[var(--color-button-bg)]"
                    />
                    {checkboxLabel}
                </label>
            {/if}

            <div class="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    class="rounded-md bg-[var(--color-button-bg)] px-4 py-2 text-sm font-medium text-[var(--color-button-text)] transition-colors hover:bg-[var(--color-button-bg-hover)]"
                    onclick={handleCancel}
                >
                    {t('modal.cancel' as TranslationKey)}
                </button>
                <button
                    type="button"
                    class="rounded-md bg-[var(--color-focus-ring)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                    onclick={handleConfirm}
                >
                    {t('modal.ok' as TranslationKey)}
                </button>
            </div>
        </div>
    </div>
{/if}
