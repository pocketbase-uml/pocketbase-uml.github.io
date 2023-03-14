<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<footer transition:fade>
  <p>
    Built by <a href="https://github.com/icflorescu" target="_blank" rel="noreferrer"
      >Ionut-Cristian Florescu</a
    >.
    <br />
    PocketBaseUML is
    <a href="https://github.com/pocketbase-uml/pocketbase-uml.github.io" target="_blank"
      >open source</a
    >
    and will always be free, but its maintenance
    <a href="https://github.com/sponsors/icflorescu" target="_blank" rel="noreferrer"
      >depends on your support</a
    >.
  </p>
  <p>❤️🙏❤️</p>
  <p>
    Please
    <a href="https://github.com/sponsors/icflorescu" target="_blank" rel="noreferrer"
      >sponsor my work</a
    >
    if you find it useful!
  </p>
</footer>

<style lang="scss">
  @import 'src/lib/style/variables';

  footer {
    margin: 1.5em auto 2em;
    width: 360px;
    max-width: calc(100% - 2em);
    font-size: $font-size-small;
    color: $color-text-light;
    text-align: center;
  }
</style>
