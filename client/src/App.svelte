<script lang="ts">
  import Header from './ui/Header.svelte';
  import NewTodoInput from './ui/NewTodoInput.svelte';
  import TaskDone from './ui/TaskDone.svelte';
  import TaskInProgress from './ui/TaskInProgress.svelte';
  import TaskReview from './ui/TaskReview.svelte';
  import TaskTodo from './ui/TaskTodo.svelte';
  import dummyData from './data/dummy-data.json';
  import type { Task } from './models/task';

  let tasks: Task[] = dummyData;
  let uid = tasks.length + 1;

  function add(event) {
    const task = {
      id: uid++,
      status: 'todo',
      description: event.detail.text,
    };

    tasks = [task, ...tasks];
  }

  function remove(task) {
    tasks = tasks.filter((t) => t.id !== task.detail.taskId);
  }
</script>

<Header />
<NewTodoInput on:addTodo={add} />
<div class="board">
  <TaskTodo bind:tasks on:removeTask={remove} />
  <TaskInProgress bind:tasks on:removeTask={remove} />
  <TaskReview bind:tasks on:removeTask={remove} />
  <TaskDone bind:tasks on:removeTask={remove} />
</div>

<style>
  .board {
    width: 90%;
    margin: 0 auto;
  }
</style>
