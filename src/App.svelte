<script>
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import Header from './Header.svelte';

  const [send, receive] = crossfade({
    fallback(node, params) {
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

  let tasks = [
    { id: 1, done: false, description: 'Write some docs' },
    { id: 2, done: false, description: 'Learn SQL' },
    { id: 3, done: true, description: 'Study TypeScript' },
    { id: 4, done: false, description: 'Daily stand-up' },
    { id: 5, done: false, description: 'Read MDN' },
    { id: 6, done: false, description: 'Fix bugs' },
  ];

  let uid = tasks.length + 1;

  const add = (input) => {
    const task = {
      id: uid++,
      done: false,
      description: input.value,
    };

    tasks = [task, ...tasks];
    input.value = '';
  };

  const remove = (task) => {
    tasks = tasks.filter((t) => t !== task);
  };
</script>

<style>
  .task {
    font-size: 1.4em;
    margin: 2em 0 1em 2rem;
    min-width: 50vw;
  }

  .left,
  .right {
    float: left;
    width: 50%;
    padding: 0 1em 0 0;
    box-sizing: border-box;
  }

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

  input {
    margin: 0;
  }

  .right label {
    background-color: rgb(238, 24, 167);
    color: #fff;
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
</style>

<Header />
<input
  class="task"
  placeholder="What task needs to be done?"
  on:keydown={(e) => e.key === 'Enter' && add(e.target)} />

<div class="left">
  <h2>todo</h2>
  {#each tasks.filter((t) => !t.done) as task (task.id)}
    <label
      in:receive={{ key: task.id }}
      out:send={{ key: task.id }}
      animate:flip>
      <input type="checkbox" bind:checked={task.done} />
      {task.description}
      <button on:click={() => remove(task)}>x</button>
    </label>
  {/each}
</div>

<div class="right">
  <h2>done</h2>
  {#each tasks.filter((t) => t.done) as task (task.id)}
    <label
      in:receive={{ key: task.id }}
      out:send={{ key: task.id }}
      animate:flip>
      <input type="checkbox" bind:checked={task.done} />
      {task.description}
      <button on:click={() => remove(task)}>x</button>
    </label>
  {/each}
</div>
