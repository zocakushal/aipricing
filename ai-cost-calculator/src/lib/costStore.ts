import { writable, derived, type Readable } from 'svelte/store'; // Ensure Readable is imported if used in type hints
import { modelPricing, type ModelPrice } from './pricingData';

// Default to the first model's ID, or an empty string if no models
const initialModelId = modelPricing.length > 0 ? modelPricing[0].id : '';

// Writable stores for user inputs
export const inputTokens = writable<number>(0);
export const outputTokens = writable<number>(0);
export const selectedModelId = writable<string>(initialModelId);

// Derived store for the selected model object
// The type for derived store should be [Readable<string>] for a single store dependency
// or an array of Readables for multiple. The callback's first arg is the store value(s).
// The initial value for derived is optional if the callback can run synchronously.
export const selectedModel = derived<typeof selectedModelId, ModelPrice | undefined>(
  selectedModelId,
  ($selectedModelId) => {
    return modelPricing.find(model => model.id === $selectedModelId);
  }
  // Providing an initial value can be useful if the derivation is complex or async
  // For simple synchronous derivations like this, it's often optional,
  // but good for consistency if other derived stores have it.
  // modelPricing.find(model => model.id === initialModelId) 
);

// Derived store for the calculated cost
// The type for derived store should be [Readable<number>, Readable<number>, Readable<ModelPrice | undefined>]
export const calculatedCost = derived<[typeof inputTokens, typeof outputTokens, typeof selectedModel], number>(
  [inputTokens, outputTokens, selectedModel],
  ([$inputTokens, $outputTokens, $selectedModel]) => {
    if (!$selectedModel) {
      return 0;
    }

    const inputCost = ($inputTokens / 1000000) * $selectedModel.inputCostPerMillionTokens;
    const outputCost = ($outputTokens / 1000000) * $selectedModel.outputCostPerMillionTokens;
    
    return Math.max(0, inputCost + outputCost);
  },
  0 // Initial value for the calculated cost
);

// Optional: A store for any notes related to the selected model
export const modelNotes = derived<typeof selectedModel, string | undefined>(
  selectedModel,
  ($selectedModel) => {
    return $selectedModel?.notes;
  }
  // initialModelPricing.find(model => model.id === initialModelId)?.notes
);
