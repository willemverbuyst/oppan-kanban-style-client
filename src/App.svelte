<script>
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import Header from './Header.svelte';
  import NewTodoInput from './NewTodoInput.svelte'
  import TaskInProgress from './TaskInProgress.svelte';
  import TaskReview from './TaskReview.svelte'
  import TaskTodo from './TaskTodo.svelte';
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

  function add(event) {
    const task = {
      id: uid++,
      status: 'todo',
      description: event.detail.text,
    };

    tasks = [task, ...tasks];
  };

  function remove(task) {
    tasks = tasks.filter((t) => t.id !== task.detail.taskId);
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

  .done label {
    background-color: #40cee2;
    color: #fff;
  }
</style>

<Header />
<NewTodoInput on:addTodo={add}/>
<div class="board">
  <TaskTodo bind:tasks={tasks} on:removeTask={remove}/>
  <TaskInProgress bind:tasks={tasks} on:removeTask={remove}/>
  <TaskReview bind:tasks={tasks} on:removeTask={remove}/>

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
