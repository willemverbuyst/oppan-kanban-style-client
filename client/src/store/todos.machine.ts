import { spawn, actions, ActorRef } from 'xstate';
import { nanoid } from 'nanoid';
import { createTodoMachine } from './todoItem.machine';
import { createModel } from 'xstate/lib/model';
import { Status } from '../models/status';
import { dummyData } from '../data/dummy-data';

export interface Todo {
  id: string;
  title: string;
  status: string;
  ref: ActorRef<any>;
}

const createTodo = (title: string) => {
  return {
    id: nanoid(),
    title,
    status: Status.BACKLOG,
  };
};

const todosModel = createModel(
  {
    todo: '',
    todos: dummyData,
    filter: 'all',
  },
  {
    events: {
      'NEWTODO.COMMIT': (value: string) => ({ value }),
      'TODO.DELETE': (id: string) => ({ id }),
      'MARK.backlog': () => ({}),
      'MARK.in_progress': () => ({}),
      'MARK.review': () => ({}),
      'MARK.done': () => ({}),
    },
  }
);

export const todosMachine = todosModel.createMachine({
  id: 'todos',
  context: todosModel.initialContext,
  initial: 'loading',
  states: {
    loading: {
      entry: todosModel.assign({
        todos: (context) => {
          return context.todos.map((todo) => ({
            ...todo,
            ref: spawn(createTodoMachine(todo)),
          }));
        },
      }),
      always: 'ready',
    },
    ready: {},
  },
  on: {
    'NEWTODO.COMMIT': {
      actions: [
        todosModel.assign({
          todo: '', // clear todo
          todos: (context, event) => {
            const newTodo = createTodo(event.value.trim());
            return context.todos.concat({
              ...newTodo,
              ref: spawn(createTodoMachine(newTodo)),
            });
          },
        }),
        'persist',
      ],
      cond: (_, event) => !!event.value.trim().length,
    },
    'TODO.DELETE': {
      actions: [
        todosModel.assign({
          todos: (context, event) =>
            context.todos.filter((todo) => todo.id !== event.id),
        }),
        'persist',
      ],
    },
    'MARK.backlog': {
      actions: (context) => {
        console.log('test');
        context.todos.forEach((todo) => todo.ref.send('SET_BACKLOG'));
      },
    },
    'MARK.in_progress': {
      actions: (context) => {
        context.todos.forEach((todo) => todo.ref.send('SET_ACTIVE'));
      },
    },
    'MARK.review': {
      actions: (context) => {
        context.todos.forEach((todo) => todo.ref.send('SET_REVIEW'));
      },
    },
    'MARK.done': {
      actions: (context) => {
        context.todos.forEach((todo) => todo.ref.send('SET_DONE'));
      },
    },
  },
});
