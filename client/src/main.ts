import { inspect } from '@xstate/inspect';
import App from './App.svelte';

inspect({
  // options
  // url: 'https://stately.ai/viz?inspect', // (default)
  iframe: false, // open in new window
});

const app = new App({
  target: document.body,
  props: {},
});

export default app;
