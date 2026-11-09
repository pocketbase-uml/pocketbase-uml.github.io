<script lang="ts">
  import { backOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import ActionButton from './ActionButton.svelte';
  import Card from './Card.svelte';
  import IconClose from './icons/IconClose.svelte';

  interface Props {
    title: string;
    ondismiss: () => void;
    children?: import('svelte').Snippet;
  }

  let { title, ondismiss, children }: Props = $props();

  const onWindowKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') ondismiss();
  };

  const flyIn = (node: Element) =>
    fly(node, { y: -node.clientHeight * 2, easing: backOut, delay: 100 });
  const flyOut = (node: Element) => fly(node, { y: -node.clientHeight, duration: 100 });
</script>

<svelte:window onkeydown={onWindowKeyDown} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div in:fade out:fade={{ duration: 100, delay: 100 }} onclick={ondismiss}>
  <dialog open={true} in:flyIn out:flyOut onclick={(event) => event.stopPropagation()}>
    <Card>
      <header>
        <h2>{title}</h2>
        <ActionButton title="Close" onclick={ondismiss}><IconClose /></ActionButton>
      </header>
      {@render children?.()}
    </Card>
  </dialog>
</div>

<style lang="scss">
  @use '../style/variables' as *;

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
