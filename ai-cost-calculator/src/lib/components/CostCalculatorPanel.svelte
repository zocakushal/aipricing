<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let inputTokens: number = 0;
  export let outputTokens: number = 0;
  export let numberOfRequests: number = 1;

  let scenarioNote: string = '';

  const dispatch = createEventDispatcher();

  const usagePresets = {
    Light: { input: 500, output: 200, requests: 10 },
    Medium: { input: 1500, output: 800, requests: 50 },
    Heavy: { input: 4000, output: 2000, requests: 200 },
  };

  const scenarioPresets = {
    Chatbot: { input: 800, output: 300, note: "Typical 100-500 req/day" },
    ContentGeneration: { input: 300, output: 1200, note: "Typical 20-100 req/day" },
    CodeAssistant: { input: 2000, output: 800, note: "Typical 30-150 req/day" },
    DataAnalysis: { input: 5000, output: 1500, note: "Typical 10-50 req/day" },
  };

  function applyUsagePreset(presetName: keyof typeof usagePresets) {
    const preset = usagePresets[presetName];
    inputTokens = preset.input;
    outputTokens = preset.output;
    numberOfRequests = preset.requests;
    scenarioNote = ''; 
    handleChange();
  }

  function applyScenarioPreset(presetName: keyof typeof scenarioPresets) {
    const preset = scenarioPresets[presetName];
    inputTokens = preset.input;
    outputTokens = preset.output;
    numberOfRequests = 1; 
    scenarioNote = preset.note;
    handleChange();
  }

  function handleChange() {
    if (numberOfRequests < 1) {
      numberOfRequests = 1;
    }
    dispatch('valueChange', { inputTokens, outputTokens, numberOfRequests });
  }
</script>

<div class="calculator-panel">
  <div class="manual-inputs">
    <div class="input-group">
      <label for="input-tokens">Input Tokens (per request):</label>
      <input type="number" id="input-tokens" bind:value={inputTokens} on:input={handleChange} min="0" />
    </div>
    <div class="input-group">
      <label for="output-tokens">Output Tokens (per request):</label>
      <input type="number" id="output-tokens" bind:value={outputTokens} on:input={handleChange} min="0" />
    </div>
    <div class="input-group">
      <label for="num-requests">Number of Requests:</label>
      <input type="number" id="num-requests" bind:value={numberOfRequests} on:input={handleChange} min="1" />
    </div>
  </div>

  <div class="presets-section">
    <div class="presets-group">
      <h4>Bulk Usage Presets:</h4>
      {#each Object.entries(usagePresets) as [presetName, presetDetails] (presetName)}
        <button class="preset-button" on:click={() => applyUsagePreset(presetName as keyof typeof usagePresets)}>
          {presetName} ({presetDetails.requests.toLocaleString()} req)
        </button>
      {/each}
    </div>

    <div class="presets-group">
      <h4>Single Request Scenario Presets:</h4>
      {#each Object.entries(scenarioPresets) as [presetName] (presetName)}
        <button class="preset-button" on:click={() => applyScenarioPreset(presetName as keyof typeof scenarioPresets)}>
          {presetName}
        </button>
      {/each}
      {#if scenarioNote}
        <p class="scenario-note"><small>{scenarioNote}</small></p>
      {/if}
    </div>
  </div>
</div>

<style>
  .calculator-panel { 
    border: 1px solid var(--border-color); 
    padding: 1.5em; 
    border-radius: 8px; 
    margin-top: 1.5em;
    background-color: var(--card-bg);
    box-shadow: var(--shadow);
  }

  .manual-inputs {
    margin-bottom: 1.5em;
  }

  .input-group { 
    display: flex;
    flex-wrap: wrap; /* Allow wrapping on small screens */
    align-items: center;
    margin-bottom: 1em; 
  }

  .input-group label { 
    flex-basis: 220px; /* Fixed basis for label */
    margin-right: 1em; 
    font-size: 0.95em;
    font-weight: 500;
    color: var(--text-color);
  }

  .input-group input[type="number"] {
    flex-grow: 1; /* Allow input to take remaining space */
    min-width: 100px; /* Minimum width for input */
    padding: 0.75em;
    border: 1px solid var(--input-border-color);
    border-radius: 6px;
    background-color: var(--input-bg);
    color: var(--text-color);
    font-size: 0.95em;
  }
  .input-group input[type="number"]:focus {
    border-color: var(--input-focus-border-color);
    box-shadow: var(--input-focus-box-shadow);
    outline: none;
  }

  .presets-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5em;
  }
  
  .presets-group { 
    padding-top: 1em;
    border-top: 1px solid var(--border-color); /* Use solid border */
  }
  .presets-group:first-child { /* No top border for the first group if it's the first in a row */
    /* border-top: none; /* This might need adjustment based on grid layout */
  }


  .presets-group h4 { 
    margin-top: 0; /* Remove margin if padding-top is on group */
    margin-bottom: 1em; 
    font-size: 1.05em;
    font-weight: 600;
    color: var(--text-color);
  }

  .preset-button { /* Changed from .presets-group button */
    margin-right: 0.5em; 
    margin-bottom: 0.5em; 
    padding: 0.7em 1.2em; /* Slightly larger padding */
    border: none; /* Remove border for primary buttons if desired */
    background-color: var(--button-bg);
    color: var(--button-text-color);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease-in-out, transform 0.1s ease;
  }

  .preset-button:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-1px);
  }

  .scenario-note { 
    margin-top: 1em;
    font-style: italic; 
    color: var(--secondary-color, #555); 
    font-size: 0.9em;
    background-color: var(--background-color); /* Match main background or a lighter card variant */
    padding: 0.8em;
    border-radius: 6px;
    border: 1px solid var(--border-color);
  }
</style>
