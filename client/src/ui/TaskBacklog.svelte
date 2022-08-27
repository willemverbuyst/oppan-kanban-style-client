<script lang="ts">
  import { flip } from 'svelte/animate';
  import { createEventDispatcher } from 'svelte';
  import { receive, send } from '../business/crossfade';
  import type { Task } from '../models/task';
  import { Status } from '../models/status';

  export let tasks: Task[];

  const dispatch = createEventDispatcher();

  function removeTask(task) {
    dispatch('removeTask', { taskId: task.id });
  }
</script>

<div class="todo">
  <h2>backlog</h2>
  {#each tasks.filter((t) => t.status === Status.BACKLOG) as task (task.id)}
    <label
      in:receive={{ key: task.id }}
      out:send={{ key: task.id }}
      animate:flip
    >
      <input
        type="checkbox"
        on:click={() => (task.status = Status.IN_PROGRESS)}
      />
      {task.title}
      <button on:click={() => removeTask(task)}>x</button>
    </label>
  {/each}
</div>

<style>
  input[type='checkbox'] {
    visibility: hidden;
  }

  button {
    float: right;
    height: 1em;
    box-sizing: border-box;
    padding: 0 0.5em;
    line-height: 1;
    background-color: transparent;
    border: none;
    color: var(--text-color-dark);
    opacity: 0;
    transition: opacity 0.2s;
  }

  label:hover button {
    opacity: 1;
  }

  .todo {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .todo label {
    background-color: var(--label-bg-todo);
  }
</style>
