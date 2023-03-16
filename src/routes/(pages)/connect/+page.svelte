<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import NotificationModal from '$lib/components/NotificationModal.svelte';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import SubmitButton from '$lib/components/SubmitButton.svelte';
  import TextInput from '$lib/components/TextInput.svelte';
  import { LOCAL_STORAGE_CONNECTION_KEY } from '$lib/config';
  import { decode, encode } from 'js-base64';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let url = '';
  let email = '';
  let password = '';
  let secure = false;
  let securityMismatchError = false;

  onMount(() => {
    const connection = localStorage.getItem(LOCAL_STORAGE_CONNECTION_KEY);
    secure = window.location.protocol === 'https:';
    try {
      if (connection) {
        ({ url, email, password } = JSON.parse(decode(connection)));
      }
    } catch {}
  });

  const handleSubmit = () => {
    if (secure && !url.startsWith('https://')) {
      securityMismatchError = true;
      return;
    }

    localStorage.setItem(
      LOCAL_STORAGE_CONNECTION_KEY,
      encode(JSON.stringify({ url, email, password }))
    );
    goto('/view');
  };
</script>

<PageMeta title="Connect to a server" />
<div class="root" in:fade>
  <Card>
    <form on:submit|preventDefault={handleSubmit}>
      <TextInput
        bind:value={url}
        label="PocketBase Server{secure ? ' (https)' : ''}"
        type="url"
        required
        placeholder="i.e. {secure ? 'https://abcd-...-cdef.eu.ngrok.io' : 'http://localhost:8090'}"
      />
      <TextInput bind:value={email} label="Admin" type="email" required />
      <TextInput bind:value={password} label="Password" type="password" required />
      <SubmitButton large title="View diagram" />
    </form>
  </Card>
</div>
{#if securityMismatchError}
  <NotificationModal title="Security mismatch" on:dismiss={() => (securityMismatchError = false)}>
    <p>
      PocketBaseUML cannot connect to this server because browsers block accessing unsecure
      <strong>http</strong> resources from <strong>https</strong> websites.
    </p>
    <p>You can either:</p>
    <ul>
      <li>run PocketBaseUML locally to access your server;</li>
      <li>
        use a secure tunneling service like <a
          href="https://ngrok.com/"
          target="_blank"
          rel="noreferrer">ngrok</a
        > to expose your server though https;
      </li>
      <li>
        <a
          href="{url.replace(/\/$/, '')}/_/#/settings/export-collections"
          target="_blank"
          rel="noreferrer">export the collections JSON from the server</a
        >
        and paste it <a href="/import">here</a>.
      </li>
    </ul>
  </NotificationModal>
{/if}

<style lang="scss">
  @import 'src/lib/style/variables';

  div {
    margin: 0 auto;
    width: 360px;
    max-width: calc(100vw - 2em);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.875em;
  }

  ul {
    margin-left: 1.25em;
    list-style: disc;
  }
</style>
