<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import ActionButton from './ActionButton.svelte';
  import IconBraces from './icons/IconBraces.svelte';
  import IconClose from './icons/IconClose.svelte';
  import IconCopy from './icons/IconCopy.svelte';
  import IconDatabase from './icons/IconDatabase.svelte';
  import IconDownload from './icons/IconDownload.svelte';
  import IconFit from './icons/IconFit.svelte';
  import IconLogoDrawn from './icons/IconLogoDrawn.svelte';
  import IconRefresh from './icons/IconRefresh.svelte';
  import IconSettings from './icons/IconSettings.svelte';
  import IconShare from './icons/IconShare.svelte';

  let root: HTMLDivElement;

  export let url: string | undefined;
  export let loading: boolean;
  export let noData: boolean;

  const dispatch = createEventDispatcher<{
    reload: never;
    fit: never;
    download: never;
    copy: never;
    share: never;
    settings: never;
    close: never;
  }>();

  const cannotCopy = typeof ClipboardItem === 'undefined';
  const canCopy = !cannotCopy;
  const isMac = navigator.userAgent.includes('Mac');

  const handleKeyDown = (event: KeyboardEvent) => {
    if (canCopy && event.key === 'c' && ((isMac && event.metaKey) || (!isMac && event.ctrlKey)))
      dispatch('copy');
  };

  window.addEventListener('keydown', handleKeyDown);
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<div bind:this={root} class="root" transition:fly={{ y: -root.clientHeight }}>
  <div class="logo">
    <IconLogoDrawn size="1.5em" stroke={1.25} />
    <div class="logo-text">Pocket<strong>Base</strong>UML</div>
  </div>
  <div class="title">
    <span class="title-icon" class:url>
      {#if url}
        <IconDatabase size="0.8em" />
      {:else}
        <IconBraces size="0.8em" />
      {/if}
    </span>
    <span>{url || 'collections snapshot'}</span>
  </div>
  <div class="actions">
    <ActionButton
      title={url ? 'Reload' : 'Reloads collections when connected to a server'}
      disabled={loading || !url}
      on:click={() => dispatch('reload')}
    >
      <div class="loading-icon" class:loading><IconRefresh /></div>
    </ActionButton>
    <ActionButton
      title="Fit to window (Double-click)"
      disabled={noData}
      on:click={() => dispatch('fit')}
    >
      <IconFit />
    </ActionButton>
    <ActionButton title="Download image" disabled={noData} on:click={() => dispatch('download')}>
      <IconDownload />
    </ActionButton>
    <ActionButton
      title={cannotCopy
        ? "Copying images to clipboard doesn't work in your browser"
        : `Copy image (${isMac ? '⌘C' : 'Ctrl+C'})`}
      disabled={noData || cannotCopy}
      on:click={() => dispatch('copy')}
    >
      <IconCopy />
    </ActionButton>
    <ActionButton
      title={cannotCopy
        ? "Creating shareable links doesn't work in your browser"
        : 'Create shareable link'}
      disabled={noData || cannotCopy}
      on:click={() => dispatch('share')}
    >
      <IconShare />
    </ActionButton>
    <ActionButton title="Settings" on:click={() => dispatch('settings')}>
      <IconSettings />
    </ActionButton>
    <ActionButton title="Close" on:click={() => dispatch('close')}>
      <IconClose />
    </ActionButton>
  </div>
</div>

<style lang="scss">
  @import 'src/lib/style/variables.scss';

  .root {
    display: flex;
    align-items: center;
    gap: 1em;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: $toolbar-height;
    justify-content: space-between;
    background: rgba($color-paper, 0.9);
    backdrop-filter: blur(1px);
    box-shadow: $box-shadow;
    padding: 0 5px;
    z-index: 1;
    user-select: none;
    border-bottom: 1px solid $color-shade-3;
  }

  .logo {
    display: flex;
    align-items: center;
    font-size: 1.5em;
  }

  .logo-text {
    display: none;
    @media (min-width: 480px) {
      display: initial;
    }
  }

  .title {
    font-size: $font-size-small;
    color: $color-text-light;
    display: none;
    @media (min-width: 640px) {
      display: initial;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .title-icon {
    display: inline-flex;
    vertical-align: -2px;
    &.url {
      vertical-align: -1px;
    }
  }

  .actions {
    display: flex;
    align-items: center;
  }

  .loading-icon {
    display: flex;
    &.loading {
      animation: spin 0.3s linear infinite;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
