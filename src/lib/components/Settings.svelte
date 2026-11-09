<script lang="ts">
  import { backOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import Card from './Card.svelte';

  interface Props {
    ondismiss: () => void;
    children?: import('svelte').Snippet;
  }

  let { ondismiss, children }: Props = $props();

  const onWindowKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') ondismiss();
  };

  const flyIn = (node: Element) =>
    fly(node, { y: -node.clientHeight, duration: 200, delay: 200, easing: backOut });
  const flyOut = (node: Element) => fly(node, { y: -node.clientHeight, duration: 200 });
</script>

<svelte:window onkeydown={onWindowKeyDown} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  class="backdrop"
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200, delay: 200 }}
  onclick={ondismiss}
></div>
<div class="root" in:flyIn out:flyOut>
  <Card>
    <div class="content">
      {@render children?.()}
    </div>
  </Card>
</div>

<style lang="scss">
  @use '../style/variables' as *;

  .backdrop {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(black, 0.5);
  }

  .root {
    z-index: 1;
    position: fixed;
    top: $toolbar-height + 0.5em;
    right: 5px;
    &::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      top: -5px;
      right: 55px;
      background: $color-paper;
      transform: rotate(45deg);
      border: 2px solid $color-shade-3;
      box-shadow: $box-shadow;
      z-index: -1;
    }
    &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      top: -3px;
      right: 55px;
      background: $color-paper;
      transform: rotate(45deg);
      z-index: 1;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>
