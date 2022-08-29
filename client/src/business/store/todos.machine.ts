import { spawn, ActorRef } from 'xstate';
import { nanoid } from 'nanoid';
import { createTodoMachine } from './todo.machine';
import { createModel } from 'xstate/lib/model';
import { Status } from '../../models/todo';
import { dummyData } from '../../data/dummy-data';

export interface Todo {
  id: string;
  title: string;
  status: typeof Status[keyof typeof Status];
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
    todos: dummyData as Todo[],
  },
  {
    events: {
      'NEWTODO.COMMIT': (value: string) => ({ value }),
      'TODO.COMMIT': (todo: Todo) => ({ todo }),
      'TODO.DELETE': (id: string) => ({ id }),
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
  },
});
