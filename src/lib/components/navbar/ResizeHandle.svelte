<!--
  ResizeHandle Component
  Draggable handle for resizing the navbar width.
-->

<script lang="ts">
    import { actions, appState } from '../../state/app-state.svelte.js';
    import { NAVBAR } from '../../utils/constants.js';

    let isDragging = $state(false);
    let startX = $state(0);
    let startWidth = $state(0);

    const isRtl = $derived(appState.isRtl);

    function handleMouseDown(e: MouseEvent) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startWidth = appState.navbarWidth;
        actions.startResizeDrag();

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const newWidth = isRtl ? startWidth - deltaX : startWidth + deltaX;
        const clampedWidth = Math.max(NAVBAR.minWidth, Math.min(NAVBAR.maxWidth, newWidth));

        actions.setNavbarWidth(clampedWidth);
    }

    function handleMouseUp() {
        isDragging = false;
        actions.endResizeDrag();

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && isDragging) {
            isDragging = false;
            actions.setNavbarWidth(startWidth);
            actions.endResizeDrag();

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }
</script>

<svelte:window onkeydown={handleKeyDown} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="group absolute top-0 z-(--z-resize) h-full w-3 cursor-col-resize
        {isRtl ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}"
    onmousedown={handleMouseDown}
    role="separator"
    aria-orientation="vertical"
    aria-valuenow={appState.navbarWidth}
    aria-valuemin={NAVBAR.minWidth}
    aria-valuemax={NAVBAR.maxWidth}
>
    <div
        class="absolute top-0 h-full w-1 transition-all
            {isRtl ? 'left-1/2 -translate-x-1/2' : 'right-1/2 translate-x-1/2'}
            {isDragging ? 'bg-navbar-resize-hover w-2' : 'bg-navbar-resize group-hover:bg-navbar-resize-hover group-hover:w-2'}"
    ></div>
</div>

