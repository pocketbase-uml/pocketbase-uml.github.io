<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { backOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import ActionButton from './ActionButton.svelte';
  import Card from './Card.svelte';
  import IconClose from './icons/IconClose.svelte';

  export let title: string;

  const dispatch = createEventDispatcher<{ dismiss: undefined }>();
  const dismiss = () => dispatch('dismiss');
  let root: HTMLDialogElement;

  const onWindowKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      dismiss();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', onWindowKeyDown);

    return () => {
      window.removeEventListener('keydown', onWindowKeyDown);
    };
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div in:fade out:fade={{ duration: 100, delay: 100 }} on:click={dismiss}>
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <dialog
    bind:this={root}
    open={true}
    in:fly={{ y: -root.clientHeight * 2, easing: backOut, delay: 100 }}
    out:fly={{ y: -root.clientHeight, duration: 100 }}
    on:click|stopPropagation
  >
    <Card>
      <header>
        <h2>{title}</h2>
        <ActionButton title="Close" on:click={dismiss}><IconClose /></ActionButton>
      </header>
      <slot />
    </Card>
  </dialog>
</div>

<style lang="scss">
  @import 'src/lib/style/variables.scss';

  div {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(black, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  dialog {
    width: 360px;
    max-width: calc(100% - 2em);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -0.875em -1em 1em 0;
  }

  h2 {
    font-weight: 600;
    font-size: 1.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
