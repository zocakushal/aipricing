<script lang="ts">
  import type { ModelPrice } from '$lib/pricingData'; 
  import { createEventDispatcher } from 'svelte';

  export let models: ModelPrice[] = []; 

  let sortKey: keyof ModelPrice | '' = 'name'; 
  let sortDirection: 'asc' | 'desc' = 'asc';

  const dispatch = createEventDispatcher();

  const numericKeys: (keyof ModelPrice)[] = ['inputCostPerMillionTokens', 'outputCostPerMillionTokens', 'contextWindow', 'qualityRating'];
  const arrayToStringKeys: (keyof ModelPrice)[] = ['keyCapabilities'];

  $: sortedModels = [...models].sort((a, b) => { 
    if (!sortKey) return 0;

    let valA = a[sortKey];
    let valB = b[sortKey];

    if (arrayToStringKeys.includes(sortKey as keyof ModelPrice)) {
      valA = Array.isArray(valA) ? valA.join(', ') : String(valA);
      valB = Array.isArray(valB) ? valB.join(', ') : String(valB);
    }

    let comparison = 0;

    if (numericKeys.includes(sortKey as keyof ModelPrice) && typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB);
    } else {
      comparison = String(valA).localeCompare(String(valB));
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  function setSortKey(key: keyof ModelPrice | '') { 
    if (!key) return; 
    if (sortKey === key) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDirection = 'asc';
    }
  }

  function handleRowClick(model: ModelPrice) { 
    dispatch('modelSelected', model);
  }

  function getSortIndicator(key: keyof ModelPrice | ''): string { 
    if (sortKey === key) {
      return sortDirection === 'asc' ? '▲' : '▼';
    }
    return '';
  }
</script>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th on:click={() => setSortKey('name')}>Name {getSortIndicator('name')}</th>
        <th on:click={() => setSortKey('provider')}>Provider {getSortIndicator('provider')}</th>
        <th on:click={() => setSortKey('inputCostPerMillionTokens')}>Input ($/MTok) {getSortIndicator('inputCostPerMillionTokens')}</th>
        <th on:click={() => setSortKey('outputCostPerMillionTokens')}>Output ($/MTok) {getSortIndicator('outputCostPerMillionTokens')}</th>
        <th on:click={() => setSortKey('contextWindow')}>Context {getSortIndicator('contextWindow')}</th>
        <th on:click={() => setSortKey('keyCapabilities')}>Capabilities {getSortIndicator('keyCapabilities')}</th>
        <th on:click={() => setSortKey('speedRating')}>Speed {getSortIndicator('speedRating')}</th>
        <th on:click={() => setSortKey('qualityRating')}>Quality {getSortIndicator('qualityRating')}</th>
        <th on:click={() => setSortKey('lastUpdated')}>Updated {getSortIndicator('lastUpdated')}</th>
        <th>Docs</th>
      </tr>
    </thead>
    <tbody>
      {#if sortedModels.length === 0}
        <tr>
          <td colspan="10" class="no-models-message">No models to display.</td> 
        </tr>
      {/if}
      {#each sortedModels as model (model.id)} 
        <tr on:click={() => handleRowClick(model)} title={model.notes || 'No notes available'}>
          <td>{model.name}</td>
          <td>{model.provider}</td>
          <td>${model.inputCostPerMillionTokens.toFixed(2)}</td>
          <td>${model.outputCostPerMillionTokens.toFixed(2)}</td>
          <td>{model.contextWindow.toLocaleString()}</td>
          <td>{Array.isArray(model.keyCapabilities) ? model.keyCapabilities.join(', ') : model.keyCapabilities}</td>
          <td>{model.speedRating}</td>
          <td>{model.qualityRating === 0 ? 'N/A' : `${model.qualityRating}/5`}</td>
          <td>{model.lastUpdated}</td>
          <td>
            {#if model.officialDocsLink}
              <a href={model.officialDocsLink} target="_blank" rel="noopener noreferrer" on:click|stopPropagation class="docs-link">Link</a>
            {:else}
              N/A
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    overflow-x: auto; /* Allow horizontal scrolling on smaller screens */
    margin-top: 1.5em;
    border: 1px solid var(--border-color);
    border-radius: 8px; /* Consistent with other cards */
    background-color: var(--card-bg); /* Table itself as a card */
    box-shadow: var(--shadow);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    /* font-size: 0.9em; /* Inherit from body or specific needs */
  }
  th, td {
    border-bottom: 1px solid var(--border-color); /* Only bottom border for rows */
    border-left: 1px solid var(--border-color); /* Vertical borders for cells */
    padding: 0.8em 1em; /* Increased padding */
    text-align: left;
    vertical-align: top;
    /* color: var(--text-color); /* Inherited */
  }
  th:first-child, td:first-child {
    border-left: none; /* Remove left border for the first cell in a row */
  }
  thead tr {
    border-bottom: 2px solid var(--border-color); /* Thicker border for header row */
  }
  th {
    cursor: pointer;
    background-color: var(--table-header-bg);
    user-select: none; 
    font-weight: 600; /* From Inter font */
    white-space: nowrap; /* Prevent header text from wrapping */
  }
  th:hover {
    background-color: var(--table-row-hover-bg); /* Use hover bg for header too */
  }
  tbody tr:hover {
    background-color: var(--table-row-hover-bg);
    cursor: pointer;
  }
  td {
    word-break: break-word;
  }
  .no-models-message {
    text-align: center;
    padding: 2em;
    color: var(--secondary-color, #6c757d); /* Use secondary color for this message */
  }
  .docs-link {
    color: var(--link-color);
    text-decoration: underline;
  }
  .docs-link:hover {
    color: var(--link-hover-color);
  }
</style>
