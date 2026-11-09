<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div>{@render children?.()}</div>

<style lang="scss">
  @use '../style/variables' as *;

  div {
    padding: 1.875em;
    background: $color-paper;
    border: 1px solid $color-shade-3;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }
</style>
