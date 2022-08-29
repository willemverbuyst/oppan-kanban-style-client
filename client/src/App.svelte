<script lang="ts">
  import Header from './ui/Header.svelte';
  import TaskInProgress from './ui/TaskInProgress.svelte';
  import TaskBacklog from './ui/TaskBacklog.svelte';
  import { todosMachine } from './business/store/todos.machine';
  import { useMachine } from '@xstate/svelte';
  import { Status } from './models/todo';
  import TaskDone from './ui/TaskDone.svelte';
  import TaskReview from './ui/TaskReview.svelte';
  import NewTodoInput from './ui/NewTodoInput.svelte';
  import type { Todo } from './business/store/todos.machine';

  const { state, send } = useMachine(todosMachine, { devTools: true });

  $: ({ todos } = $state.context);
  $: backlogTodos = filterOnStatus(todos, Status.BACKLOG);
  $: inProgressTodos = filterOnStatus(todos, Status.IN_PROGRESS);
  $: reviewTodos = filterOnStatus(todos, Status.REVIEW);
  $: doneTodos = filterOnStatus(todos, Status.DONE);

  function filterOnStatus(
    todos: Todo[],
    status: typeof Status[keyof typeof Status]
  ): Todo[] {
    return [...todos].filter((todo) => todo.status === status);
  }

  function add(event) {
    send({ type: 'NEWTODO.COMMIT', value: event.detail.text });
  }
</script>

<Header />
<NewTodoInput on:addTodo={add} />
<div class="board">
  <div class="backlog">
    <h2>backlog</h2>
    {#each backlogTodos as backlogTodo (backlogTodo.id)}
      <TaskBacklog actor={backlogTodo.ref} />
    {/each}
  </div>

  <div class="in-progress">
    <h2>in progress</h2>
    {#each inProgressTodos as inProgressTodo (inProgressTodo.id)}
      <TaskInProgress actor={inProgressTodo.ref} />
    {/each}
  </div>

  <div class="review">
    <h2>review</h2>
    {#each reviewTodos as reviewTodo (reviewTodo.id)}
      <TaskReview actor={reviewTodo.ref} />
    {/each}
  </div>

  <div class="done">
    <h2>done</h2>
    {#each doneTodos as doneTodo (doneTodo.id)}
      <TaskDone actor={doneTodo.ref} />
    {/each}
  </div>
</div>

<style>
  .board {
    width: 90%;
    margin: 0 auto;
  }

  h2 {
    text-align: center;
  }

  .in-progress {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .backlog {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .review {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .done {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }
</style>
