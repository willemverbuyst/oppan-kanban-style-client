import { sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { Status } from '../models/status';

const todoModel = createModel(
  {
    id: '',
    title: '',
    status: '',
  },
  {
    events: {
      SET_STATUS_BACKLOG: () => ({}),
      SET_STATUS_IN_PROGRESS: () => ({}),
      SET_STATUS_REVIEW: () => ({}),
      SET_STATUS_DONE: () => ({}),
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
    initial: 'backlog',
    context: {
      id,
      title,
      status,
    },
    on: {
      SET_STATUS_BACKLOG: {
        actions: [
          todoModel.assign({ status: Status.BACKLOG }),
          sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
        ],
      },
      SET_STATUS_IN_PROGRESS: {
        actions: [
          todoModel.assign({ status: Status.IN_PROGRESS }),
          sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
        ],
      },
      SET_STATUS_REVIEW: {
        actions: [
          todoModel.assign({ status: Status.REVIEW }),
          sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
        ],
      },
      SET_STATUS_DONE: {
        actions: [
          todoModel.assign({ status: Status.DONE }),
          sendParent((context) => ({ type: 'TODO.COMMIT', todo: context })),
        ],
      },
    },
    states: {
      backlog: {
        on: {
          SET_STATUS_IN_PROGRESS: {
            target: 'in_progress',
            actions: [
              todoModel.assign({ status: Status.IN_PROGRESS }),
              'commit',
            ],
          },
          DELETE: 'deleted',
        },
      },
      in_progress: {
        on: {
          SET_STATUS_BACKLOG: {
            target: 'backlog',
            actions: [todoModel.assign({ status: Status.BACKLOG }), 'commit'],
          },
          SET_STATUS_REVIEW: {
            target: 'review',
            actions: [todoModel.assign({ status: Status.REVIEW }), 'commit'],
          },
          DELETE: 'deleted',
        },
      },
      review: {
        on: {
          SET_STATUS_IN_PROGRESS: {
            target: 'in_progress',
            actions: [
              todoModel.assign({ status: Status.IN_PROGRESS }),
              'commit',
            ],
          },
          SET_STATUS_DONE: {
            target: 'done',
            actions: [todoModel.assign({ status: Status.DONE }), 'done'],
          },
          DELETE: 'deleted',
        },
      },
      done: {
        on: {
          SET_STATUS_REVIEW: {
            target: 'review',
            actions: [todoModel.assign({ status: Status.REVIEW }), 'commit'],
          },
          DELETE: 'deleted',
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
