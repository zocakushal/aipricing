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
  <h3>Advanced Filters</h3>
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
    padding: 1.5em;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 1.5em;
    background-color: var(--card-bg);
    box-shadow: var(--shadow);
  }

  .filter-controls-wrapper h3 {
    margin-top: 0;
    margin-bottom: 1.2em;
    text-align: center;
    color: var(--text-color);
    font-weight: 600;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Adjusted minmax */
    gap: 1.2em; /* Slightly increased gap */
  }

  .filter-item label, .filter-group label { /* General label styling */
    display: block; /* Ensure label takes full width for spacing */
    margin-bottom: 0.5em; /* Increased spacing */
    font-weight: 500; /* Inter font weight */
    font-size: 0.9em;
    color: var(--text-color);
  }

  .filter-item input[type="text"],
  .filter-item input[type="number"],
  .filter-item select {
    width: 100%;
    padding: 0.75em; /* Increased padding for better touch targets */
    border: 1px solid var(--input-border-color);
    border-radius: 6px; /* Slightly more rounded */
    box-sizing: border-box;
    background-color: var(--input-bg);
    color: var(--text-color);
    font-size: 0.95em; /* Ensure text is readable */
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .filter-item input[type="text"]:focus,
  .filter-item input[type="number"]:focus,
  .filter-item select:focus {
    border-color: var(--input-focus-border-color);
    box-shadow: var(--input-focus-box-shadow);
    outline: none;
  }

  .filter-group input[type="number"] {
    margin-bottom: 0.5em; 
  }
  .filter-group input[type="number"]:last-child {
    margin-bottom: 0;
  }

  .filter-checkbox-group h4 {
    font-size: 0.9em;
    font-weight: 500;
    margin-bottom: 0.6em;
    color: var(--text-color);
  }

  .checkbox-label { /* Replaced .filter-checkbox-group label for specificity */
    display: flex; 
    align-items: center;
    margin-bottom: 0.4em;
    font-weight: 400; /* Inter font weight */
    font-size: 0.9em; /* Consistent font size */
    color: var(--text-color);
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    margin-right: 0.6em;
    accent-color: var(--primary-color); /* Style checkbox color */
    width: 1.1em; /* Custom size */
    height: 1.1em;
  }
  .checkbox-label .checkbox-text {
    line-height: 1.3;
  }

  .capabilities-filter .checkbox-list {
    max-height: 160px; 
    overflow-y: auto;
    border: 1px solid var(--input-border-color);
    padding: 0.8em;
    border-radius: 6px;
    background-color: var(--input-bg); /* Consistent background */
  }

  .clear-filters-btn {
    display: block;
    margin: 1.8em auto 0;
    padding: 0.8em 1.5em;
    background-color: var(--button-secondary-bg); /* Use secondary button style */
    color: var(--button-secondary-text-color);
    border: 1px solid var(--border-color); /* Add border for definition */
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease-in-out, transform 0.1s ease;
  }
  .clear-filters-btn:hover {
    background-color: var(--button-secondary-hover-bg);
    transform: translateY(-1px);
  }
</style>
