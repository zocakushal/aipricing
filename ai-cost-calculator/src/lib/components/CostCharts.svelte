<script lang="ts">
import { onMount, onDestroy, afterUpdate } from 'svelte';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register only the components you need
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  if (chartInstance.options.scales?.x?.grid) {
    chartInstance.options.scales.x.grid.color = getCssVar('--chart-grid-color');
  }
  if (chartInstance.options.scales?.y?.grid) {
    chartInstance.options.scales.y.grid.color = getCssVar('--chart-grid-color');
  }
  if (chartInstance.options.scales?.x?.ticks) {
    chartInstance.options.scales.x.ticks.color = getCssVar('--chart-label-color');
  }
  if (chartInstance.options.scales?.y?.ticks) {
    chartInstance.options.scales.y.ticks.color = getCssVar('--chart-label-color');
  }
  if (chartInstance.options.scales?.x?.title) {
    chartInstance.options.scales.x.title.color = getCssVar('--chart-label-color');
  }
  if (chartInstance.options.scales?.y?.title) {    
    chartInstance.options.scales.y.title.color = getCssVar('--chart-label-color');
  }
  
  if (chartInstance.options.plugins?.tooltip) {
    chartInstance.options.plugins.tooltip.backgroundColor = getCssVar('--chart-tooltip-bg');
    chartInstance.options.plugins.tooltip.titleColor = getCssVar('--chart-tooltip-text-color');
    chartInstance.options.plugins.tooltip.bodyColor = getCssVar('--chart-tooltip-text-color');
    chartInstance.options.plugins.tooltip.footerColor = getCssVar('--chart-tooltip-text-color');
  }
  
  // Update dataset colors based on current theme and best value
  const bestValueLabels = getBestValueModels(chartData);
  const providerColors = new Map<string, { background: string, border: string }>();
  const baseColors = [
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

  const bestValueBgColor = getCssVar('--accent-color') || 'rgba(0, 255, 0, 0.8)';
  const bestValueBorderColor = getCssVar('--accent-color') || 'rgba(0, 255, 0, 1)';

  if (chartInstance.data.datasets[0]) {
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
  }

  chartInstance.update('none');
}

$: if (chartData && chartInstance) {
  chartInstance.data.labels = chartData.map(d => d.label);
  if (chartInstance.data.datasets[0]) {
    chartInstance.data.datasets[0].data = chartData.map(d => d.cost);
  }
  updateChartStyling();
}

onMount(() => {
  if (!chartCanvas) return;
  
  chartInstance = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: chartData.map(d => d.label),
      datasets: [{
        label: 'Cost ($)',
        data: chartData.map(d => d.cost),
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { 
        y: { 
          beginAtZero: true, 
          title: { 
            display: true, 
            text: 'Cost (USD)', 
            color: getCssVar('--chart-label-color') 
          },
          grid: { 
            color: getCssVar('--chart-grid-color') 
          },
          ticks: { 
            color: getCssVar('--chart-label-color') 
          }
        }, 
        x: { 
          title: { 
            display: true, 
            text: 'Model', 
            color: getCssVar('--chart-label-color') 
          },
          grid: { 
            color: getCssVar('--chart-grid-color') 
          },
          ticks: { 
            color: getCssVar('--chart-label-color') 
          }
        } 
      },
      plugins: {
        tooltip: {
          backgroundColor: getCssVar('--chart-tooltip-bg'),
          titleColor: getCssVar('--chart-tooltip-text-color'),
          bodyColor: getCssVar('--chart-tooltip-text-color'),
          footerColor: getCssVar('--chart-tooltip-text-color'),
          callbacks: {
            footer: function(tooltipItems: any[]) {
              const item = chartData[tooltipItems[0].dataIndex];
              return `Provider: ${item.provider}\nQuality: ${item.quality}/5`;
            }
          }
        },
        legend: {
          labels: {
            color: getCssVar('--chart-label-color')
          }
        }
      }
    }
  });
  updateChartStyling();
});

afterUpdate(() => {
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
    padding: 1.5em;
    border: 1px solid var(--border-color);
    border-radius: 8px; 
    background-color: var(--card-bg);
    box-shadow: var(--shadow);
    position: relative;
    height: 50vh; 
    width: 100%;
  }
</style>
