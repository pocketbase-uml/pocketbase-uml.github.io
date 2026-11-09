<script lang="ts">
  interface Props {
    value: number;
  }

  let { value }: Props = $props();
</script>

<div>{(value * 100).toFixed()}%</div>

<style lang="scss">
  @use '../style/variables' as *;

  div {
    position: fixed;
    bottom: 8px;
    right: 8px;
    z-index: 1;
    color: $color-text-light;
    background: rgba($color-paper, 0.9);
    backdrop-filter: blur(1px);
    font-size: $font-size-smaller;
    line-height: 1;
    padding: 1px 4px;
    border: 1px solid $color-shade-3;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    user-select: none;
  }
</style>
