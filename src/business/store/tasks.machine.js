import { spawn } from 'xstate';
import { nanoid } from 'nanoid';
import { createTaskMachine } from './task.machine';
import { createModel } from 'xstate/lib/model';
import { Status } from '../../models/task';

const createTask = (title) => {
  return {
    id: nanoid(),
    title,
    status: Status.BACKLOG,
  };
};

const tasksModel = createModel(
  {
    task: '',
    tasks: [],
  },
  {
    events: {
      'NEWTASK.COMMIT': (value) => ({ value }),
      'TASK.COMMIT': (task) => ({ task }),
      'TASK.DELETE': (id) => ({ id }),
    },
  }
);

export const tasksMachine = tasksModel.createMachine({
  id: 'tasks',
  context: tasksModel.initialContext,
  initial: 'loading',
  states: {
    loading: {
      entry: tasksModel.assign({
        tasks: (context) => {
          return context.tasks.map((task) => ({
            ...task,
            ref: spawn(createTaskMachine(task)),
          }));
        },
      }),
      always: 'ready',
    },
    ready: {},
  },
  on: {
    'NEWTASK.COMMIT': {
      actions: [
        tasksModel.assign({
          task: '', // clear task
          tasks: (context, event) => {
            const newTask = createTask(event.value.trim());
            return context.tasks.concat({
              ...newTask,
              ref: spawn(createTaskMachine(newTask)),
            });
          },
        }),
        'persist',
      ],
      cond: (_, event) => !!event.value.trim().length,
    },
    'TASK.COMMIT': {
      actions: [
        tasksModel.assign({
          tasks: (context, event) =>
            context.tasks.map((task) => {
              return task.id === event.task.id
                ? { ...task, ...event.task, ref: task.ref }
                : task;
            }),
        }),
        'persist',
      ],
    },
    'TASK.DELETE': {
      actions: [
        tasksModel.assign({
          tasks: (context, event) =>
            context.tasks.filter((task) => task.id !== event.id),
        }),
        'persist',
      ],
    },
  },
});
