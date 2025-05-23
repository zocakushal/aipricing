<script lang="ts">
  import CostCalculatorPanel from '$lib/components/CostCalculatorPanel.svelte';
  import ModelTable from '$lib/components/ModelTable.svelte';
  import CostDisplay from '$lib/components/CostDisplay.svelte';
  import FilterSortControls from '$lib/components/FilterSortControls.svelte';
  import CostCharts from '$lib/components/CostCharts.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import type { ModelPrice } from '$lib/pricingData';
  import { modelPricing } from '$lib/pricingData'; 
  import { theme } from '$lib/themeStore';
  import '../app.css'; // GLOBAL STYLESHEET

  import {
    inputTokens,
    outputTokens,
    selectedModelId,
    calculatedCost,
    modelNotes,
    selectedModel,
    numberOfRequests
  } from '$lib/costStore';

  // Apply theme class to body
  theme.subscribe(value => {
    if (typeof document !== 'undefined') { 
      if (value === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  });

  // State for active filters
  let activeFilters = {
    searchTerm: '',
    selectedProvider: '',
    minInputCost: null as number | null,
    maxInputCost: null as number | null,
    minOutputCost: null as number | null,
    maxOutputCost: null as number | null,
    selectedCapabilities: [] as string[],
    minQualityRating: 0,
    selectedSpeedRatings: [] as string[],
  };

  function handleFiltersChanged(event: CustomEvent<typeof activeFilters>) {
    activeFilters = event.detail;
  }

  // Reactive filtered list of models
  $: filteredDisplayModels = modelPricing.filter(model => {
    let matches = true;

    if (activeFilters.searchTerm) {
      const searchTermLower = activeFilters.searchTerm.toLowerCase();
      const modelCapabilitiesString = (Array.isArray(model.keyCapabilities) ? model.keyCapabilities.join(' ') : String(model.keyCapabilities)).toLowerCase();
      matches &&= (
        model.name.toLowerCase().includes(searchTermLower) || 
        model.provider.toLowerCase().includes(searchTermLower) ||
        modelCapabilitiesString.includes(searchTermLower)
      );
    }
    if (activeFilters.selectedProvider) matches &&= model.provider === activeFilters.selectedProvider;
    if (activeFilters.minInputCost !== null) matches &&= model.inputCostPerMillionTokens >= activeFilters.minInputCost;
    if (activeFilters.maxInputCost !== null) matches &&= model.inputCostPerMillionTokens <= activeFilters.maxInputCost;
    if (activeFilters.minOutputCost !== null) matches &&= model.outputCostPerMillionTokens >= activeFilters.minOutputCost;
    if (activeFilters.maxOutputCost !== null) matches &&= model.outputCostPerMillionTokens <= activeFilters.maxOutputCost;
    if (activeFilters.minQualityRating > 0) matches &&= model.qualityRating >= activeFilters.minQualityRating;
    if (activeFilters.selectedSpeedRatings.length > 0) matches &&= activeFilters.selectedSpeedRatings.includes(model.speedRating);
    if (activeFilters.selectedCapabilities.length > 0) {
      const modelCaps = Array.isArray(model.keyCapabilities) ? model.keyCapabilities : (model.keyCapabilities ? [String(model.keyCapabilities)] : []);
      const modelCapsLower = modelCaps.map(c => c.toLowerCase());
      matches &&= activeFilters.selectedCapabilities.every(sc => 
        modelCapsLower.some(mc => mc.includes(sc.toLowerCase()))
      );
    }
    return matches;
  });

  // Reactive statement to prepare data for the chart
  $: chartDisplayData = filteredDisplayModels.map(model => {
    const costPerRequest =
      ($inputTokens / 1000000) * model.inputCostPerMillionTokens +
      ($outputTokens / 1000000) * model.outputCostPerMillionTokens;
    const totalCost = Math.max(0, costPerRequest * $numberOfRequests);

    return {
      label: model.name,
      cost: totalCost,
      quality: model.qualityRating,
      provider: model.provider
    };
  }).sort((a,b) => a.cost - b.cost); 

  function handleModelSelected(event: CustomEvent<ModelPrice>) {
    const model = event.detail;
    if (model && model.id) {
      selectedModelId.set(model.id);
    }
  }

  function handleValueChange(event: CustomEvent<{ inputTokens: number; outputTokens: number; numberOfRequests: number }>) {
    inputTokens.set(event.detail.inputTokens);
    outputTokens.set(event.detail.outputTokens);
    numberOfRequests.set(event.detail.numberOfRequests);
  }
</script>

<ThemeToggle />
<main>
  <h1>AI Model Cost Calculator</h1>
  
  <FilterSortControls {modelPricing} on:filtersChanged={handleFiltersChanged} />
  
  <ModelTable models={filteredDisplayModels} on:modelSelected={handleModelSelected} />

  {#if $selectedModel}
    <div class="selected-model-details card"> {/* Added 'card' class */}
      <h2>Selected Model: {$selectedModel.name}</h2>
      <p>Provider: {$selectedModel.provider}</p>
      {#if $modelNotes}
        <p class="notes"><small><em>Notes: {$modelNotes}</em></small></p>
      {/if}
    </div>
  {/if}
  
  <CostCalculatorPanel 
    bind:inputTokens={$inputTokens} 
    bind:outputTokens={$outputTokens} 
    bind:numberOfRequests={$numberOfRequests} 
    on:valueChange={handleValueChange} 
  />
  
  <CostDisplay cost={$calculatedCost} /> 

  <CostCharts chartData={chartDisplayData} /> 
</main>

<style>
  main {
    max-width: 90%; 
    margin: 2em auto;
    padding: 1.5em; /* Increased padding slightly */
    border-radius: 8px;
    /* Background and text color are inherited from body (app.css) */
    /* Border and shadow could be applied if main is considered a "card" */
    /* For now, let's assume main is just a layout container, not a card itself */
  }

  h1 {
    color: var(--text-color); /* Explicitly use text-color for clarity */
    text-align: center;
    margin-bottom: 1.5em;
    font-weight: 600; /* From Inter font */
  }

  .selected-model-details { /* This is treated as a card */
    margin: 1.5em 0; /* Increased margin */
    padding: 1.5em;  /* Increased padding */
    background-color: var(--card-bg); 
    border: 1px solid var(--border-color);
    border-radius: 8px; /* Consistent border-radius */
    box-shadow: var(--shadow);
  }

  .selected-model-details h2 {
    margin-top: 0;
    margin-bottom: 0.5em; /* Added margin */
    color: var(--text-color); /* Ensure heading color matches theme */
    font-weight: 500; /* From Inter font */
  }
  
  .selected-model-details p {
    margin-bottom: 0.3em; /* Consistent paragraph spacing */
    color: var(--text-color);
  }

  .selected-model-details p.notes {
    font-size: 0.9em;
    opacity: 0.85; /* Slightly muted notes */
  }
</style>
