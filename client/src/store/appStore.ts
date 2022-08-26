import { writable } from 'svelte/store';

let darkModeOn = writable(false);

export const darkModeStore = {
  subscribe: darkModeOn.subscribe,

  toggleDarkMode: () => {
    darkModeOn.update((mode) => !mode);
  },
};
