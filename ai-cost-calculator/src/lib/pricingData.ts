export interface ModelPrice {
  id: string;
  name: string;
  inputCostPerMillionTokens: number; // Cost in USD per 1,000,000 tokens
  outputCostPerMillionTokens: number; // Cost in USD per 1,000,000 tokens
  notes?: string; // Optional notes, e.g., for different tiers or context window sizes
}

export const modelPricing: ModelPrice[] = [
  // Gemini Models
  { id: "gemini-2.5-flash-preview", name: "Gemini 2.5 Flash Preview", inputCostPerMillionTokens: 0.15, outputCostPerMillionTokens: 0.60, notes: "Thinking output: $3.50/MTok" },
  { id: "gemini-2.5-pro-preview", name: "Gemini 2.5 Pro Preview", inputCostPerMillionTokens: 1.25, outputCostPerMillionTokens: 10.00, notes: "Prompts <= 200k tokens. Higher for >200k." },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", inputCostPerMillionTokens: 0.10, outputCostPerMillionTokens: 0.40 },
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash-Lite", inputCostPerMillionTokens: 0.075, outputCostPerMillionTokens: 0.30 },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", inputCostPerMillionTokens: 0.075, outputCostPerMillionTokens: 0.30, notes: "Prompts <= 128k tokens. Higher for >128k." },
  { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash-8B", inputCostPerMillionTokens: 0.0375, outputCostPerMillionTokens: 0.15, notes: "Prompts <= 128k tokens. Higher for >128k." },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", inputCostPerMillionTokens: 1.25, outputCostPerMillionTokens: 5.00, notes: "Prompts <= 128k tokens. Higher for >128k." },
  
  // Imagen Models - Priced per image
  // Assuming 1024x1024px image = 1290 tokens for calculation consistency.
  // Imagen 3: $0.03 per image. Cost per MTok = ($0.03 / 1290) * 1,000,000
  { id: "imagen-3", name: "Imagen 3", inputCostPerMillionTokens: 0, outputCostPerMillionTokens: (0.03 / 1290) * 1000000, notes: "Priced per image ($0.03). Assumed 1290 tokens per image for calculation display." },
  // Imagen (via Gemini 2.0 Flash): $0.039 per image. Cost per MTok = ($0.039 / 1290) * 1,000,000
  { id: "imagen-2-gemini-2.0-flash", name: "Imagen (via Gemini 2.0 Flash)", inputCostPerMillionTokens: 0, outputCostPerMillionTokens: (0.039 / 1290) * 1000000, notes: "Priced per image ($0.039). Assumed 1290 tokens per image for calculation display." },

  // Veo Models - Priced per second
  { id: "veo-2", name: "Veo 2", inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0, notes: "Priced per second of video ($0.35/sec HD, $0.70/sec 4K). Token cost is not directly applicable." },

  // Gemma Models - Typically free or priced differently (e.g., per instance hour for fine-tuning/deployment)
  { id: "gemma-3", name: "Gemma 3", inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0, notes: "Free tier for basic use. Paid options usually involve compute instances, not per-token I/O." },
  { id: "gemma-3n", name: "Gemma 3n", inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0, notes: "Free tier for basic use. Paid options usually involve compute instances, not per-token I/O." }
];
