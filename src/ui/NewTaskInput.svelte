<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function addTask(input) {
    dispatch('addTask', { text: input.value });
    input.value = '';
  }
</script>

<div class="input-field">
  <input
    class="task"
    placeholder="Add new task"
    on:keydown={(e) => e.key === 'Enter' && addTask(e.target)}
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
