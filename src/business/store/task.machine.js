import { sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { State, Status } from '../../models/task';

const taskModel = createModel(
  {
    id: '',
    title: '',
    status: '',
  },
  {
    events: {
      MOVE_TO_BACKLOG: () => ({}),
      MOVE_TO_IN_PROGRESS: () => ({}),
      MOVE_TO_REVIEW: () => ({}),
      MOVE_TO_DONE: () => ({}),
      DELETE: () => ({}),
    },
  }
);

export const createTaskMachine = ({ id, title, status }) => {
  return taskModel.createMachine(
    {
      id: 'task',
      initial: status,
      context: {
        id,
        title,
        status,
      },
      states: {
        [State.BACKLOG]: {
          on: {
            MOVE_TO_IN_PROGRESS: {
              target: State.IN_PROGRESS,
              actions: [
                taskModel.assign({ status: Status.IN_PROGRESS }),
                'commit',
              ],
            },
            DELETE: State.DELETED,
          },
        },
        [State.IN_PROGRESS]: {
          on: {
            MOVE_TO_BACKLOG: {
              target: State.BACKLOG,
              actions: [taskModel.assign({ status: Status.BACKLOG }), 'commit'],
            },
            MOVE_TO_REVIEW: {
              target: State.REVIEW,
              actions: [taskModel.assign({ status: Status.REVIEW }), 'commit'],
            },
            DELETE: State.DELETED,
          },
        },
        [State.REVIEW]: {
          on: {
            MOVE_TO_IN_PROGRESS: {
              target: State.IN_PROGRESS,
              actions: [
                taskModel.assign({ status: Status.IN_PROGRESS }),
                'commit',
              ],
            },
            MOVE_TO_DONE: {
              target: State.DONE,
              actions: [taskModel.assign({ status: Status.DONE }), 'commit'],
            },
            DELETE: State.DELETED,
          },
        },
        [State.DONE]: {
          on: {
            MOVE_TO_REVIEW: {
              target: State.REVIEW,
              actions: [taskModel.assign({ status: Status.REVIEW }), 'commit'],
            },
            DELETE: State.DELETED,
          },
        },
        [State.DELETED]: {
          entry: sendParent((context) => ({
            type: 'TASK.DELETE',
            id: context.id,
          })),
        },
      },
    },
    {
      actions: {
        commit: sendParent((context) => ({
          type: 'TASK.COMMIT',
          task: context,
        })),
      },
    }
  );
};
