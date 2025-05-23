import { writable, derived, type Readable } from 'svelte/store'; // Ensure Readable is imported for type hints in derived
import { modelPricing, type ModelPrice } from './pricingData';

// Default to the first model's ID, or an empty string if no models
const initialModelId = modelPricing.length > 0 ? modelPricing[0].id : '';

// Writable stores for user inputs
export const inputTokens = writable<number>(0);
export const outputTokens = writable<number>(0);
export const selectedModelId = writable<string>(initialModelId);
export const numberOfRequests = writable<number>(1); // ADDED THIS STORE

// Derived store for the selected model object
// The type for derived store's callback's first argument is the value of the store(s)
// The type for derived store's callback's second argument (set) is (value: T) => void
// The type for derived store's initial value is T | undefined
export const selectedModel = derived<typeof selectedModelId, ModelPrice | undefined>(
  selectedModelId,
  ($selectedModelId, set) => {
    set(modelPricing.find(model => model.id === $selectedModelId));
  },
  modelPricing.find(model => model.id === initialModelId) // Initial value
);

// Derived store for the calculated cost - MODIFIED
export const calculatedCost = derived<
  [typeof inputTokens, typeof outputTokens, typeof selectedModel, typeof numberOfRequests], // Added numberOfRequests
  number
>(
  [inputTokens, outputTokens, selectedModel, numberOfRequests], // Added numberOfRequests
  ([$inputTokens, $outputTokens, $selectedModel, $numberOfRequests], set) => { // Added $numberOfRequests
    if (!$selectedModel || $numberOfRequests < 1) { // Also check for valid numberOfRequests
      set(0);
      return;
    }

    const costPerRequest =
      ($inputTokens / 1000000) * $selectedModel.inputCostPerMillionTokens +
      ($outputTokens / 1000000) * $selectedModel.outputCostPerMillionTokens;
    
    set(Math.max(0, costPerRequest * $numberOfRequests)); // Multiply by number of requests
  },
  0 // Initial value
);

// Optional: A store for any notes related to the selected model
export const modelNotes = derived<typeof selectedModel, string | undefined>(
  selectedModel,
  ($selectedModel, set) => {
    set($selectedModel?.notes);
  },
  modelPricing.find(model => model.id === initialModelId)?.notes // Initial value
);
