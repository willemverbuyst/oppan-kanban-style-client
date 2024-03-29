export const Actions = {
  MOVE_TO_BACKLOG: 'MOVE_TO_BACKLOG',
  MOVE_TO_IN_PROGRESS: 'MOVE_TO_IN_PROGRESS',
  MOVE_TO_REVIEW: 'MOVE_TO_REVIEW',
  MOVE_TO_DONE: 'MOVE_TO_DONE',
  DELETE: 'DELETE',
};

export const Status = {
  BACKLOG: 'BACKLOG',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
};

export const State = { ...Status, DELETED: 'DELETED' };
