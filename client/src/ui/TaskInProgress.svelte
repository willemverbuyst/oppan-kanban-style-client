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

<div class="in-progress">
  <h2>in progress</h2>
  {#each tasks.filter((t) => t.status === Status.IN_PROGRESS) as task (task.id)}
    <label
      in:receive={{ key: task.id }}
      out:send={{ key: task.id }}
      animate:flip
    >
      <input type="checkbox" on:change={() => (task.status = Status.REVIEW)} />
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

  .in-progress {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .in-progress label {
    background-color: var(--label-bg-in-progress);
  }
</style>
