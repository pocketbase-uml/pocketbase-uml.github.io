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
  <path d="M18 6l-12 12" />
  <path d="M6 6l12 12" />
</svg>
