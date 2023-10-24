<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';

  export let title: string;
  export let buttonTitle = 'OK';

  const dispatch = createEventDispatcher<{ dismiss: undefined }>();
</script>

<Modal {title} on:dismiss>
  <slot />
  <footer>
    <Button on:click={() => dispatch('dismiss')}>{buttonTitle}</Button>
  </footer>
</Modal>

<style lang="scss">
  footer {
    margin: 1.5em 0 0 -0.25em;
  }
</style>
