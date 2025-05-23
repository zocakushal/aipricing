<script lang="ts">
  export let cost: number = 0;
  const decimalPlaces = 5;
  
  // Format cost with appropriate precision
  $: formattedCost = cost < 0.01 ? cost.toFixed(decimalPlaces) : cost.toFixed(2);
  $: costLevel = cost < 0.01 ? 'low' : cost < 1 ? 'medium' : 'high';
</script>

<div class="cost-display-card">
  <div class="cost-header">
    <h4>💰 Estimated Cost</h4>
    <div class="cost-badge {costLevel}">
      {costLevel === 'low' ? 'Affordable' : costLevel === 'medium' ? 'Moderate' : 'Premium'}
    </div>
  </div>
  
  <div class="cost-value-container">
    <span class="currency">$</span>
    <span class="cost-value">{formattedCost}</span>
  </div>
  
  <div class="cost-breakdown">
    <div class="breakdown-item">
      <span class="breakdown-label">Per request</span>
      <span class="breakdown-value">${(cost / Math.max(1, cost > 0 ? 1 : 1)).toFixed(6)}</span>
    </div>
  </div>
</div>

<style>
  .cost-display-card {
    background: linear-gradient(135deg, var(--card-bg) 0%, var(--background-secondary) 100%);
    border: 2px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: var(--shadow-lg);
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .cost-display-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  }

  .cost-display-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
  }

  .cost-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .cost-header h4 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cost-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cost-badge.low {
    background: var(--success-color);
    color: white;
  }

  .cost-badge.medium {
    background: var(--warning-color);
    color: white;
  }

  .cost-badge.high {
    background: var(--error-color);
    color: white;
  }

  .cost-value-container {
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-bottom: 1rem;
    gap: 0.25rem;
  }

  .currency {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .cost-value {
    font-size: 3rem;
    font-weight: 800;
    color: var(--primary-color);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .cost-breakdown {
    padding-top: 1rem;
    border-top: 1px solid var(--border-light);
  }

  .breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .breakdown-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .breakdown-value {
    font-size: 0.875rem;
    color: var(--text-color);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .cost-display-card {
      padding: 1.5rem;
    }

    .cost-value {
      font-size: 2.5rem;
    }

    .currency {
      font-size: 1.25rem;
    }

    .cost-header {
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }
  }
</style>
