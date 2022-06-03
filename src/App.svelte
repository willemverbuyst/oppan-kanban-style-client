<script>
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import Header from './Header.svelte';
  import NewTodo from './NewTodo.svelte'
  import { dummyData } from './dummy-data';

  let tasks = [...dummyData];

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

  let uid = tasks.length + 1;

  const add = (event) => {
    const task = {
      id: uid++,
      status: 'todo',
      description: event.detail.text,
    };

    tasks = [task, ...tasks];
  };

  const remove = (task) => {
    tasks = tasks.filter((t) => t !== task);
  };
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

  .todo,
  .in-progress,
  .review,
  .done {
    float: left;
    width: 25%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

  .board {
    width: 90%;
    margin: 0 auto;
  }

  .todo label {
    background-color: #f2f2f0;
  }
  .in-progress label {
    background-color: #ffbc47;
  }
  .review label {
    background-color: #f65e5d;
    color: #fff;
  }
  .done label {
    background-color: #40cee2;
    color: #fff;
  }
</style>

<Header />
<NewTodo on:addTodo={add}/>
<div class="board">
  <div class="todo">
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
        <button on:click={() => remove(task)}>x</button>
      </label>
    {/each}
  </div>

  <div class="in-progress">
    <h2>in progress</h2>
    {#each tasks.filter((t) => t.status === 'in-progress') as task (task.id)}
      <label
        in:receive={{ key: task.id }}
        out:send={{ key: task.id }}
        animate:flip>
        <input type="checkbox" on:change={() => (task.status = 'review')} />
        {task.description}
        <button on:click={() => remove(task)}>x</button>
      </label>
    {/each}
  </div>

  <div class="review">
    <h2>review</h2>
    {#each tasks.filter((t) => t.status === 'review') as task (task.id)}
      <label
        in:receive={{ key: task.id }}
        out:send={{ key: task.id }}
        animate:flip>
        <input type="checkbox" on:change={() => (task.status = 'done')} />
        {task.description}
        <button on:click={() => remove(task)}>x</button>
      </label>
    {/each}
  </div>

  <div class="done">
    <h2>done</h2>
    {#each tasks.filter((t) => t.status === 'done') as task (task.id)}
      <label
        in:receive={{ key: task.id }}
        out:send={{ key: task.id }}
        animate:flip>
        <input type="checkbox" bind:checked={task.status} />
        {task.description}
        <button on:click={() => remove(task)}>x</button>
      </label>
    {/each}
  </div>
</div>
