/**
 * Podman Desktop Navigation Bar Prototype
 * Entry point for the Svelte application.
 */

import { mount } from 'svelte';

import App from './App.svelte';
import './app.css';

const app = mount(App, {
    target: document.getElementById('app')!,
});

export default app;
