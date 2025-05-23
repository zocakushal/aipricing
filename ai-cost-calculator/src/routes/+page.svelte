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

<main class="container">
  <!-- Hero Section -->
  <header class="hero animate-fade-in">
    <h1 class="hero-title">AI Model Cost Calculator</h1>
    <p class="hero-subtitle">Compare pricing across different AI models and optimize your usage costs</p>
  </header>

  <!-- Quick Stats -->
  <div class="stats-grid animate-fade-in">
    <div class="stat-card">
      <div class="stat-number">{filteredDisplayModels.length}</div>
      <div class="stat-label">Models Available</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${$calculatedCost.toFixed(4)}</div>
      <div class="stat-label">Estimated Cost</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{$numberOfRequests.toLocaleString()}</div>
      <div class="stat-label">Requests</div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="main-grid">
    <!-- Left Column: Calculator & Cost Display -->
    <div class="left-column">
      {#if $selectedModel}
        <div class="selected-model-card animate-slide-in">
          <div class="model-header">
            <div class="model-info">
              <h3 class="model-name">{$selectedModel.name}</h3>
              <div class="model-provider">{$selectedModel.provider}</div>
              <div class="model-capabilities">
                {Array.isArray($selectedModel.keyCapabilities) ? $selectedModel.keyCapabilities.slice(0, 3).join(', ') : $selectedModel.keyCapabilities}
              </div>
            </div>
            <div class="model-badges">
              <div class="quality-badge">
                ⭐ {$selectedModel.qualityRating === 0 ? 'N/A' : `${$selectedModel.qualityRating}/5`}
              </div>
              <div class="speed-badge {$selectedModel.speedRating.toLowerCase()}">
                {$selectedModel.speedRating === 'Fast' ? '⚡' : $selectedModel.speedRating === 'Medium' ? '🚀' : '🐌'} {$selectedModel.speedRating}
              </div>
            </div>
          </div>
          
          <div class="pricing-info">
            <div class="price-item">
              <span class="price-label">💬 Input</span>
              <span class="price-value">${$selectedModel.inputCostPerMillionTokens.toFixed(2)}/M</span>
              <span class="price-subtext">tokens</span>
            </div>
            <div class="price-item">
              <span class="price-label">📤 Output</span>
              <span class="price-value">${$selectedModel.outputCostPerMillionTokens.toFixed(2)}/M</span>
              <span class="price-subtext">tokens</span>
            </div>
            <div class="price-item context-window">
              <span class="price-label">📄 Context</span>
              <span class="price-value">{($selectedModel.contextWindow / 1000).toFixed(0)}K</span>
              <span class="price-subtext">tokens</span>
            </div>
          </div>
          
          {#if $modelNotes}
            <div class="model-notes">
              <div class="notes-header">📝 Notes</div>
              <small>{$modelNotes}</small>
            </div>
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
    </div>

    <!-- Right Column: Filters & Visualization -->
    <div class="right-column">
      <div class="filters-chart-container">
        <FilterSortControls {modelPricing} on:filtersChanged={handleFiltersChanged} />
        <CostCharts chartData={chartDisplayData} />
      </div>
    </div>
  </div>

  <!-- Models Table -->
  <div class="table-section animate-fade-in">
    <div class="section-header">
      <h2>Available Models</h2>
      <p class="text-secondary">Click on any model to select it for calculations</p>
    </div>
    <ModelTable models={filteredDisplayModels} on:modelSelected={handleModelSelected} />
  </div>
</main>

<style>
  main {
    padding: 2rem 0;
    min-height: 100vh;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slide-in {
    animation: slideIn 0.5s ease-out;
  }

  /* Hero Section */
  .hero {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
  }

  .hero-title {
    font-size: 3rem;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    font-weight: 800;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Main Grid Layout */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 1024px) {
    .main-grid {
      grid-template-columns: 1fr;
    }
    
    .hero-title {
      font-size: 2.5rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
  }

  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .filters-chart-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: fit-content;
  }

  /* Selected Model Card */
  .selected-model-card {
    background: linear-gradient(135deg, var(--card-bg) 0%, var(--background-secondary) 100%);
    border: 2px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .selected-model-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  }

  .selected-model-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
  }

  .model-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.25rem;
  }

  .model-name {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
    color: var(--text-color);
    line-height: 1.2;
  }

  .model-provider {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .model-capabilities {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 400;
    font-style: italic;
    line-height: 1.3;
    max-width: 200px;
  }

  .model-badges {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .quality-badge {
    background: var(--accent-color);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .speed-badge {
    padding: 0.25rem 0.7rem;
    border-radius: 15px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .speed-badge.fast {
    background: #10B981;
    color: white;
  }

  .speed-badge.medium {
    background: #F59E0B;
    color: white;
  }

  .speed-badge.slow {
    background: #EF4444;
    color: white;
  }

  .pricing-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .price-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0.75rem;
    background: var(--background-secondary);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    text-align: center;
    transition: all 0.2s ease;
  }

  .price-item:hover {
    background: var(--card-bg);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .price-item.context-window {
    border: 2px dashed var(--border-color);
  }

  .price-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .price-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.25rem;
  }

  .price-subtext {
    font-size: 0.65rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .model-notes {
    padding: 1rem;
    background: var(--background-secondary);
    border-radius: 10px;
    border-left: 4px solid var(--accent-color);
    transition: all 0.2s ease;
  }

  .model-notes:hover {
    background: var(--card-bg);
    box-shadow: var(--shadow);
  }

  .notes-header {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .model-notes small {
    color: var(--text-secondary);
    font-style: italic;
    line-height: 1.4;
  }

  /* Table Section */
  .table-section {
    margin-top: 2rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    margin-bottom: 0.5rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    main {
      padding: 1rem 0;
    }

    .hero {
      margin-bottom: 2rem;
      padding: 1rem 0;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .main-grid {
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .pricing-info {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .price-item {
      padding: 0.75rem 0.5rem;
    }

    .selected-model-card {
      padding: 1rem;
    }

    .model-name {
      font-size: 1.2rem;
    }

    .model-capabilities {
      max-width: 150px;
      font-size: 0.75rem;
    }
  }
</style>
