<script lang="ts">
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';

  interface Props {
    title: string;
    yesButtonTitle?: string;
    noButtonTitle?: string;
    onyes: () => void;
    onno: () => void;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    yesButtonTitle = 'Yes',
    noButtonTitle = 'No',
    onyes,
    onno,
    children
  }: Props = $props();
</script>

<Modal {title} ondismiss={onno}>
  {@render children?.()}
  <footer>
    <Button onclick={onyes}>{yesButtonTitle}</Button>
    <Button outlined onclick={onno}>{noButtonTitle}</Button>
  </footer>
</Modal>

<style lang="scss">
  footer {
    margin: 1.5em 0 0 -0.25em;
    display: flex;
    gap: 1em;
  }
</style>
