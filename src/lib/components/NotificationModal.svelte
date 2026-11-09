<script lang="ts">
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';

  interface Props {
    title: string;
    buttonTitle?: string;
    ondismiss: () => void;
    children?: import('svelte').Snippet;
  }

  let { title, buttonTitle = 'OK', ondismiss, children }: Props = $props();
</script>

<Modal {title} {ondismiss}>
  {@render children?.()}
  <footer>
    <Button onclick={ondismiss}>{buttonTitle}</Button>
  </footer>
</Modal>

<style lang="scss">
  footer {
    margin: 1.5em 0 0 -0.25em;
  }
</style>
