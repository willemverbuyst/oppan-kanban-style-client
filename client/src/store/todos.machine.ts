import { spawn, ActorRef } from 'xstate';
import { nanoid } from 'nanoid';
import { createTodoMachine } from './todoItem.machine';
import { createModel } from 'xstate/lib/model';
import { Status } from '../models/status';
import type { Todo } from '../models/task';

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
    todos: [] as Todo[],
    filter: 'all',
  },
  {
    events: {
      'NEWTODO.CHANGE': (value: string) => ({ value }),
      'NEWTODO.COMMIT': (value: string) => ({ value }),
      'TODO.COMMIT': (todo: Todo) => ({ todo }),
      'TODO.DELETE': (id: string) => ({ id }),
      SHOW: (filter: string) => ({ filter }),
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
          // "Rehydrate" persisted todos
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
    'NEWTODO.CHANGE': {
      actions: todosModel.assign({
        todo: (_, event) => event.value,
      }),
    },
    'NEWTODO.COMMIT': {
      actions: [
        todosModel.assign({
          todo: '', // clear todo
          todos: (context, event) => {
            console.log('value', event.value);
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
    'TODO.COMMIT': {
      actions: [
        todosModel.assign({
          todos: (context, event) =>
            context.todos.map((todo) => {
              return todo.id === event.todo.id
                ? { ...todo, ...event.todo, ref: todo.ref }
                : todo;
            }),
        }),
        'persist',
      ],
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
    SHOW: {
      actions: todosModel.assign({
        filter: (_, event) => event.filter,
      }),
    },
    'MARK.backlog': {
      actions: (context) => {
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
