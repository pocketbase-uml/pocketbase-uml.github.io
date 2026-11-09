<script lang="ts">
  interface Props {
    value: string;
    required?: boolean;
  }

  let { value, required = false }: Props = $props();
</script>

<span class:required>{value.toUpperCase()}</span>

<style lang="scss">
  @use '../style/variables' as *;

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
