<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let inputTokens: number = 0;
  export let outputTokens: number = 0;

  const dispatch = createEventDispatcher();

  function handleChange() {
    dispatch('inputChange', {
      inputTokens,
      outputTokens
    });
  }
</script>

<div>
  <label for="input-tokens">Input Tokens:</label>
  <input type="number" id="input-tokens" bind:value={inputTokens} on:input={handleChange} min="0" />
</div>
<div>
  <label for="output-tokens">Output Tokens:</label>
  <input type="number" id="output-tokens" bind:value={outputTokens} on:input={handleChange} min="0" />
</div>

<style>
  /* Add some basic styling if you wish */
  div {
    margin-bottom: 10px;
  }
  label {
    margin-right: 5px;
  }
</style>
