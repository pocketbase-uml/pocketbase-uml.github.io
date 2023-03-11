<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import Modal from './Modal.svelte';

  export let title: string;
  export let yesButtonTitle = 'Yes';
  export let noButtonTitle = 'No';

  const dispatch = createEventDispatcher<{ yes: never; no: never }>();
  const no = () => dispatch('no');
</script>

<Modal {title} on:dismiss={no}>
  <slot />
  <footer>
    <Button on:click={() => dispatch('yes')}>{yesButtonTitle}</Button>
    <Button outlined on:click={no}>{noButtonTitle}</Button>
  </footer>
</Modal>

<style lang="scss">
  footer {
    margin: 1.5em 0 0 -0.25em;
    display: flex;
    gap: 1em;
  }
</style>
