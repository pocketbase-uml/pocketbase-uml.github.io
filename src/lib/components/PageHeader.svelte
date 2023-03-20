<script lang="ts">
  import { fade } from 'svelte/transition';
  import IconLogoDrawn from './icons/IconLogoDrawn.svelte';
  import RepoBadge from './RepoBadge.svelte';
</script>

<header transition:fade>
  <a href="/">
    <h1>
      <IconLogoDrawn size="1.35em" />
      <span>Pocket<strong>Base</strong>UML</span>
    </h1>
    <p>The PocketBase visual perspective</p>
  </a>
  <RepoBadge />
</header>

<style lang="scss">
  @import 'src/lib/style/variables';

  header {
    margin: 1.5em auto;
    @media (min-width: 500px) and (orientation: portrait) {
      margin-top: 3em;
    }
    @media (min-height: 768px) and (orientation: landscape) {
      margin-top: 3em;
    }
  }

  a {
    color: initial;
    text-decoration: initial;
  }

  h1 {
    display: flex;
    align-items: center;
    font-size: 2.25em;
  }

  p {
    font-size: $font-size-small;
    color: $color-text-light;
    letter-spacing: 0.168em;
    text-indent: 0.4em;
    margin-top: -0.25em;
  }
</style>
