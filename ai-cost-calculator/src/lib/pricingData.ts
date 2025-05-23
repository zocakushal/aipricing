// src/lib/pricingData.ts
export interface ModelPrice {
  id: string;
  name: string;
  provider: string;
  providerLogoUrl?: string;
  inputCostPerMillionTokens: number;
  outputCostPerMillionTokens: number;
  contextWindow: number;
  keyCapabilities: string[] | string;
  speedRating: 'Fast' | 'Medium' | 'Slow' | 'Unknown';
  qualityRating: number; // 0 for N/A, 1-5 otherwise
  lastUpdated: string; // YYYY-MM-DD
  officialDocsLink?: string;
  notes?: string;
}

export const modelPricing: ModelPrice[] = [
  // OpenAI Models
  {
    id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI',
    inputCostPerMillionTokens: 1.25, outputCostPerMillionTokens: 5.00,
    contextWindow: 1000000, keyCapabilities: 'Advanced reasoning, coding, instruction following, multimodal',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://platform.openai.com',
    notes: 'Knowledge Cutoff: June 2024. Cached input: 75% discount.'
  },
  {
    id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI',
    inputCostPerMillionTokens: 0.40, outputCostPerMillionTokens: 1.60,
    contextWindow: 1000000, keyCapabilities: 'Cost-effective alternative to GPT-4.1',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://platform.openai.com', notes: 'Knowledge Cutoff: June 2024.'
  },
  {
    id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', provider: 'OpenAI',
    inputCostPerMillionTokens: 0.10, outputCostPerMillionTokens: 0.40,
    contextWindow: 1000000, keyCapabilities: 'Fastest and cheapest model',
    speedRating: 'Fast', qualityRating: 3, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://platform.openai.com', notes: 'Knowledge Cutoff: June 2024.'
  },
  {
    id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI',
    inputCostPerMillionTokens: 2.50, outputCostPerMillionTokens: 10.00,
    contextWindow: 128000, keyCapabilities: 'Multimodal (text, image, audio), fast inference',
    speedRating: 'Fast', qualityRating: 5, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://platform.openai.com', notes: 'Knowledge Cutoff: October 2023.'
  },
  {
    id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI',
    inputCostPerMillionTokens: 0.15, outputCostPerMillionTokens: 0.60,
    contextWindow: 128000, keyCapabilities: 'Cost-effective multimodal model',
    speedRating: 'Fast', qualityRating: 4, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://platform.openai.com', notes: 'Knowledge Cutoff: October 2023.'
  },
  {
    id: 'o1-preview', name: 'o1-preview', provider: 'OpenAI',
    inputCostPerMillionTokens: 15.00, outputCostPerMillionTokens: 60.00,
    contextWindow: 128000, keyCapabilities: 'Advanced reasoning, chain-of-thought processing',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://platform.openai.com', notes: 'Knowledge Cutoff: October 2023.'
  },
  {
    id: 'o1-mini', name: 'o1-mini', provider: 'OpenAI',
    inputCostPerMillionTokens: 3.00, outputCostPerMillionTokens: 12.00,
    contextWindow: 128000, keyCapabilities: 'Efficient reasoning model',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://platform.openai.com', notes: 'Knowledge Cutoff: October 2023.'
  },
  {
    id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI',
    inputCostPerMillionTokens: 0.50, outputCostPerMillionTokens: 1.50,
    contextWindow: 16000, keyCapabilities: 'Fast, cost-effective text generation',
    speedRating: 'Fast', qualityRating: 3, lastUpdated: '2025-05-01', // User data indicates 2025-05-01 for all OpenAI, assuming this applies to 3.5T too.
    officialDocsLink: 'https://platform.openai.com', notes: 'Knowledge Cutoff: September 2021.'
  },

  // Anthropic Claude Models
  {
    id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic',
    inputCostPerMillionTokens: 3.00, outputCostPerMillionTokens: 15.00,
    contextWindow: 200000, keyCapabilities: 'Advanced reasoning, coding, analysis',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://docs.anthropic.com', notes: 'Knowledge Cutoff: January 2025.'
  },
  {
    id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'Anthropic',
    inputCostPerMillionTokens: 15.00, outputCostPerMillionTokens: 75.00,
    contextWindow: 200000, keyCapabilities: 'Highest performing model for complex tasks',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://docs.anthropic.com', notes: 'Knowledge Cutoff: January 2025.'
  },
  {
    id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic',
    inputCostPerMillionTokens: 3.00, outputCostPerMillionTokens: 15.00,
    contextWindow: 200000, keyCapabilities: 'Balanced performance and cost',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-05-01', // User data indicates 2025-05-01 for these new Claude models
    officialDocsLink: 'https://docs.anthropic.com', notes: 'Knowledge Cutoff: April 2024.'
  },
  {
    id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic',
    inputCostPerMillionTokens: 1.00, outputCostPerMillionTokens: 5.00,
    contextWindow: 200000, keyCapabilities: 'Fast, lightweight tasks',
    speedRating: 'Fast', qualityRating: 4, lastUpdated: '2025-05-01', // User data indicates 2025-05-01
    officialDocsLink: 'https://docs.anthropic.com', notes: 'Knowledge Cutoff: April 2024.'
  },
  {
    id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic',
    inputCostPerMillionTokens: 15.00, outputCostPerMillionTokens: 75.00,
    contextWindow: 200000, keyCapabilities: 'Highest performance for complex analysis',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2024-03-01',
    officialDocsLink: 'https://docs.anthropic.com', notes: 'Knowledge Cutoff: August 2023.'
  },
  {
    id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic',
    inputCostPerMillionTokens: 0.25, outputCostPerMillionTokens: 1.25,
    contextWindow: 200000, keyCapabilities: 'Speed and efficiency focused',
    speedRating: 'Fast', qualityRating: 3, lastUpdated: '2024-03-01',
    officialDocsLink: 'https://docs.anthropic.com', notes: 'Knowledge Cutoff: August 2023.'
  },

  // Google Gemini Models
  {
    id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google',
    inputCostPerMillionTokens: 1.25, outputCostPerMillionTokens: 10.00,
    contextWindow: 1000000, keyCapabilities: 'Advanced reasoning, coding, multimodal',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://ai.google.dev',
    notes: 'Knowledge Cutoff: June 2024. Input (≤200K tokens): $1.25/MTok, Output (≤200K tokens): $10.00/MTok. Input (>200K tokens): $2.50/MTok, Output (>200K tokens): $15.00/MTok.'
  },
  {
    id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google',
    inputCostPerMillionTokens: 0.10, outputCostPerMillionTokens: 0.40,
    contextWindow: 1000000, keyCapabilities: 'Fast, efficient multimodal processing',
    speedRating: 'Fast', qualityRating: 4, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://ai.google.dev', notes: 'Knowledge Cutoff: October 2024.'
  },
  {
    id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google',
    inputCostPerMillionTokens: 1.25, outputCostPerMillionTokens: 5.00,
    contextWindow: 2000000, keyCapabilities: 'Long context, multimodal understanding', // Context window updated as per new data
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2024-10-01', // Last updated as per new data
    officialDocsLink: 'https://ai.google.dev',
    notes: 'Knowledge Cutoff: May 2024. Input (≤128K tokens): $1.25/MTok, Output (≤128K tokens): $5.00/MTok. Input (>128K tokens): $2.50/MTok, Output (>128K tokens): $10.00/MTok.'
  },
  {
    id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google',
    inputCostPerMillionTokens: 0.075, outputCostPerMillionTokens: 0.30,
    contextWindow: 1000000, keyCapabilities: 'Speed optimized, cost-effective',
    speedRating: 'Fast', qualityRating: 4, lastUpdated: '2024-10-01', // Last updated as per new data
    officialDocsLink: 'https://ai.google.dev', notes: 'Knowledge Cutoff: May 2024.'
  },

  // Meta Llama Models
  {
    id: 'llama-4-maverick', name: 'Llama 4 Maverick', provider: 'Meta',
    inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0,
    contextWindow: 10000000, keyCapabilities: 'Multimodal, mixture of experts, coding',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-04-01',
    officialDocsLink: 'https://ai.meta.com', notes: 'Knowledge Cutoff: March 2024. Pricing via API (pricing TBD).'
  },
  {
    id: 'llama-4-scout', name: 'Llama 4 Scout', provider: 'Meta',
    inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0,
    contextWindow: 10000000, keyCapabilities: 'Efficient reasoning, single GPU deployment',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2025-04-01',
    officialDocsLink: 'https://ai.meta.com', notes: 'Knowledge Cutoff: March 2024. Pricing via API (pricing TBD).'
  },
  {
    id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta',
    inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0,
    contextWindow: 128000, keyCapabilities: 'Enhanced performance over 3.1 series',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2024-12-01',
    officialDocsLink: 'https://ai.meta.com', notes: 'Knowledge Cutoff: December 2023. Available through cloud providers.'
  },
  {
    id: 'llama-3.2-90b', name: 'Llama 3.2 90B Vision', provider: 'Meta',
    inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0,
    contextWindow: 128000, keyCapabilities: 'Multimodal, vision understanding',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2024-09-01',
    officialDocsLink: 'https://ai.meta.com', notes: 'Knowledge Cutoff: December 2023. Available through cloud providers.'
  },
  {
    id: 'llama-3.2-11b', name: 'Llama 3.2 11B Vision', provider: 'Meta',
    inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0,
    contextWindow: 128000, keyCapabilities: 'Lightweight multimodal model',
    speedRating: 'Fast', qualityRating: 3, lastUpdated: '2024-09-01',
    officialDocsLink: 'https://ai.meta.com', notes: 'Knowledge Cutoff: December 2023. Available through cloud providers.'
  },

  // Mistral AI Models
  {
    id: 'mistral-medium-3', name: 'Mistral Medium 3', provider: 'Mistral AI',
    inputCostPerMillionTokens: 0.40, outputCostPerMillionTokens: 2.00,
    contextWindow: 128000, keyCapabilities: 'Coding, STEM, multimodal understanding',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://mistral.ai', notes: 'Knowledge Cutoff: October 2024.'
  },
  {
    id: 'mistral-large-2', name: 'Mistral Large 2', provider: 'Mistral AI',
    inputCostPerMillionTokens: 2.00, outputCostPerMillionTokens: 6.00,
    contextWindow: 128000, keyCapabilities: 'Code generation, mathematics, reasoning',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2024-07-01',
    officialDocsLink: 'https://mistral.ai', notes: 'Knowledge Cutoff: July 2024.'
  },
  {
    id: 'mistral-small-3.1', name: 'Mistral Small 3.1', provider: 'Mistral AI',
    inputCostPerMillionTokens: 0.20, outputCostPerMillionTokens: 0.60,
    contextWindow: 128000, keyCapabilities: 'Multimodal, document understanding',
    speedRating: 'Fast', qualityRating: 3, lastUpdated: '2025-03-01',
    officialDocsLink: 'https://mistral.ai', notes: 'Knowledge Cutoff: March 2024.'
  },
  {
    id: 'codestral', name: 'Codestral', provider: 'Mistral AI',
    inputCostPerMillionTokens: 0.20, outputCostPerMillionTokens: 0.60,
    contextWindow: 32000, keyCapabilities: 'Code generation, 80+ programming languages',
    speedRating: 'Fast', qualityRating: 4, lastUpdated: '2025-01-01',
    officialDocsLink: 'https://mistral.ai', notes: 'Knowledge Cutoff: May 2024.'
  },
  {
    id: 'mixtral-8x22b', name: 'Mixtral 8x22B', provider: 'Mistral AI',
    inputCostPerMillionTokens: 2.00, outputCostPerMillionTokens: 6.00,
    contextWindow: 64000, keyCapabilities: 'Sparse mixture of experts, multilingual',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2024-04-01',
    officialDocsLink: 'https://mistral.ai', notes: 'Knowledge Cutoff: December 2023.'
  },

  // Cohere Models
  {
    id: 'command-a', name: 'Command A', provider: 'Cohere',
    inputCostPerMillionTokens: 5.00, outputCostPerMillionTokens: 15.00,
    contextWindow: 128000, keyCapabilities: 'Agentic AI, multilingual, enterprise optimized',
    speedRating: 'Medium', qualityRating: 5, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://cohere.com', notes: 'Knowledge Cutoff: October 2024.'
  },
  {
    id: 'command-r-plus', name: 'Command R+', provider: 'Cohere',
    inputCostPerMillionTokens: 3.00, outputCostPerMillionTokens: 15.00,
    contextWindow: 128000, keyCapabilities: 'Powerful RAG, enterprise use cases',
    speedRating: 'Medium', qualityRating: 4, lastUpdated: '2024-08-01',
    officialDocsLink: 'https://cohere.com', notes: 'Knowledge Cutoff: April 2024.'
  },
  {
    id: 'command-r', name: 'Command R', provider: 'Cohere',
    inputCostPerMillionTokens: 0.50, outputCostPerMillionTokens: 1.50,
    contextWindow: 128000, keyCapabilities: 'RAG optimized, tool use',
    speedRating: 'Fast', qualityRating: 4, lastUpdated: '2024-08-01',
    officialDocsLink: 'https://cohere.com', notes: 'Knowledge Cutoff: March 2024.'
  },
  {
    id: 'command-r7b', name: 'Command R7B', provider: 'Cohere',
    inputCostPerMillionTokens: 0.30, outputCostPerMillionTokens: 1.20,
    contextWindow: 128000, keyCapabilities: 'Speed and efficiency optimized',
    speedRating: 'Fast', qualityRating: 3, lastUpdated: '2025-05-01',
    officialDocsLink: 'https://cohere.com', notes: 'Knowledge Cutoff: March 2024.'
  },
  {
    id: 'embed-english-v3', name: 'Embed English v3.0', provider: 'Cohere',
    inputCostPerMillionTokens: 0.10, outputCostPerMillionTokens: 0, // Embeddings are typically input cost only
    contextWindow: 512, keyCapabilities: 'High-quality text embeddings',
    speedRating: 'Fast', qualityRating: 0, lastUpdated: '2024-01-01', // Assuming a general 2024 update
    officialDocsLink: 'https://cohere.com', notes: 'Embedding model. Cost is $0.10 per 1M input tokens. Knowledge Cutoff: N/A.'
  },
  {
    id: 'embed-multilingual-v3', name: 'Embed Multilingual v3.0', provider: 'Cohere',
    inputCostPerMillionTokens: 0.10, outputCostPerMillionTokens: 0, // Embeddings are typically input cost only
    contextWindow: 512, keyCapabilities: 'Multilingual embeddings',
    speedRating: 'Fast', qualityRating: 0, lastUpdated: '2024-01-01', // Assuming a general 2024 update
    officialDocsLink: 'https://cohere.com', notes: 'Embedding model. Cost is $0.10 per 1M input tokens. Knowledge Cutoff: N/A.'
  },
  {
    id: 'rerank-english-v3', name: 'Rerank English v3.0', provider: 'Cohere',
    inputCostPerMillionTokens: 0, outputCostPerMillionTokens: 0,
    contextWindow: 4096, keyCapabilities: 'Document reranking for search',
    speedRating: 'Fast', qualityRating: 0, lastUpdated: '2024-01-01', // Assuming a general 2024 update
    officialDocsLink: 'https://cohere.com', notes: 'Reranking model. Pricing: $1.00 per 1K search units. Token costs not directly applicable. Knowledge Cutoff: N/A.'
  }
];
