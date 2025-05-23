<script lang="ts">
  import { theme } from '$lib/themeStore';

  function toggleTheme() {
    theme.update(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  let currentThemeLabel: string;
  $: currentThemeLabel = $theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
</script>

<button on:click={toggleTheme} aria-label={currentThemeLabel} class="theme-toggle-button">
  {$theme === 'light' ? '🌙 Dark' : '☀️ Light'}
</button>

<style>
  .theme-toggle-button { /* Changed to class selector for specificity */
    padding: 0.6em 1em; /* Slightly adjusted padding */
    cursor: pointer;
    border: 1px solid var(--border-color); 
    background-color: var(--button-secondary-bg); 
    color: var(--button-secondary-text-color); 
    border-radius: 6px; /* Slightly more rounded */
    position: fixed; 
    top: 1em; /* Use em for responsive spacing */
    right: 1em; /* Use em for responsive spacing */
    z-index: 1000;
    font-weight: 500; /* From Inter font */
    box-shadow: var(--shadow); /* Add a subtle shadow */
    transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  }

  .theme-toggle-button:hover {
    background-color: var(--button-secondary-hover-bg);
    transform: translateY(-1px); /* Slight lift on hover */
  }

  .theme-toggle-button:active {
    transform: translateY(0px); /* Button press effect */
  }
</style>
