import type { ActorRef } from 'xstate';
import type { Status } from './status';

export interface Task {
  id: string;
  status: string;
  done?: boolean;
  title: string;
}
