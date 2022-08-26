import { createMachine } from 'xstate';

export const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'darkModeOff',
  states: {
    darkModeOff: {
      on: { TOGGLE: 'darkModeOn' },
    },
    darkModeOn: {
      on: { TOGGLE: 'darkModeOff' },
    },
  },
});
