import { nanoid } from 'nanoid';
import { Status } from '../models/todo';

export const dummyData = [
  {
    id: nanoid(),
    status: Status.DONE,
    title: 'Consult the docs',
    ref: undefined,
  },
  {
    id: nanoid(),
    status: Status.DONE,
    title: 'Learn SQL',
    ref: undefined,
  },
  {
    id: nanoid(),
    status: Status.IN_PROGRESS,
    title: 'Study TypeScript',
    ref: undefined,
  },
  {
    id: nanoid(),
    status: Status.BACKLOG,
    title: 'Daily stand-up',
    ref: undefined,
  },
  {
    id: nanoid(),
    status: Status.BACKLOG,
    title: 'Read MDN',
    ref: undefined,
  },
  {
    id: nanoid(),
    status: Status.REVIEW,
    title: 'Fix bugs',
    ref: undefined,
  },
  {
    id: nanoid(),
    status: Status.BACKLOG,
    title: 'Learn XState',
    ref: undefined,
  },
  {
    id: nanoid(),
    status: Status.IN_PROGRESS,
    title: 'Make Svelte app',
    ref: undefined,
  },
];
