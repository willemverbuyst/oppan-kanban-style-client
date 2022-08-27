<script lang="ts">
  import { flip } from 'svelte/animate';
  import { createEventDispatcher } from 'svelte';
  import { receive, send } from '../business/crossfade';
  import { Status } from '../models/status';
  import type { Todo } from '../store/todos.machine';

  export let todos: Todo[];
  const dispatch = createEventDispatcher();

  function removeTodo(todoId: string) {
    dispatch('removeTodo', todoId);
  }
</script>

<div class="done">
  <h2>done</h2>
  {#each todos.filter((t) => t.status === Status.DONE) as todo (todo.id)}
    <label
      in:receive={{ key: todo.id }}
      out:send={{ key: todo.id }}
      animate:flip
    >
      <input type="checkbox" on:change={() => removeTodo(todo.id)} />
      {todo.title}
      <button on:click={() => removeTodo(todo.id)}>x</button>
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

  .done {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .done label {
    background-color: var(--label-bg-done);
    color: var(--text-color-light);
  }
</style>
