<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { backOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import Card from './Card.svelte';

  let root: HTMLDivElement;

  const dispatch = createEventDispatcher<{ dismiss: undefined }>();

  const dismiss = () => dispatch('dismiss');

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
<div
  class="backdrop"
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200, delay: 200 }}
  on:click={dismiss}
/>
<div
  class="root"
  bind:this={root}
  in:fly={{ y: -root.clientHeight, duration: 200, delay: 200, easing: backOut }}
  out:fly={{ y: -root.clientHeight, duration: 200 }}
>
  <Card>
    <div class="content">
      <slot />
    </div>
  </Card>
</div>

<style lang="scss">
  @import 'src/lib/style/variables.scss';

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
