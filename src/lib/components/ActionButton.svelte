<script lang="ts">
  interface Props {
    title: string;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let { title, disabled = false, onclick, children }: Props = $props();
</script>

<button {title} {disabled} {onclick}>{@render children?.()}</button>

<style lang="scss">
  @use '../style/variables' as *;

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
