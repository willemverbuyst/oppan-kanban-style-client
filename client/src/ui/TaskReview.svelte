<script lang="ts">
  import { flip } from 'svelte/animate';
  import { createEventDispatcher } from 'svelte';
  import { receive, send } from '../business/crossfade';
  import type { Task } from '../models/task';

  export let tasks: Task[];

  const dispatch = createEventDispatcher();

  function removeTask(task) {
    dispatch('removeTask', { taskId: task.id });
  }
</script>

<div class="review">
  <h2>review</h2>
  {#each tasks.filter((t) => t.status === 'review') as task (task.id)}
    <label
      in:receive={{ key: task.id }}
      out:send={{ key: task.id }}
      animate:flip
    >
      <input type="checkbox" on:change={() => (task.status = 'done')} />
      {task.description}
      <button on:click={() => removeTask(task)}>x</button>
    </label>
  {/each}
</div>

<style>
  button {
    float: right;
    height: 1em;
    box-sizing: border-box;
    padding: 0 0.5em;
    line-height: 1;
    background-color: transparent;
    border: none;
    color: rgb(170, 30, 30);
    opacity: 0;
    transition: opacity 0.2s;
  }

  label:hover button {
    opacity: 1;
  }

  .review {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .review label {
    background-color: #f65e5d;
    color: #fff;
  }
</style>
