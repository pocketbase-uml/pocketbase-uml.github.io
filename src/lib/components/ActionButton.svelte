<script lang="ts">
  export let title: string;
  export let disabled = false;
</script>

<button {title} {disabled} on:click><slot /></button>

<style lang="scss">
  @import 'src/lib/style/variables.scss';

  button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: $color-shade-1;
    }
    &:active {
      background: $color-shade-3;
    }
    &:disabled {
      color: rgba($color-text, 0.33);
      background: transparent;
      cursor: default;
    }
  }
</style>
