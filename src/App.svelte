<script>
  import Header from './Header.svelte';

  const add = (input) => console.log(input.value);
</script>

<style>
  .task {
    font-size: 1.4em;
    margin: 2em 0 1em 2rem;
    min-width: 50vw;
  }
</style>

<Header />
<input
  class="task"
  placeholder="What task needs to be done?"
  on:keydown={(e) => e.key === 'Enter' && add(e.target)} />
