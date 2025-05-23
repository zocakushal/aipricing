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
    overflow-x: auto;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }

  .table-container:hover {
    box-shadow: var(--shadow-lg);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid var(--border-light);
    transition: all 0.2s ease;
  }

  th:first-child, td:first-child {
    padding-left: 1.5rem;
  }

  th:last-child, td:last-child {
    padding-right: 1.5rem;
  }

  thead {
    background: linear-gradient(135deg, var(--table-header-bg), var(--background-secondary));
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th {
    cursor: pointer;
    user-select: none;
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-color);
    white-space: nowrap;
    position: relative;
    transition: all 0.2s ease;
  }

  th:hover {
    background-color: var(--table-row-hover-bg);
    color: var(--primary-color);
  }

  th:active {
    transform: translateY(1px);
  }

  tbody tr {
    transition: all 0.2s ease;
    cursor: pointer;
  }

  tbody tr:hover {
    background-color: var(--table-row-hover-bg);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  tbody tr:active {
    transform: translateY(0);
  }

  td {
    color: var(--text-color);
    font-weight: 400;
  }

  /* Model name styling */
  tbody tr td:first-child {
    font-weight: 600;
    color: var(--primary-color);
  }

  /* Provider styling */
  tbody tr td:nth-child(2) {
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* Cost columns styling */
  tbody tr td:nth-child(3),
  tbody tr td:nth-child(4) {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }

  /* Speed and Quality badges */
  tbody tr td:nth-child(7),
  tbody tr td:nth-child(8) {
    font-weight: 600;
  }

  .no-models-message {
    text-align: center;
    padding: 3rem 2rem;
    color: var(--text-secondary);
    font-style: italic;
    font-size: 1rem;
  }

  .no-models-message::before {
    content: '🤖';
    display: block;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .docs-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .docs-link:hover {
    color: white;
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    text-decoration: none;
    transform: translateY(-1px);
  }

  /* Sort indicators */
  th::after {
    content: '';
    margin-left: 0.5rem;
    opacity: 0.5;
    transition: opacity 0.2s ease;
  }

  th:hover::after {
    opacity: 1;
  }

  /* Responsive design */
  @media (max-width: 1200px) {
    th, td {
      padding: 0.75rem 0.5rem;
      font-size: 0.8rem;
    }

    th:first-child, td:first-child {
      padding-left: 1rem;
    }

    th:last-child, td:last-child {
      padding-right: 1rem;
    }
  }

  @media (max-width: 768px) {
    .table-container {
      border-radius: 8px;
    }

    th, td {
      padding: 0.5rem 0.25rem;
      font-size: 0.75rem;
    }

    th:first-child, td:first-child {
      padding-left: 0.75rem;
    }

    th:last-child, td:last-child {
      padding-right: 0.75rem;
    }

    /* Hide some columns on mobile */
    th:nth-child(5), td:nth-child(5), /* Context */
    th:nth-child(6), td:nth-child(6), /* Capabilities */
    th:nth-child(9), td:nth-child(9)  /* Updated */ {
      display: none;
    }
  }
</style>
