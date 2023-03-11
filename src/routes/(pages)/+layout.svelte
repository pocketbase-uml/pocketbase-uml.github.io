<script lang="ts">
  import PageFooter from '$lib/components/PageFooter.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<div>
  <PageHeader />
  <main>
    <slot />
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
