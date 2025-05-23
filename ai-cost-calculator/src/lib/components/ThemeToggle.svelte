<script lang="ts">
  import { theme } from '$lib/themeStore';

  function toggleTheme() {
    theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  let currentThemeLabel: string;
  $: currentThemeLabel = $theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
</script>

<div class="theme-toggle-container">
  <button 
    on:click={toggleTheme} 
    aria-label={currentThemeLabel} 
    class="theme-toggle-button"
    title={currentThemeLabel}
  >
    <div class="toggle-icon">
      {#if $theme === 'light'}
        🌙
      {:else}
        ☀️
      {/if}
    </div>
    <span class="toggle-text">
      {$theme === 'light' ? 'Dark' : 'Light'}
    </span>
  </button>
</div>

<style>
  .theme-toggle-container {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
  }

  .theme-toggle-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    border: 2px solid var(--border-color);
    background: var(--card-bg);
    color: var(--text-color);
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .theme-toggle-button:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .theme-toggle-button:active {
    transform: translateY(0);
  }

  .toggle-icon {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  .theme-toggle-button:hover .toggle-icon {
    transform: rotate(180deg);
  }

  .toggle-text {
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .theme-toggle-container {
      top: 1rem;
      right: 1rem;
    }

    .theme-toggle-button {
      padding: 0.6rem 0.8rem;
      font-size: 0.8rem;
    }

    .toggle-text {
      display: none;
    }

    .toggle-icon {
      font-size: 1.1rem;
    }
  }
</style>
