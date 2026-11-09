<script lang="ts">
  interface Props {
    disabled?: boolean;
    outlined?: boolean;
    type?: 'submit' | undefined;
    large?: boolean;
    href?: string | undefined;
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    disabled = false,
    outlined = false,
    type = undefined,
    large = false,
    href = undefined,
    onclick,
    children
  }: Props = $props();
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  role={href ? 'link' : 'button'}
  class="root"
  class:outlined
  class:large
  {onclick}
  {type}
  {href}
  {disabled}
>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  @use 'sass:color';
  @use '../style/variables' as *;

  .root {
    text-decoration: none;
    font-weight: 600;
    height: 40px;
    min-width: 100px;
    padding: 0 2em;
    border-radius: $border-radius;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: $color-paper;
    transition: background 0.2s;
    background: $color-text;
    @media (pointer: fine) {
      &:not(:disabled) {
        &:hover,
        &:focus {
          background: color.adjust($color-text, $lightness: 20%);
        }
      }
    }
    &:not(:disabled):active {
      transform: translate3d(0, 1px, 0);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    &.outlined {
      color: $color-text;
      background: $color-paper;
      border: 2px solid color.adjust($color-text, $lightness: 20%);
      @media (pointer: fine) {
        &:not(:disabled) {
          &:hover,
          &:focus {
            background: $color-shade-1;
          }
        }
      }
    }
  }

  .large {
    height: 54px;
  }
</style>
