<script lang="ts">
  export let value: string;
  export let required = false;
</script>

<span class:required>{value.toUpperCase()}</span>

<style lang="scss">
  @import 'src/lib/style/variables';

  span {
    font-size: $font-size-smaller;
    font-weight: 600;
    line-height: 1;
    color: $color-text-light;
    margin: 12px 15px 10px;
    &.required::after {
      content: ' *';
      color: $color-danger;
    }
  }
</style>
