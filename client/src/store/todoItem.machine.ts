import { sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { Status } from '../models/status';

const todoModel = createModel(
  {
    id: '',
    title: '',
    prevTitle: '',
    status: '',
  },
  {
    events: {
      SET_BACKLOG: () => ({}),
      SET_IN_PROGRESS: () => ({}),
      SET_REVIEW: () => ({}),
      SET_DONE: () => ({}),
      DELETE: () => ({}),
      EDIT: () => ({}),
      CHANGE: (value: string) => ({ value }),
      COMMIT: () => ({}),
      BLUR: () => ({}),
      CANCEL: () => ({}),
    },
  }
);

export const createTodoMachine = ({
  id,
  title,
  status,
}: {
  id: string;
  title: string;
  status: typeof Status[keyof typeof Status];
}) => {
  return todoModel.createMachine(
    {
      id: 'todo',
      initial: 'reading',
      context: {
        id,
        title,
        status,
        prevTitle: title,
      },
      on: {
        SET_BACKLOG: {
          actions: [
            todoModel.assign({ status: Status.BACKLOG }),
            sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
          ],
        },
        SET_IN_PROGRESS: {
          actions: [
            todoModel.assign({ status: Status.IN_PROGRESS }),
            sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
          ],
        },
        SET_REVIEW: {
          actions: [
            todoModel.assign({ status: Status.REVIEW }),
            sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
          ],
        },
        SET_DONE: {
          actions: [
            todoModel.assign({ status: Status.DONE }),
            sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
          ],
        },
        DELETE: 'deleted',
      },
      states: {
        reading: {
          on: {
            SET_BACKLOG: {
              actions: [todoModel.assign({ status: Status.BACKLOG }), 'commit'],
            },
            SET_IN_PROGRESS: {
              actions: [
                todoModel.assign({ status: Status.IN_PROGRESS }),
                'commit',
              ],
            },
            SET_REVIEW: {
              actions: [todoModel.assign({ status: Status.REVIEW }), 'commit'],
            },
            SET_DONE: {
              actions: [todoModel.assign({ status: Status.DONE }), 'commit'],
            },
            EDIT: {
              target: 'editing',
              actions: 'focusInput',
            },
          },
        },
        editing: {
          entry: todoModel.assign({ prevTitle: (context) => context.title }),
          on: {
            CHANGE: {
              actions: todoModel.assign({
                title: (_, event) => event.value,
              }),
            },
            COMMIT: [
              {
                target: 'reading',
                actions: sendParent((context) => ({
                  type: 'TODO.COMMIT',
                  todo: context,
                })),
                cond: (context) => context.title.trim().length > 0,
              },
              { target: 'deleted' },
            ],
            BLUR: {
              target: 'reading',
              actions: sendParent((context) => ({
                type: 'TODO.COMMIT',
                todo: context,
              })),
            },
            CANCEL: {
              target: 'reading',
              actions: todoModel.assign({
                title: (context) => context.prevTitle,
              }),
            },
          },
        },
        deleted: {
          entry: sendParent((context) => ({
            type: 'TODO.DELETE',
            id: context.id,
          })),
        },
      },
    },
    {
      actions: {
        commit: sendParent((context) => ({
          type: 'TODO.COMMIT',
          todo: context,
        })),
        focusInput: () => {},
      },
    }
  );
};
