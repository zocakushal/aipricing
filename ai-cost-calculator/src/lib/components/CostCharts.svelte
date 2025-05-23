<script lang="ts">
import { onMount, onDestroy, afterUpdate } from 'svelte'; // Added afterUpdate
import { Chart, registerables, defaults } from 'chart.js/auto'; 
Chart.register(registerables); 

export let chartData: { label: string, cost: number, quality: number, provider: string }[] = [];

let chartCanvas: HTMLCanvasElement;
let chartInstance: Chart | null = null;

const MIN_QUALITY_FOR_BEST_VALUE = 3;
const NUM_BEST_VALUE_MODELS = 3; 

// Helper function to get CSS variable values
function getCssVar(varName: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '#000'; // Fallback for SSR or if var not found
}

function getBestValueModels(data: typeof chartData) {
  const eligibleModels = data.filter(d => d.quality >= MIN_QUALITY_FOR_BEST_VALUE);
  if (!eligibleModels.length) return [];
  eligibleModels.sort((a, b) => {
    const ratioA = a.cost / a.quality;
    const ratioB = b.cost / b.quality;
    if (ratioA !== ratioB) return ratioA - ratioB;
    return b.quality - a.quality; 
  });
  return eligibleModels.slice(0, NUM_BEST_VALUE_MODELS).map(m => m.label);
}

function updateChartStyling() {
  if (!chartInstance) return;

  // Update colors that depend on CSS variables
  chartInstance.options.scales!.x!.grid!.color = getCssVar('--chart-grid-color');
  chartInstance.options.scales!.y!.grid!.color = getCssVar('--chart-grid-color');
  chartInstance.options.scales!.x!.ticks!.color = getCssVar('--chart-label-color');
  chartInstance.options.scales!.y!.ticks!.color = getCssVar('--chart-label-color');
  chartInstance.options.scales!.x!.title!.color = getCssVar('--chart-label-color');
  chartInstance.options.scales!.y!.title!.color = getCssVar('--chart-label-color');
  
  if (chartInstance.options.plugins?.tooltip) {
    // @ts-ignore Chart.js Tooltip specific options might not be perfectly typed
    chartInstance.options.plugins.tooltip.backgroundColor = getCssVar('--chart-tooltip-bg');
    // @ts-ignore
    chartInstance.options.plugins.tooltip.titleColor = getCssVar('--chart-tooltip-text-color');
    // @ts-ignore
    chartInstance.options.plugins.tooltip.bodyColor = getCssVar('--chart-tooltip-text-color');
    // @ts-ignore
    chartInstance.options.plugins.tooltip.footerColor = getCssVar('--chart-tooltip-text-color');
  }
  
  // Update dataset colors based on current theme and best value
  const bestValueLabels = getBestValueModels(chartData);
  const providerColors = new Map<string, { background: string, border: string }>();
  const baseColors = [ // These could also be CSS vars if more control is needed
    { background: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
    { background: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
    { background: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)' },
    { background: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
    { background: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' },
    { background: 'rgba(255, 159, 64, 0.6)', border: 'rgba(255, 159, 64, 1)' }
  ];
  let colorIndex = 0;
  chartData.forEach(d => {
    if (!providerColors.has(d.provider)) {
      providerColors.set(d.provider, baseColors[colorIndex % baseColors.length]);
      colorIndex++;
    }
  });

  const bestValueBgColor = getCssVar('--accent-color') || 'rgba(0, 255, 0, 0.8)'; // Use accent color for best value
  const bestValueBorderColor = getCssVar('--accent-color') || 'rgba(0, 255, 0, 1)';

  chartInstance.data.datasets[0].backgroundColor = chartData.map(d => 
    bestValueLabels.includes(d.label) ? 
    bestValueBgColor : 
    (providerColors.get(d.provider)?.background || 'rgba(201, 203, 207, 0.6)')
  );
  chartInstance.data.datasets[0].borderColor = chartData.map(d => 
    bestValueLabels.includes(d.label) ? 
    bestValueBorderColor : 
    (providerColors.get(d.provider)?.border || 'rgba(201, 203, 207, 1)')
  );
   chartInstance.data.datasets[0].borderWidth = chartData.map(d => bestValueLabels.includes(d.label) ? 2 : 1);

  chartInstance.update('none'); // 'none' for no animation during style update
}


$: if (chartData && chartInstance) {
  chartInstance.data.labels = chartData.map(d => d.label);
  chartInstance.data.datasets[0].data = chartData.map(d => d.cost);
  updateChartStyling(); // Update styles along with data
}

onMount(() => {
  if (!chartCanvas) return;
  
  chartInstance = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: chartData.map(d => d.label), // Initial labels
      datasets: [{ // Initial dataset structure
        label: 'Cost ($)',
        data: chartData.map(d => d.cost), // Initial data
        backgroundColor: [], // Will be populated by updateChartStyling
        borderColor: [],     // Will be populated by updateChartStyling
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { 
        y: { 
          beginAtZero: true, 
          title: { display: true, text: 'Cost (USD)', color: getCssVar('--chart-label-color') },
          grid: { color: getCssVar('--chart-grid-color') },
          ticks: { color: getCssVar('--chart-label-color') }
        }, 
        x: { 
          title: { display: true, text: 'Model', color: getCssVar('--chart-label-color') },
          grid: { color: getCssVar('--chart-grid-color') },
          ticks: { color: getCssVar('--chart-label-color') }
        } 
      },
      plugins: {
        tooltip: {
          backgroundColor: getCssVar('--chart-tooltip-bg'),
          titleColor: getCssVar('--chart-tooltip-text-color'),
          bodyColor: getCssVar('--chart-tooltip-text-color'),
          footerColor: getCssVar('--chart-tooltip-text-color'),
          callbacks: {
            // @ts-ignore
            footer: function(tooltipItems) {
              const item = chartData[tooltipItems[0].dataIndex];
              return `Provider: ${item.provider}\nQuality: ${item.quality}/5`;
            }
          }
        },
        legend: {
          labels: {
            color: getCssVar('--chart-label-color') // Set legend label color
          }
        }
      }
    }
  });
  updateChartStyling(); // Apply initial styling based on theme
});

// Svelte's afterUpdate is useful if chart needs to react to external DOM changes
// or theme changes that are not direct prop updates.
// Here, we listen to theme store changes directly if needed or rely on app.css for body class.
// For CSS var changes, Chart.js might need a nudge.
afterUpdate(() => {
    // This ensures that if CSS variables change (e.g. theme toggle),
    // the chart options that use them are re-evaluated.
    if (chartInstance) {
        updateChartStyling();
    }
});


onDestroy(() => {
  chartInstance?.destroy();
});

</script>

<div class="chart-container">
  <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
  .chart-container {
    margin-top: 2em;
    padding: 1.5em; /* Increased padding */
    border: 1px solid var(--border-color);
    border-radius: 8px; 
    background-color: var(--card-bg); /* Use card background */
    box-shadow: var(--shadow); /* Add shadow */
    position: relative; /* Needed for Chart.js responsiveness */
    height: 50vh; 
    width: 100%; /* Take full width of its parent */
  }
</style>
