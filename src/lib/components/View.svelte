<script lang="ts">
  import { goto } from '$app/navigation';
  import Toolbar from '$lib/components/Toolbar.svelte';
  import { LOCAL_STORAGE_CONNECTION_KEY, MAX_ZOOM, PUBLIC_URL } from '$lib/config';
  import {
    copyPng,
    downloadPng,
    drawImage,
    loadPocketbaseCollections,
    validateCollections,
    type Connection
  } from '$lib/diagram';
  import { addNotification } from '$lib/notifications';
  import { ALGORITHMS, DIRECTIONS, settings } from '$lib/settings';
  import { absRoundedHalfDiff, constrain } from '$lib/utils';
  import { createQuery } from '@tanstack/svelte-query';
  import { decode, encode } from 'js-base64';
  import throttle from 'lodash.throttle';
  import type { Collection } from 'pocketbase';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import ConfirmationModal from './ConfirmationModal.svelte';
  import Notifier from './Notifier.svelte';
  import RadioGroup from './RadioGroup.svelte';
  import Settings from './Settings.svelte';
  import Switch from './Switch.svelte';
  import Zoom from './Zoom.svelte';

  let view: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  let connection: Connection | undefined;
  let data: Collection[] | undefined;
  let error = false;
  let closing = false;
  let settingsVisible = false;

  const close = (forget?: boolean) => {
    if (forget) localStorage.removeItem(LOCAL_STORAGE_CONNECTION_KEY);
    goto('/', { replaceState: true });
  };

  try {
    if (location.hash) {
      data = JSON.parse(decode(location.hash.slice(1)));
      validateCollections(data);
    } else {
      connection = JSON.parse(decode(localStorage.getItem(LOCAL_STORAGE_CONNECTION_KEY) || ''));
      if (!connection?.url) throw new Error();
    }
  } catch {
    close();
  }

  const query = createQuery({
    queryKey: [connection],
    queryFn: () => loadPocketbaseCollections(connection),
    enabled: !!connection,
    refetchOnWindowFocus: () => !error
  });

  $: error = $query.isError;
  $: if ($query.data) data = $query.data;

  let dragging = false;
  let panX = 0;
  let panY = 0;
  let minZoom = 1;
  let zoom = 1;

  const fit = () => {
    const hiddenCanvas = document.createElement('canvas');
    drawImage(hiddenCanvas, data, $settings);
    const { width, height } = hiddenCanvas;
    const { clientWidth: viewWidth, clientHeight: viewHeight } = view;
    minZoom = Math.min(viewWidth / width, viewHeight / height);
    hiddenCanvas.remove();
    panX = 0;
    panY = 0;
    zoom = minZoom;
  };

  let neverDrawn = true;
  $: if (canvas && !$query.isFetching && data) {
    if (neverDrawn) {
      fit();
      neverDrawn = false;
    }
    drawImage(canvas, data, $settings, zoom);
  }

  const handlePointerDownOrEnter = (e: PointerEvent) => {
    if (e.buttons === 1) dragging = true;
  };

  const handlePointerUpOrLeave = () => {
    dragging = false;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (dragging) {
      const { movementX, movementY } = e;

      const { clientWidth: viewWidth, clientHeight: viewHeight } = view;
      const { width: canvasWidth, height: canvasHeight } = canvas;
      const halfWidthDiff = absRoundedHalfDiff(viewWidth, canvasWidth);
      const halfHeightDiff = absRoundedHalfDiff(viewHeight, canvasHeight);

      panX = constrain(panX + movementX, -halfWidthDiff, halfWidthDiff);
      panY = constrain(panY + movementY, -halfHeightDiff, halfHeightDiff);
    }
  };

  const handleWheel = ({ pageX, pageY, deltaY: scroll }: WheelEvent) => {
    const newZoom = constrain(zoom * (1 - scroll / 1000), minZoom, MAX_ZOOM);
    const {
      clientWidth: viewWidth,
      clientHeight: viewHeight,
      offsetTop: viewOffsetTop,
      offsetLeft: viewOffsetLeft
    } = view;
    const { width: canvasWidth, height: canvasHeight } = canvas;
    const pointerX = pageX - viewOffsetLeft;
    const pointerY = pageY - viewOffsetTop;
    const zoomDelta = (newZoom - zoom) / zoom;
    zoom = newZoom;
    const halfWidthDiff = absRoundedHalfDiff(viewWidth, canvasWidth);
    const halfHeightDiff = absRoundedHalfDiff(viewHeight, canvasHeight);
    panX = constrain(
      panX - Math.round(canvasWidth * zoomDelta * ((pointerX - viewWidth / 2) / viewWidth)),
      -halfWidthDiff,
      halfWidthDiff
    );
    panY = constrain(
      panY - Math.round(canvasHeight * zoomDelta * ((pointerY - viewHeight / 2) / viewHeight)),
      -halfHeightDiff,
      halfHeightDiff
    );
  };

  let previousFingersDistance = 0;
  const handleTouchMove = ({ touches }: TouchEvent) => {
    if (touches.length === 2) {
      dragging = false;
      const [{ pageX: x1, pageY: y1 }, { pageX: x2, pageY: y2 }] = touches;
      const fingersDistance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      if (previousFingersDistance !== 0) {
        const newZoom =
          fingersDistance > previousFingersDistance
            ? Math.min(zoom + 0.03, MAX_ZOOM)
            : Math.max(zoom - 0.03, minZoom);
        const {
          clientWidth: viewWidth,
          clientHeight: viewHeight,
          offsetTop: viewOffsetTop,
          offsetLeft: viewOffsetLeft
        } = view;
        const { width: canvasWidth, height: canvasHeight } = canvas;
        const pointerX = (x1 + x2) / 2 - viewOffsetLeft;
        const pointerY = (y1 + y2) / 2 - viewOffsetTop;
        const zoomDelta = (newZoom - zoom) / zoom;
        const halfWidthDiff = absRoundedHalfDiff(viewWidth, canvasWidth);
        const halfHeightDiff = absRoundedHalfDiff(viewHeight, canvasHeight);

        panX = constrain(
          panX - Math.round(canvasWidth * zoomDelta * ((pointerX - viewWidth / 2) / viewWidth)),
          -halfWidthDiff,
          halfWidthDiff
        );
        panY = constrain(
          panY - Math.round(canvasHeight * zoomDelta * ((pointerY - viewHeight / 2) / viewHeight)),
          -halfHeightDiff,
          halfHeightDiff
        );
        zoom = newZoom;
      }
      previousFingersDistance = fingersDistance;
    }
  };

  const handleTouchEnd = ({ touches }: TouchEvent) => {
    if (touches.length === 2) previousFingersDistance = 0;
  };

  const handleWindowResize = throttle(fit, 200, { trailing: true });
  window.addEventListener('resize', handleWindowResize);
  onDestroy(() => {
    window.removeEventListener('resize', handleWindowResize);
  });

  const refetch = () => {
    $query.refetch();
  };

  const handleSettingsChange = () => {
    neverDrawn = true;
  };

  const handleCopy = () => {
    copyPng(data, $settings);
    addNotification('Image copied to clipboard');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${PUBLIC_URL}/view#${encode(JSON.stringify(data))}`);
    addNotification('Shareable link copied to clipboard');
  };
</script>

{#if settingsVisible}
  <Settings on:dismiss={() => (settingsVisible = false)}>
    <RadioGroup
      title="Graph direction"
      bind:value={$settings.direction}
      options={DIRECTIONS}
      on:change={handleSettingsChange}
    />
    <RadioGroup
      title="Graph algorithm"
      bind:value={$settings.algorithm}
      options={ALGORITHMS}
      on:change={handleSettingsChange}
    />
    <Switch
      title="Show system attributes"
      bind:value={$settings.showSystemAttributes}
      on:change={handleSettingsChange}
    />
    <Switch
      title="Show attribute flags"
      bind:value={$settings.showAttributeFlags}
      on:change={handleSettingsChange}
    />
    <Switch
      title="Show select values"
      bind:value={$settings.showSelectValues}
      on:change={handleSettingsChange}
    />
  </Settings>
{/if}
<Toolbar
  url={connection?.url}
  loading={$query.isFetching}
  noData={!data}
  on:reload={refetch}
  on:fit={fit}
  on:download={() => downloadPng(data, $settings)}
  on:copy={handleCopy}
  on:share={handleShare}
  on:settings={() => (settingsVisible = !settingsVisible)}
  on:close={() => (closing = true)}
/>
<div
  bind:this={view}
  class:dragging
  on:dblclick={fit}
  on:pointerdown={handlePointerDownOrEnter}
  on:pointerenter={handlePointerDownOrEnter}
  on:pointerup={handlePointerUpOrLeave}
  on:pointerleave={handlePointerUpOrLeave}
  on:pointermove={handlePointerMove}
  on:wheel|preventDefault={handleWheel}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
>
  {#if data}
    <canvas
      bind:this={canvas}
      style:transform="translate3d({panX}px, {panY}px, 0)"
      transition:fade={{ duration: 100 }}
    />
    <Zoom value={zoom} />
  {/if}
  <Notifier />
</div>
{#if error && !closing}
  <ConfirmationModal
    title="Connection error"
    yesButtonTitle="Abort"
    noButtonTitle="Retry"
    on:yes={() => close()}
    on:no={refetch}
  >
    <p>Something went wrong while trying to access PocketBase.</p>
    <p>
      Make sure the server is running and listening on {connection?.url} and you provided the correct
      credentials.
    </p>
  </ConfirmationModal>
{/if}
{#if closing}
  <ConfirmationModal title="Closing" on:yes={() => close(true)} on:no={() => (closing = false)}>
    <p>Are you sure you want to close the {connection ? 'connection' : 'diagram'}?</p>
  </ConfirmationModal>
{/if}

<style lang="scss">
  @import 'src/lib/style/variables.scss';

  div {
    position: fixed;
    top: $toolbar-height;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    touch-action: none;
    &.dragging {
      cursor: grabbing;
    }
  }
</style>
