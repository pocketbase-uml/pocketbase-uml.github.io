<script lang="ts">
  import '$lib/style/global.scss';

  import { navigating } from '$app/stores';
  import { log } from '$lib/analytics';
  import { onMount } from 'svelte';

  onMount(() => {
    log(location.pathname);
  });

  $: if ($navigating && $navigating.to && $navigating.to.url.pathname !== location.pathname)
    log($navigating.to.url.pathname);
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Source+Sans+Pro:ital,wght@0,400;0,600;1,400;1,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<slot />
