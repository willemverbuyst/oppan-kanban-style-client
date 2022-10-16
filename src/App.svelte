<script lang="ts">
  import Header from './ui/Header.svelte';
  import TaskInProgress from './ui/TaskInProgress.svelte';
  import TaskBacklog from './ui/TaskBacklog.svelte';
  import { tasksMachine } from './business/store/tasks.machine';
  import { useMachine } from '@xstate/svelte';
  import { Status } from './models/task';
  import TaskDone from './ui/TaskDone.svelte';
  import TaskReview from './ui/TaskReview.svelte';
  import NewTaskInput from './ui/NewTaskInput.svelte';
  import type { Task } from './business/store/tasks.machine';
  import { dummyData } from './data/dummy-data';

  const persistedTasksMachine = tasksMachine.withConfig(
    {
      actions: {
        persist: (ctx) => {
          try {
            console.log('to be save to db');
          } catch (e) {
            console.error(e);
          }
        },
      },
    },
    {
      task: '',
      tasks: (() => {
        try {
          return (dummyData as Task[]) || [];
        } catch (e) {
          console.error(e);
          return [];
        }
      })(),
    }
  );

  const { state, send } = useMachine(persistedTasksMachine);

  $: ({ tasks } = $state.context);
  $: backlogTasks = filterOnStatus(tasks, Status.BACKLOG);
  $: inProgressTasks = filterOnStatus(tasks, Status.IN_PROGRESS);
  $: reviewTasks = filterOnStatus(tasks, Status.REVIEW);
  $: doneTasks = filterOnStatus(tasks, Status.DONE);

  function filterOnStatus(
    tasks: Task[],
    status: typeof Status[keyof typeof Status]
  ): Task[] {
    return [...tasks].filter((task) => task.status === status);
  }

  function add(event) {
    send({ type: 'NEWTASK.COMMIT', value: event.detail.text });
  }
</script>

<Header />
<NewTaskInput on:addTask={add} />
<div class="board">
  <div class="backlog">
    <h2>backlog</h2>
    {#each backlogTasks as backlogTodo (backlogTodo.id)}
      <TaskBacklog actor={backlogTodo.ref} />
    {/each}
  </div>

  <div class="in-progress">
    <h2>in progress</h2>
    {#each inProgressTasks as inProgressTodo (inProgressTodo.id)}
      <TaskInProgress actor={inProgressTodo.ref} />
    {/each}
  </div>

  <div class="review">
    <h2>review</h2>
    {#each reviewTasks as reviewTodo (reviewTodo.id)}
      <TaskReview actor={reviewTodo.ref} />
    {/each}
  </div>

  <div class="done">
    <h2>done</h2>
    {#each doneTasks as doneTodo (doneTodo.id)}
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
