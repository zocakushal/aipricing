<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ModelPrice } from '$lib/pricingData';

  export let modelPricing: ModelPrice[] = [];

  // Filter state variables
  let searchTerm: string = '';
  let selectedProvider: string = ''; 
  let minInputCost: number | null = null;
  let maxInputCost: number | null = null;
  let minOutputCost: number | null = null;
  let maxOutputCost: number | null = null;
  let selectedCapabilities: string[] = [];
  let minQualityRating: number = 0; 
  let selectedSpeedRatings: string[] = [];

  const dispatch = createEventDispatcher();

  let allUniqueProviders: string[] = [];
  let allUniqueCapabilities: string[] = [];
  const allSpeedRatings: string[] = ['Fast', 'Medium', 'Slow', 'Unknown']; 

  $: {
    if (modelPricing) {
      const providerSet = new Set<string>();
      modelPricing.forEach(m => providerSet.add(m.provider));
      allUniqueProviders = ['', ...Array.from(providerSet).sort()]; 

      const capSet = new Set<string>();
      modelPricing.forEach(m => {
        const caps = Array.isArray(m.keyCapabilities) ? m.keyCapabilities : [m.keyCapabilities];
        caps.forEach(c => { if(c && c !== "N/A") capSet.add(c); });
      });
      allUniqueCapabilities = Array.from(capSet).sort();
    }
  }

  function emitFilters() {
    dispatch('filtersChanged', {
      searchTerm,
      selectedProvider,
      minInputCost,
      maxInputCost,
      minOutputCost,
      maxOutputCost,
      selectedCapabilities,
      minQualityRating,
      selectedSpeedRatings,
    });
  }

  function clearFilters() {
    searchTerm = '';
    selectedProvider = '';
    minInputCost = null;
    maxInputCost = null;
    minOutputCost = null;
    maxOutputCost = null;
    selectedCapabilities = [];
    minQualityRating = 0;
    selectedSpeedRatings = [];
    emitFilters();
  }

  $: searchTerm, selectedProvider, minInputCost, maxInputCost, minOutputCost, maxOutputCost, selectedCapabilities, minQualityRating, selectedSpeedRatings, emitFilters();

</script>

<div class="filter-controls-wrapper">
  <div class="filter-header">
    <h3>🔍 Advanced Filters</h3>
    <div class="filter-stats">
      <span class="results-count">{modelPricing.length} models</span>
    </div>
  </div>
  <div class="filter-grid">
    <div class="filter-item">
      <label for="search-term">Search:</label>
      <input type="text" id="search-term" bind:value={searchTerm} placeholder="Model name, provider, capability..." />
    </div>

    <div class="filter-item">
      <label for="provider-filter">Provider:</label>
      <select id="provider-filter" bind:value={selectedProvider}>
        {#each allUniqueProviders as provider}
          <option value={provider}>{provider === '' ? 'All Providers' : provider}</option>
        {/each}
      </select>
    </div>

    <div class="filter-item">
      <label for="quality-rating">Min Quality (0-5):</label>
      <input type="number" id="quality-rating" bind:value={minQualityRating} min="0" max="5" step="1" />
    </div>
    
    <div class="filter-item filter-group">
      <label>Input Cost ($/MTok):</label>
      <input type="number" bind:value={minInputCost} placeholder="Min" />
      <input type="number" bind:value={maxInputCost} placeholder="Max" />
    </div>

    <div class="filter-item filter-group">
      <label>Output Cost ($/MTok):</label>
      <input type="number" bind:value={minOutputCost} placeholder="Min" />
      <input type="number" bind:value={maxOutputCost} placeholder="Max" />
    </div>

    <div class="filter-item filter-checkbox-group">
      <h4>Speed Ratings:</h4>
      {#each allSpeedRatings as speed}
        <label class="checkbox-label">
          <input type="checkbox" value={speed} bind:group={selectedSpeedRatings} />
          <span class="checkbox-text">{speed}</span>
        </label>
      {/each}
    </div>
    
    <div class="filter-item filter-checkbox-group capabilities-filter">
      <h4>Capabilities:</h4>
      <div class="checkbox-list">
        {#each allUniqueCapabilities as capability (capability)}
          <label class="checkbox-label">
            <input type="checkbox" value={capability} bind:group={selectedCapabilities} />
            <span class="checkbox-text">{capability}</span>
          </label>
        {/each}
      </div>
    </div>

  </div>
  <button type="button" on:click={clearFilters} class="clear-filters-btn">Clear All Filters</button>
</div>

<style>
  .filter-controls-wrapper {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }

  .filter-controls-wrapper:hover {
    box-shadow: var(--shadow-lg);
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border-light);
  }

  .filter-controls-wrapper h3 {
    margin: 0;
    color: var(--text-color);
    font-weight: 700;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-stats {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .results-count {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
  }

  .filter-item label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .filter-item input[type="text"],
  .filter-item input[type="number"],
  .filter-item select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--input-border-color);
    border-radius: 8px;
    background-color: var(--input-bg);
    color: var(--text-color);
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .filter-item input[type="text"]:focus,
  .filter-item input[type="number"]:focus,
  .filter-item select:focus {
    border-color: var(--input-focus-border-color);
    box-shadow: var(--input-focus-box-shadow);
    outline: none;
    transform: translateY(-1px);
  }

  .filter-item input[type="text"]:hover,
  .filter-item input[type="number"]:hover,
  .filter-item select:hover {
    border-color: var(--primary-light);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group input[type="number"] {
    margin-bottom: 0;
  }

  .filter-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .filter-checkbox-group h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: var(--text-color);
  }

  .checkbox-label {
    display: flex !important;
    align-items: center;
    margin-bottom: 0.5rem !important;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400 !important;
    font-size: 0.875rem !important;
  }

  .checkbox-label:hover {
    background-color: var(--background-secondary);
  }

  .checkbox-label input[type="checkbox"] {
    margin-right: 0.75rem;
    accent-color: var(--primary-color);
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 4px;
  }

  .checkbox-text {
    line-height: 1.3;
    color: var(--text-color);
  }

  .capabilities-filter .checkbox-list {
    max-height: 200px;
    overflow-y: auto;
    border: 2px solid var(--input-border-color);
    padding: 0.75rem;
    border-radius: 8px;
    background-color: var(--input-bg);
    transition: border-color 0.2s ease;
  }

  .capabilities-filter .checkbox-list:hover {
    border-color: var(--primary-light);
  }

  .clear-filters-btn {
    display: block;
    margin: 2rem auto 0;
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, var(--error-color), #dc2626);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    box-shadow: var(--shadow);
  }

  .clear-filters-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, #dc2626, var(--error-color));
  }

  .clear-filters-btn:active {
    transform: translateY(0);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .filter-controls-wrapper {
      padding: 1rem;
    }

    .filter-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .capabilities-filter .checkbox-list {
      max-height: 150px;
    }

    .clear-filters-btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.8rem;
    }
  }
</style>
