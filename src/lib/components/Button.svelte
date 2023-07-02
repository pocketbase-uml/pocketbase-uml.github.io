<script lang="ts">
  export let disabled = false;
  export let outlined = false;
  export let type: 'submit' | undefined = undefined;
  export let large = false;
  export let href: string | undefined = undefined;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
  this={href ? 'a' : 'button'}
  role={href ? 'link' : 'button'}
  class="root"
  class:outlined
  class:large
  on:click
  {type}
  {href}
  {disabled}
>
  <slot />
</svelte:element>

<style lang="scss">
  @import 'src/lib/style/variables.scss';

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
          background: lighten($color-text, 20%);
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
      border: 2px solid lighten($color-text, 20%);
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
