<script lang="ts">
  import PageMeta from '$lib/components/PageMeta.svelte';
  import View from '$lib/components/View.svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const client = new QueryClient();
</script>

<PageMeta title="View diagram" />
<QueryClientProvider {client}>
  <View />
</QueryClientProvider>
