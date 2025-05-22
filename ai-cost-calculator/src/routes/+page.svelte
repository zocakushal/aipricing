<script lang="ts">
  import InputForm from '$lib/components/InputForm.svelte';
  import ModelSelector from '$lib/components/ModelSelector.svelte';
  import CostDisplay from '$lib/components/CostDisplay.svelte';
  import { modelPricing } from '$lib/pricingData'; // Needed for initial model selection

  import {
    inputTokens,
    outputTokens,
    selectedModelId,
    calculatedCost,
    modelNotes
  } from '$lib/costStore'; // Adjusted path for SvelteKit $lib alias

  // Initialize selectedModelId if it's not already set by the store
  // (costStore.ts should handle initial default, but good to be defensive)
  if (modelPricing.length > 0 && !$selectedModelId) {
    selectedModelId.set(modelPricing[0].id);
  }

  function handleModelChange(event: CustomEvent<{ id: string }>) {
    selectedModelId.set(event.detail.id);
  }

  function handleInputChange(event: CustomEvent<{ inputTokens: number; outputTokens: number }>) {
    inputTokens.set(event.detail.inputTokens);
    outputTokens.set(event.detail.outputTokens);
  }
</script>

<main>
  <h1>AI Model Cost Calculator</h1>

  <ModelSelector bind:selectedModelId={$selectedModelId} on:modelChange={handleModelChange} />
  
  {#if $modelNotes}
    <p><small><em>{ $modelNotes }</em></small></p>
  {/if}

  <InputForm bind:inputTokens={$inputTokens} bind:outputTokens={$outputTokens} on:inputChange={handleInputChange} />
  
  <CostDisplay cost={$calculatedCost} />
</main>

<style>
  main {
    font-family: sans-serif;
    max-width: 600px;
    margin: 2em auto;
    padding: 1em;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 1.5em;
  }
  p small em {
    display: block;
    text-align: center;
    margin-bottom: 1em;
    font-size: 0.9em;
    color: #555;
  }
</style>
