<!--
  ModalDialog Component
  Confirmation dialog with optional checkbox.
  Always displayed in English (LTR) as it's a debug/testing feature.
-->

<script lang="ts">
    import { actions, appState } from '../../state/app-state.svelte.js';
    import { en } from '../../i18n/locales/en.js';
    import Backdrop from './Backdrop.svelte';

    const modalConfig = $derived(appState.ui.modalConfig);
    const checkboxChecked = $derived(appState.ui.modalCheckboxChecked);

    // Always use English translations (it's a debug feature)
    const title = $derived(modalConfig ? (en[modalConfig.titleKey as keyof typeof en] ?? modalConfig.titleKey) : '');

    const description = $derived(
        modalConfig ? (en[modalConfig.descriptionKey as keyof typeof en] ?? modalConfig.descriptionKey) : '',
    );

    const checkboxLabel = $derived(
        modalConfig?.checkboxKey ? (en[modalConfig.checkboxKey as keyof typeof en] ?? modalConfig.checkboxKey) : null,
    );

    function handleConfirm() {
        if (modalConfig) {
            modalConfig.onConfirm(checkboxChecked);
        }
        actions.hideModal();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && modalConfig) {
            actions.hideModal();
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if modalConfig}
    <Backdrop zIndex="z-modal" showOverlay onClose={() => actions.hideModal()}>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- Always LTR - this is a debug/testing modal that stays in English -->
        <div
            class="mx-4 w-full max-w-sm rounded-lg border border-(--color-banner-border) bg-banner-bg p-6 shadow-2xl"
            dir="ltr"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabindex="-1"
        >
            <h2 id="modal-title" class="text-lg font-semibold text-(--color-banner-text)">{title}</h2>

            <p class="mt-2 text-sm text-(--color-banner-text-secondary)">{description}</p>

            {#if checkboxLabel}
                <label class="mt-4 flex items-center gap-2 text-sm text-(--color-banner-text-secondary)">
                    <input
                        type="checkbox"
                        checked={checkboxChecked}
                        onchange={() => actions.toggleModalCheckbox()}
                        class="h-4 w-4 rounded border-button-border bg-button-bg"
                    />
                    {checkboxLabel}
                </label>
            {/if}

            <div class="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    class="rounded-md bg-button-bg px-4 py-2 text-sm font-medium text-(--color-button-text)"
                    onclick={() => actions.hideModal()}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="rounded-md bg-(--color-focus-ring) px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    onclick={handleConfirm}
                >
                    OK
                </button>
            </div>
        </div>
    </Backdrop>
{/if}
