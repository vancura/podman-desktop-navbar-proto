import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), svelte()],

    build: {
        target: 'es2022',
        sourcemap: true,
        emptyOutDir: true,
    },

    server: {
        open: true,
    },
});
