<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import NotificationModal from '$lib/components/NotificationModal.svelte';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import SubmitButton from '$lib/components/SubmitButton.svelte';
  import TextareaInput from '$lib/components/TextareaInput.svelte';
  import { validateCollections } from '$lib/diagram';
  import { encode } from 'js-base64';
  import { fade } from 'svelte/transition';

  let fileInput: HTMLInputElement;
  let code = '';
  let error = false;

  const handleFileInputChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        code = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  };

  const handleClear = (e: MouseEvent) => {
    e.preventDefault();
    code = '';
  };

  const handleSubmit = () => {
    try {
      const data = JSON.parse(code);
      validateCollections(data);
      goto(`/view#${encode(JSON.stringify(data))}`);
    } catch {
      error = true;
    }
  };
</script>

<PageMeta title="Import server collections" />
<div class="root" in:fade>
  <input bind:this={fileInput} type="file" accept=".json" on:change={handleFileInputChange} />
  <Card>
    <form on:submit|preventDefault={handleSubmit}>
      <div>
        Paste below the PocketBase collections or
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="load-json" role="button" on:click={() => fileInput.click()}
          >load them from a JSON file</a
        >.
      </div>
      <TextareaInput code rows={15} bind:value={code} label="Collections code" required />
      <div class="buttons">
        <SubmitButton title="View diagram" disabled={code === ''} />
        {#if code !== ''}
          <div class="clear" in:fade>
            <Button outlined on:click={handleClear}>Clear</Button>
          </div>
        {/if}
      </div>
    </form>
  </Card>
</div>
{#if error}
  <NotificationModal title="Error" on:dismiss={() => (error = false)}>
    <p>
      The provided code is either an invalid JSON or comes from a newer server version and
      PocketBaseUML doesn't know how to draw its diagram.
    </p>
  </NotificationModal>
{/if}

<style lang="scss">
  @import 'src/lib/style/variables';

  .root {
    margin: 0 auto;
    width: 1000px;
    max-width: calc(100vw - 2em);
  }

  input {
    display: none;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.875em;
  }

  .load-json {
    cursor: pointer;
  }

  .buttons {
    display: flex;
    gap: 1.875em;
    flex-direction: column;
    @media (min-width: 420px) {
      flex-direction: row-reverse;
      justify-content: space-between;
    }
  }

  .clear :global(button) {
    width: 100%;
  }
</style>
