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
  h2 {
    font-size: 2em;
    font-weight: 200;
    user-select: none;
  }

  label {
    top: 0;
    left: 0;
    display: block;
    font-size: 1em;
    line-height: 1;
    padding: 0.5em;
    margin: 0 auto 0.5em auto;
    border-radius: 2px;
    background-color: #eee;
    user-select: none;
  }

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

  .todo {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .todo label {
    background-color: #f2f2f0;
  }
</style>

<div class="todo" >
  <h2>todo</h2>
  {#each tasks.filter((t) => t.status === 'todo') as task (task.id)}
    <label
      in:receive={{ key: task.id }}
      out:send={{ key: task.id }}
      animate:flip>
      <input
        type="checkbox"
        on:change={() => (task.status = 'in-progress')} />
      {task.description}
      <button on:click={() => removeTask(task)}>x</button>
    </label>
  {/each}
</div>