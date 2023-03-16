<script lang="ts">
  import { log } from '$lib/analytics';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import View from '$lib/components/View.svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { onMount } from 'svelte';

  const client = new QueryClient();

  onMount(log);
</script>

<PageMeta title="View diagram" />
<QueryClientProvider {client}>
  <View />
</QueryClientProvider>
