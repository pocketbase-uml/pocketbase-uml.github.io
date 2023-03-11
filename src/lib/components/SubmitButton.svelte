<script lang="ts">
  import Button from './Button.svelte';
  import IconArrowRight from './icons/IconArrowRight.svelte';

  export let title: string;
  export let large = false;
  export let disabled = false;
</script>

<Button type="submit" {large} {disabled}>
  {title}
  <span><IconArrowRight /></span>
</Button>

<style lang="scss">
  span {
    display: flex;
    margin-left: 0.5em;
    transition: transform 0.2s;
    @media (pointer: fine) {
      :global(button:not(:disabled):hover) & {
        transform: translate3d(0.25em, 0, 0);
      }
    }
  }
</style>
