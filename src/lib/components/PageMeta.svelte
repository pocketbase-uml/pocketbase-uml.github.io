<script lang="ts">
  import { PUBLIC_URL } from '$lib/config';

  const image = `${PUBLIC_URL}/pocketbase-uml-og.png`;
  export let title: string | undefined = undefined;
  export let description =
    'The PocketBase visual perspective: a free, open-source web application that generates UML diagrams from PocketBase databases';
  export let keywords =
    'pocketbase, uml, diagram, database, schema, model, visualization, generator, free, open-source';

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
  <meta property="og:image" content={image} />
  <meta
    property="og:image:alt"
    content="PocketBaseUML is a free, open-source web application that generates UML diagrams from PocketBase databases"
  />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:url" content={PUBLIC_URL} />
</svelte:head>
