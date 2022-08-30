import { spawn, ActorRef } from 'xstate';
import { nanoid } from 'nanoid';
import { createTaskMachine } from './task.machine';
import { createModel } from 'xstate/lib/model';
import { Status } from '../../models/task';

export interface Task {
  id: string;
  title: string;
  status: typeof Status[keyof typeof Status];
  ref: ActorRef<any>;
}

const createTask = (title: string) => {
  return {
    id: nanoid(),
    title,
    status: Status.BACKLOG,
  };
};

const tasksModel = createModel(
  {
    task: '',
    tasks: [] as Task[],
  },
  {
    events: {
      'NEWTASK.COMMIT': (value: string) => ({ value }),
      'TASK.COMMIT': (task: Task) => ({ task }),
      'TASK.DELETE': (id: string) => ({ id }),
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
