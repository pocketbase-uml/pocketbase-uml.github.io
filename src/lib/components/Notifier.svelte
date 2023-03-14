<script lang="ts">
  import { notifications } from '$lib/notifications';
  import { fade, fly } from 'svelte/transition';
  import IconCheck from './icons/IconCheck.svelte';
</script>

<div class="root">
  {#each $notifications as { id, message } (id)}
    <div class="notification" in:fly={{ y: -10 }} out:fade>
      <div class="icon"><IconCheck /></div>
      <div>{message}</div>
    </div>
  {/each}
</div>

<style lang="scss">
  @import 'src/lib/style/variables.scss';

  .root {
    position: fixed;
    top: $toolbar-height + 1em;
    right: 1em;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1em;
    pointer-events: none;
    font-size: $font-size-small;
  }

  .notification {
    background: $color-paper;
    border: 1px solid $color-shade-3;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
  }

  .icon {
    display: flex;
    margin-right: 0.5em;
    color: $color-success;
  }
</style>
