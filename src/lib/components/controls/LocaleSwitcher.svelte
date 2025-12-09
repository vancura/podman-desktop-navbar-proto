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
            class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors
                {currentLocale === code
                    ? 'bg-[var(--color-focus-ring)] text-white'
                    : 'bg-[var(--color-button-bg)] text-[var(--color-button-text)] hover:bg-[var(--color-button-bg-hover)]'}"
            onclick={() => handleLocaleChange(code)}
        >
            {name}
        </button>
    {/each}
</div>
