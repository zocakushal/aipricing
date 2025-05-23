// src/lib/themeStore.ts
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

// Attempt to get theme from localStorage or default to 'light'
const storedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') as Theme | null : null;
const initialTheme: Theme = storedTheme || 'light';

export const theme = writable<Theme>(initialTheme);

theme.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', value);
  }
});
