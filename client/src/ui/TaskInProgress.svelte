<script lang="ts">
  import { Actions } from '../models/todo';

  // import { flip } from 'svelte/animate';
  // import { createEventDispatcher } from 'svelte';
  // import { receive, send } from '../business/crossfade';
  // import { Status } from '../models/status';
  // import type { Todo } from '../store/todos.machine';

  export let actor = null;

  const { send } = actor;
  $: ({ id, title } = $actor.context);
</script>

<div class="container">
  <div class="label">
    <button class="arrow-left" on:click={() => send(Actions.MOVE_TO_BACKLOG)}>
      &#8592;
    </button>
    <div>{title}</div>
    <button class="arrow-right" on:click={() => send(Actions.MOVE_TO_REVIEW)}>
      &#8594;
    </button>
  </div>
  <div>
    <button class="btn__delete" on:click={() => send(Actions.DELETE)}
      >&#215;</button
    >
  </div>
</div>

<style>
  .container {
    background-color: var(--label-bg-in-progress);
    text-align: center;
    margin: 1rem;
    padding: 0.5rem 1rem;
    position: relative;
  }

  .label {
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    line-height: 1;
    background-color: transparent;
    border: none;
    color: var(--text-color-dark);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn__delete {
    position: absolute;
    top: -0.3rem;
    right: -0.1rem;
    background-color: var(--label-bg-in-progress);
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
  }

  .container:hover button {
    opacity: 1;
  }
</style>
