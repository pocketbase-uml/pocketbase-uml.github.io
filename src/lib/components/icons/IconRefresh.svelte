<script lang="ts">
  import { DEFAULT_ICON_SIZE, DEFAULT_ICON_STROKE } from '$lib/config';

  export let size: number | string = DEFAULT_ICON_SIZE;
  export let stroke: number | string = DEFAULT_ICON_STROKE;
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  stroke-width={stroke}
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
</svg>
