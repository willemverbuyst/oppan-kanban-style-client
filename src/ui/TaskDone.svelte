<script>
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { createEventDispatcher } from 'svelte';

  export let tasks

  const dispatch = createEventDispatcher();

  function removeTask(task) {
    dispatch("removeTask",{taskId: task.id})
  }

  const [send, receive] = crossfade({
    fallback(node, _params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });
</script>

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

  .done {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .done label {
    background-color: #40cee2;
    color: #fff;
  }
</style>


<div class="done">
  <h2>done</h2>
  {#each tasks.filter((t) => t.status === 'done') as task (task.id)}
    <label
      in:receive={{ key: task.id }}
      out:send={{ key: task.id }}
      animate:flip>
      <input type="checkbox" bind:checked={task.status} />
      {task.description}
      <button on:click={() => removeTask(task)}>x</button>
    </label>
  {/each}
</div>
