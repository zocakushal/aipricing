<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { modelPricing, type ModelPrice } from '../pricingData';

  export let selectedModelId: string = modelPricing[0]?.id || '';

  const dispatch = createEventDispatcher();

  // Reactive statement to find the full model object when selectedModelId changes
  $: selectedModel = modelPricing.find(model => model.id === selectedModelId);

  function handleChange() {
    if (selectedModel) {
      dispatch('modelChange', {
        id: selectedModelId, // current selected ID
        model: selectedModel // the full model object
      });
    }
  }

  // Ensure selectedModelId is initialized if modelPricing is not empty
  // This handles the case where modelPricing might be initially empty or loads asynchronously,
  // though in our current setup it's static.
  if (modelPricing.length > 0 && !selectedModelId) {
    selectedModelId = modelPricing[0].id;
  }
  // Note: The initial dispatch of the model could happen here,
  // or the parent component can read the initial `selectedModelId` and `selectedModel`
  // For this component, we will dispatch only on explicit change via user interaction.
  // The parent (`App.svelte`) will be responsible for using the initial bound value.

</script>

<div>
  <label for="model-selector">Select AI Model:</label>
  <select id="model-selector" bind:value={selectedModelId} on:change={handleChange}>
    {#each modelPricing as model (model.id)}
      <option value={model.id}>{model.name}</option>
    {/each}
  </select>
</div>

{#if selectedModel?.notes}
  <p><small>Note: {selectedModel.notes}</small></p>
{/if}

<style>
  /* Add some basic styling if you wish */
  div {
    margin-bottom: 10px;
  }
  label {
    margin-right: 5px;
  }
  select {
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
  }
  p {
    font-size: 0.9em;
    color: #555;
    margin-top: 5px;
  }
</style>
