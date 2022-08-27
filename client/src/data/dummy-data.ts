import { nanoid } from 'nanoid';
import { Status } from '../models/status';

export const dummyData = [
  {
    id: nanoid(),
    status: Status.DONE,
    title: 'Consult the docs',
  },
  {
    id: nanoid(),
    status: Status.DONE,
    title: 'Learn SQL',
  },
  {
    id: nanoid(),
    status: Status.IN_PROGRESS,
    title: 'Study TypeScript',
  },
  {
    id: nanoid(),
    status: Status.BACKLOG,
    title: 'Daily stand-up',
  },
  {
    id: nanoid(),
    status: Status.BACKLOG,
    title: 'Read MDN',
  },
  {
    id: nanoid(),
    status: Status.REVIEW,
    title: 'Fix bugs',
  },
  {
    id: nanoid(),
    status: Status.BACKLOG,
    title: 'Learn XState',
  },
  {
    id: nanoid(),
    status: Status.IN_PROGRESS,
    title: 'Make Svelte app',
  },
];
