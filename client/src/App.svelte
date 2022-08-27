<script lang="ts">
  import Header from './ui/Header.svelte';
  import NewTodoInput from './ui/NewTodoInput.svelte';
  import TaskDone from './ui/TaskDone.svelte';
  import TaskInProgress from './ui/TaskInProgress.svelte';
  import TaskReview from './ui/TaskReview.svelte';
  import TaskBacklog from './ui/TaskBacklog.svelte';
  import { todosMachine } from './store/todos.machine';
  import { interpret } from 'xstate';

  let todos;
  const todosService = interpret(todosMachine)
    .onTransition((state) => {
      todos = state.context.todos;
    })
    .start();

  function remove(todoId) {
    todosService.send({ type: 'TODO.DELETE', id: todoId.detail });
  }

  function add(event) {
    todosService.send({ type: 'NEWTODO.COMMIT', value: event.detail.text });
  }
</script>

<Header />
<NewTodoInput on:addTodo={add} />
<div class="board">
  <TaskBacklog bind:todos on:removeTodo={remove} />
  <TaskInProgress bind:todos on:removeTodo={remove} />
  <TaskReview bind:todos on:removeTodo={remove} />
  <TaskDone bind:todos on:removeTodo={remove} />
</div>

<style>
  .board {
    width: 90%;
    margin: 0 auto;
  }
</style>
