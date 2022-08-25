<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function addTodo(input) {
    dispatch('addTodo', { text: input.value });
    input.value = '';
  }
</script>

<div class="input-field">
  <input
    class="task"
    placeholder="Create a new todo"
    on:keydown={(e) => e.key === 'Enter' && addTodo(e.target)}
  />
</div>

<style>
  input {
    margin: 0;
  }

  .input-field {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .task {
    font-size: 1.4em;
    margin: 2em auto;
    min-width: 50vw;
  }
</style>
