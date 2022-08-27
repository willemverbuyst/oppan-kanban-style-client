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
  return todoModel.createMachine({
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
        },
      },
      deleted: {
        entry: sendParent((context) => ({
          type: 'TODO.DELETE',
          id: context.id,
        })),
      },
    },
  });
};
