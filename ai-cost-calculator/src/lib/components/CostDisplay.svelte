<script lang="ts">
  export let cost: number = 0;
  const decimalPlaces = 5; 
</script>

<div class="cost-display-card">
  <h4>Calculated Cost:</h4>
  <p class="cost-value">${cost.toFixed(decimalPlaces)}</p>
</div>

<style>
  .cost-display-card {
    margin-top: 1.5em; /* Use em for responsive spacing */
    padding: 1.5em;    /* Use em for responsive spacing */
    border: 1px solid var(--border-color);
    border-radius: 8px; /* Consistent with other card-like elements */
    background-color: var(--card-bg);
    box-shadow: var(--shadow);
    text-align: center; /* Center align the content */
  }

  h4 {
    margin-top: 0;
    margin-bottom: 0.5em; /* Space between title and cost */
    color: var(--text-color);
    font-size: 1.1em; /* Slightly adjust size */
    font-weight: 500; /* From Inter font */
  }

  .cost-value {
    font-size: 2em; /* Make cost more prominent */
    font-weight: 700; /* Bolder for emphasis */
    color: var(--accent-color); /* Use accent color for the cost value */
    margin: 0; /* Remove default paragraph margin */
    line-height: 1.2; /* Adjust line height for large font */
  }
</style>
