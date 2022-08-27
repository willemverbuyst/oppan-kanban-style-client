import type { ActorRef } from 'xstate';
import type { Status } from './status';

export interface Task {
  id: string;
  status: string;
  done?: boolean;
  title: string;
}

export interface Todo {
  id: string;
  title: string;
  status: Status;
  ref: ActorRef<any>;
}
