<script lang="ts">
  import PageFooter from '#lib/components/PageFooter.svelte';
  import PageHeader from '#lib/components/PageHeader.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div>
  <PageHeader />
  <main>
    {@render children?.()}
  </main>
  <PageFooter />
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
  }
</style>
