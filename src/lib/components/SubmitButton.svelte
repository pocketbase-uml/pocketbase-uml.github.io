<script lang="ts">
  import Button from './Button.svelte';
  import IconArrowRight from './icons/IconArrowRight.svelte';

  interface Props {
    title: string;
    large?: boolean;
    disabled?: boolean;
  }

  let { title, large = false, disabled = false }: Props = $props();
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
