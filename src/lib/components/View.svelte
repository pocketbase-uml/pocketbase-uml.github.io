<script lang="ts">
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';
  import Toolbar from '#lib/components/Toolbar.svelte';
  import { LOCAL_STORAGE_CONNECTION_KEY, MAX_ZOOM, PUBLIC_URL } from '#lib/config.ts';
  import {
    copyPng,
    downloadPng,
    drawImage,
    loadPocketbaseCollections,
    validateCollections,
    type Connection
  } from '#lib/diagram.ts';
  import { addNotification } from '#lib/notifications.svelte.ts';
  import { ALGORITHMS, DIRECTIONS, settings } from '#lib/settings.svelte.ts';
  import { absRoundedHalfDiff, constrain } from '#lib/utils.ts';
  import { createQuery } from '@tanstack/svelte-query';
  import { decode, encode } from 'js-base64';
  import throttle from 'lodash.throttle';
  import type { CollectionModel } from 'pocketbase';
  import type { Attachment } from 'svelte/attachments';
  import { fade } from 'svelte/transition';
  import ConfirmationModal from './ConfirmationModal.svelte';
  import Notifier from './Notifier.svelte';
  import RadioGroup from './RadioGroup.svelte';
  import Settings from './Settings.svelte';
  import Switch from './Switch.svelte';
  import Zoom from './Zoom.svelte';

  let view: HTMLDivElement | undefined = $state();
  let canvas: HTMLCanvasElement | undefined = $state();

  let closing = $state(false);
  let settingsVisible = $state(false);

  const close = (forget?: boolean) => {
    if (forget) localStorage.removeItem(LOCAL_STORAGE_CONNECTION_KEY);
    goto(resolve(''), { replaceState: true });
  };

  // Either a collections snapshot passed in the URL hash, or a connection to a live server
  const getSource = (): { snapshot?: CollectionModel[]; connection?: Connection } => {
    try {
      if (location.hash) {
        return { snapshot: validateCollections(JSON.parse(decode(location.hash.slice(1)))) };
      }
      const connection: Connection = JSON.parse(
        decode(localStorage.getItem(LOCAL_STORAGE_CONNECTION_KEY) || '')
      );
      if (connection?.url) return { connection };
    } catch {
      // Invalid snapshot or stored connection; handled below
    }
    close();
    return {};
  };
  const { snapshot, connection } = getSource();

  const query = createQuery(() => ({
    queryKey: ['collections', connection],
    queryFn: () => loadPocketbaseCollections(connection),
    enabled: !!connection,
    refetchOnWindowFocus: (): boolean => !query.isError
  }));

  const data = $derived(query.data ?? snapshot);
  const error = $derived(query.isError);

  let panX = $state(0);
  let panY = $state(0);
  let minZoom = 1;
  let zoom = $state(1);
  let dragging = $state(false);

  const fit = () => {
    if (!view) return;
    const hiddenCanvas = document.createElement('canvas');
    drawImage(hiddenCanvas, data, settings);
    const { width, height } = hiddenCanvas;
    const { clientWidth: viewWidth, clientHeight: viewHeight } = view;
    minZoom = Math.min(viewWidth / width, viewHeight / height);
    hiddenCanvas.remove();
    panX = 0;
    panY = 0;
    zoom = minZoom;
  };

  // Fit the diagram to the window when first drawn and whenever the layout settings change
  let needsFit = true;
  $effect(() => {
    if (canvas && !query.isFetching && data) {
      if (needsFit) {
        needsFit = false;
        fit();
      }
      drawImage(canvas, data, settings, zoom);
    }
  });

  const handlePointerDownOrEnter = (e: PointerEvent) => {
    if (e.buttons === 1) dragging = true;
  };

  const handlePointerUpOrLeave = () => {
    dragging = false;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (dragging) {
      const { movementX, movementY } = e;

      const { clientWidth: viewWidth, clientHeight: viewHeight } = view!;
      const { width: canvasWidth, height: canvasHeight } = canvas!;
      const halfWidthDiff = absRoundedHalfDiff(viewWidth, canvasWidth);
      const halfHeightDiff = absRoundedHalfDiff(viewHeight, canvasHeight);

      panX = constrain(panX + movementX, -halfWidthDiff, halfWidthDiff);
      panY = constrain(panY + movementY, -halfHeightDiff, halfHeightDiff);
    }
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const { pageX, pageY, deltaY: scroll } = event;
    const newZoom = constrain(zoom * (1 - scroll / 1000), minZoom, MAX_ZOOM);
    const {
      clientWidth: viewWidth,
      clientHeight: viewHeight,
      offsetTop: viewOffsetTop,
      offsetLeft: viewOffsetLeft
    } = view!;
    const { width: canvasWidth, height: canvasHeight } = canvas!;
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
        } = view!;
        const { width: canvasWidth, height: canvasHeight } = canvas!;
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

  // Wheel listeners are passive by default; this one must be able to prevent page scrolling
  const wheelZoom: Attachment<HTMLElement> = (node) => {
    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => node.removeEventListener('wheel', handleWheel);
  };

  const handleWindowResize = throttle(fit, 200, { trailing: true });
  $effect(() => () => handleWindowResize.cancel());

  const refetch = () => {
    query.refetch();
  };

  const handleSettingsChange = () => {
    needsFit = true;
  };

  const handleCopy = () => {
    copyPng(data, settings);
    addNotification('Image copied to clipboard');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${PUBLIC_URL}/view#${encode(JSON.stringify(data))}`);
    addNotification('Shareable link copied to clipboard');
  };
</script>

<svelte:window onresize={handleWindowResize} />

{#if settingsVisible}
  <Settings ondismiss={() => (settingsVisible = false)}>
    <RadioGroup
      title="Graph direction"
      bind:value={settings.direction}
      options={DIRECTIONS}
      onchange={handleSettingsChange}
    />
    <RadioGroup
      title="Graph algorithm"
      bind:value={settings.algorithm}
      options={ALGORITHMS}
      onchange={handleSettingsChange}
    />
    <Switch
      title="Show system attributes"
      bind:value={settings.showSystemAttributes}
      onchange={handleSettingsChange}
    />
    <Switch
      title="Mark required attributes with (*)"
      bind:value={settings.markRequiredAttributes}
      onchange={handleSettingsChange}
    />
    <Switch
      title="Show select values"
      bind:value={settings.showSelectValues}
      onchange={handleSettingsChange}
    />
  </Settings>
{/if}
<Toolbar
  url={connection?.url}
  loading={query.isFetching}
  noData={!data}
  onreload={refetch}
  onfit={fit}
  ondownload={() => downloadPng(data, settings)}
  oncopy={handleCopy}
  onshare={handleShare}
  onsettings={() => (settingsVisible = !settingsVisible)}
  onclose={() => (closing = true)}
/>
<div
  role="presentation"
  bind:this={view}
  class:dragging
  ondblclick={fit}
  onpointerdown={handlePointerDownOrEnter}
  onpointerenter={handlePointerDownOrEnter}
  onpointerup={handlePointerUpOrLeave}
  onpointerleave={handlePointerUpOrLeave}
  onpointermove={handlePointerMove}
  {@attach wheelZoom}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
>
  {#if data}
    <canvas
      bind:this={canvas}
      style:transform="translate3d({panX}px, {panY}px, 0)"
      transition:fade={{ duration: 100 }}
    ></canvas>
    <Zoom value={zoom} />
  {/if}
  <Notifier />
</div>
{#if error && !closing}
  <ConfirmationModal
    title="Connection error"
    yesButtonTitle="Abort"
    noButtonTitle="Retry"
    onyes={() => close()}
    onno={refetch}
  >
    <p>Something went wrong while trying to access PocketBase.</p>
    <p>
      Make sure the server is running and listening on {connection?.url} and you provided the correct
      credentials.
    </p>
  </ConfirmationModal>
{/if}
{#if closing}
  <ConfirmationModal title="Closing" onyes={() => close(true)} onno={() => (closing = false)}>
    <p>Are you sure you want to close the {connection ? 'connection' : 'diagram'}?</p>
  </ConfirmationModal>
{/if}

<style lang="scss">
  @use '../style/variables' as *;

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
