import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({ pages: 'app', assets: 'app' }),
      prerender: { handleMissingId: 'ignore' },
      appDir: 'a'
    })
  ],
  test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
