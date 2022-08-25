<script>
  import Toggle from './Toggle.svelte';

  let acceptTerms = false;
</script>

<div class="header">
  <div class="header__element">
    <h1>Oppan Kanban Style</h1>
  </div>
  <div class="header__element">
    <Toggle bind:checked={acceptTerms} />
  </div>
</div>

<style>
  .header {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
    background-color: #1d2d60;
  }

  .header__element {
    padding: 0.5rem 2rem;
  }
</style>
