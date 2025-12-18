<!--
  LocaleSwitcher Component
  Language selector buttons.
-->

<script lang="ts">
    import { AVAILABLE_LOCALES } from '../../i18n/index.js';
    import { actions, appState } from '../../state/app-state.svelte.js';
    import type { Locale } from '../../state/types.js';

    const currentLocale = $derived(appState.locale);

    function handleLocaleChange(newLocale: Locale) {
        actions.setLocale(newLocale);
    }
</script>

<div class="flex flex-wrap gap-2">
    {#each AVAILABLE_LOCALES as { code, name } (code)}
        <button
            type="button"
            class="rounded-lg bg-button-bg px-3 py-2 text-sm shadow-xs text-button-text
                {currentLocale === code ? 'bg-focus-ring text-white' : 'bg-button-bg text-button-text'}"
            onclick={() => handleLocaleChange(code)}
        >
            {name}
        </button>
    {/each}
</div>
