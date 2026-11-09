<script lang="ts">
  import 'the-new-css-reset/css/reset.css';
  import '#lib/style/global.scss';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&family=Source+Sans+Pro:ital,wght@0,400;0,600;1,400;1,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children?.()}
