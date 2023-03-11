<script lang="ts">
  import { DEFAULT_ICON_SIZE, DEFAULT_ICON_STROKE } from '$lib/config';
  import { onMount } from 'svelte';
  import { draw } from 'svelte/transition';

  export let size: number | string = DEFAULT_ICON_SIZE;
  export let stroke: number | string = DEFAULT_ICON_STROKE;

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 36 36"
  stroke-width={stroke}
  stroke="currentColor"
  fill="none"
>
  {#if mounted}
    <path
      transition:draw={{ duration: 500, delay: 250 }}
      d="M14 23V22H13H8C6.89543 22 6 21.1046 6 20V8C6 6.89543 6.89543 6 8 6H20C21.1046 6 22 6.89543 22 8V13V14H23H28C29.1046 14 30 14.8954 30 16V28C30 29.1046 29.1046 30 28 30H16C14.8954 30 14 29.1046 14 28V23Z"
    />
    <path d="M16 16L20 20" transition:draw={{ duration: 50, delay: 100 }} />
    <rect x="11" y="11" width="6" height="6" rx="1" transition:draw={{ duration: 100 }} />
    <rect
      x="19"
      y="19"
      width="6"
      height="6"
      rx="1"
      transition:draw={{ duration: 100, delay: 150 }}
    />
  {/if}
</svg>
