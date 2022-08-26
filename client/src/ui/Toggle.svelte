<script>
  import { darkModeStore } from '../store/appStore';
  import { changeBackgroundColor } from '../business/colors';

  let checked;

  darkModeStore.subscribe((mode) => {
    checked = mode;
  });

  function handleChange() {
    darkModeStore.toggleDarkMode();
    changeBackgroundColor(checked);
  }
</script>

<div class="switch">
  <label>
    <input on:click={handleChange} type="checkbox" bind:checked />
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
    background-color: #aaa;
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
    background-color: #1d2d60;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #f1f1f1;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
</style>
