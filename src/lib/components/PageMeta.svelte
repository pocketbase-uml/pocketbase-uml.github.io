<script lang="ts">
  export let title: string | undefined = undefined;
  export let description = 'The PocketBase visual perspective';
  export let keywords = 'pocketbase, uml, diagram, database, schema, visual';

  const titleValue = `${title ? `${title} | ` : ''}PocketBaseUML`;
</script>

<svelte:head>
  <title>{titleValue}</title>
  <meta property="og:title" content={titleValue} />
  <meta name="twitter:title" content={titleValue} />
  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
  <meta name="twitter:description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="author" content="Ionut-Cristian Florescu" />
  <meta name="twitter:creator" content="@icflorescu" />
  <meta property="og:site_name" content="PocketBaseUML" />
</svelte:head>
