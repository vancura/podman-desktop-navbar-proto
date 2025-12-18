<!--
  TrafficLights Component
  macOS-style window control buttons (close, minimize, maximize).
  These are decorative in this prototype - not focusable.
-->

<script lang="ts">
    // No props needed - purely decorative
</script>

<div class="flex gap-2">
    <div
        class="h-3 w-3 rounded-full bg-traffic-close"
        role="img"
        aria-label="Close"
    ></div>

    <div
        class="h-3 w-3 rounded-full bg-traffic-minimize"
        role="img"
        aria-label="Minimize"
    ></div>

    <div
        class="h-3 w-3 rounded-full bg-traffic-maximize"
        role="img"
        aria-label="Maximize"
    ></div>
</div>
