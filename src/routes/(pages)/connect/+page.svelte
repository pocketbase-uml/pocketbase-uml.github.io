<script lang="ts">
  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';
  import Card from '#lib/components/Card.svelte';
  import NotificationModal from '#lib/components/NotificationModal.svelte';
  import PageMeta from '#lib/components/PageMeta.svelte';
  import SubmitButton from '#lib/components/SubmitButton.svelte';
  import TextInput from '#lib/components/TextInput.svelte';
  import { LOCAL_STORAGE_CONNECTION_KEY } from '#lib/config.ts';
  import { decode, encode } from 'js-base64';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let url = $state('');
  let email = $state('');
  let password = $state('');
  let secure = $state(false);
  let securityMismatchError = $state(false);

  onMount(() => {
    const connection = localStorage.getItem(LOCAL_STORAGE_CONNECTION_KEY);
    secure = window.location.protocol === 'https:';
    try {
      if (connection) {
        ({ url, email, password } = JSON.parse(decode(connection)));
      }
    } catch {
      // Ignore invalid or outdated stored connection data
    }
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
    goto(resolve('view'));
  };
</script>

<PageMeta title="Connect to a server" />
<div class="root" in:fade>
  <Card>
    <form
      onsubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <TextInput
        bind:value={url}
        label="PocketBase Server{secure ? ' (https)' : ''}"
        type="url"
        required
        placeholder="i.e. {secure ? 'https://abcd-...-cdef.eu.ngrok.io' : 'http://localhost:8090'}"
      />
      <TextInput bind:value={email} label="Superuser email" type="email" required />
      <TextInput bind:value={password} label="Password" type="password" required />
      <SubmitButton large title="View diagram" />
    </form>
  </Card>
</div>
{#if securityMismatchError}
  <NotificationModal title="Security mismatch" ondismiss={() => (securityMismatchError = false)}>
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
          rel="external noreferrer">ngrok</a
        > to expose your server though https;
      </li>
      <li>
        <a
          href="{url.replace(/\/$/, '')}/_/#/settings/export-collections"
          target="_blank"
          rel="external noreferrer">export the collections JSON from the server</a
        >
        and paste it <a href={resolve('import')}>here</a>.
      </li>
    </ul>
  </NotificationModal>
{/if}

<style lang="scss">
  @use '../../../lib/style/variables' as *;

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
