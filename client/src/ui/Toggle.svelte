<script lang="ts">
  import { changeBackgroundColor } from '../business/colors';
  import { interpret } from 'xstate';
  import { toggleMachine } from '../store/machine';

  let current;

  const toggleService = interpret(toggleMachine)
    .onTransition((state) => {
      current = state;
      changeBackgroundColor(current.matches('darkModeOn'));
    })
    .start();
</script>

<div class="switch">
  <label>
    <input
      on:click={() => toggleService.send('TOGGLE')}
      type="checkbox"
      checked={current.matches('darkModeOn')}
    />
    <span class="slider" />
  </label>
</div>

<style>
  .switch {
    position: relative;
    display: inline-block;
    background-color: inherit;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  label {
    background-color: inherit;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--main-bg-color-dark);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: var(--header-bg-color);
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: var(--main-bg-color);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
</style>
