<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import example from '$lib/example.json';
  import hero from '$lib/images/hero.png';
  import { encode } from 'js-base64';
  import { blur, fade, scale } from 'svelte/transition';

  let buttonsVisible = true;
</script>

<PageMeta />
<div class="hero" in:fade>
  {#if buttonsVisible}
    <div class="buttons" in:scale>
      <Button
        large
        href="/view#{encode(JSON.stringify(example))}"
        on:click={() => (buttonsVisible = false)}>See an example</Button
      >
      <Button large outlined href="/import">Import collections</Button>
      <Button large outlined href="/connect">Connect to a server</Button>
    </div>
  {/if}
  <img class="picture" src={hero} alt="PocketBaseUML" in:blur={{ delay: 100 }} />
</div>

<style lang="scss">
  @import 'src/lib/style/variables';

  .hero {
    aspect-ratio: 10 / 6;
    width: 1000px;
    min-height: 300px;
    max-width: calc(100vw - 2em);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid lighten($color-text, 20%);
    border-radius: $border-radius * 2;
    position: relative;
    background: $color-paper;
    overflow: hidden;
  }

  .picture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: left;
    transition: filter 0.5s;
    filter: opacity(0.7);
  }

  .buttons {
    width: 260px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 1.875em;
    padding: 1em;
    z-index: 1;
  }
</style>
