<script lang="ts">
  import IconCheck from './icons/IconCheck.svelte';
  import IconCopy from './icons/IconCopy.svelte';

  export let command: string;
  let copied = false;

  function handleCopyClick() {
    navigator.clipboard.writeText(command);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<div class="root">
  <div class="header">
    <div class="button close" />
    <div class="button minimize" />
    <div class="button maximize" />
  </div>
  <div class="content">
    <code class="prefix">$</code>
    <code class="command">{command}</code>
    <button class="copy" title="Copy to clipboard" on:click={handleCopyClick} disabled={copied}>
      {#if copied}
        <IconCheck />
      {:else}
        <IconCopy />
      {/if}
    </button>
  </div>
</div>

<style lang="scss">
  @import 'src/lib/style/variables';

  .root {
    border-radius: $border-radius * 2;
    box-shadow: $box-shadow;
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    height: 1.5em;
    background-color: lighten($color-text, 20%);
  }

  .button {
    width: 0.75em;
    height: 0.75em;
    border-radius: 50%;
    margin-left: 0.5em;
  }

  .close {
    background-color: #ff605c;
  }

  .minimize {
    background-color: #ffbd44;
  }

  .maximize {
    background-color: #00ca4e;
  }

  .content {
    font-family: $font-family-monospace;
    font-size: $font-size-small;
    padding: 0.25em 0.5em 0.25em 0.75em;
    color: $color-shade-2;
    background-color: $color-text;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .prefix {
    color: $color-success;
    user-select: none;
  }

  .command {
    flex: 1;
  }

  .copy {
    width: 2em;
    height: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: darken($color-shade-2, 30%);
    background: transparent;
    border-radius: 50%;
    transition: color 0.25s, background 0.2s;
    @media (pointer: fine) {
      &:hover {
        color: darken($color-shade-2, 10%);
        background: rgba($color-shade-2, 20%);
      }
      &:active {
        color: darken($color-shade-2, 40%);
        background: transparent;
        transform: translateY(1px);
      }
    }
    &:disabled {
      color: $color-success;
      cursor: default;
    }
  }
</style>
