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
  <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
  <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
</svg>
