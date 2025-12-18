<!--
  FadeGradient Component
  Gradient overlay for scroll indicators.
-->

<script lang="ts">
    interface Props {
        position: 'top' | 'bottom';
        visible: boolean;
    }

    const { position, visible }: Props = $props();

    const gradientClass = $derived(
        position === 'top'
            ? 'top-0 bg-gradient-to-b'
            : 'bottom-0 bg-gradient-to-t'
    );
</script>

<div
    class="pointer-events-none absolute left-0 right-0 h-6 from-navbar-bg to-transparent
        {gradientClass}
        {visible ? 'opacity-100' : 'opacity-0'}"
    aria-hidden="true"
></div>

