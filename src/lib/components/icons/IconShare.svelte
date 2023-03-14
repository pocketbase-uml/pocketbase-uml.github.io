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
  <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  <path d="M8.7 10.7l6.6 -3.4" />
  <path d="M8.7 13.3l6.6 3.4" />
</svg>
