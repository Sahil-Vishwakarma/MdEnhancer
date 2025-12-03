export type AIProvider = 'openai' | 'anthropic' | 'perplexity';

export type AIAction = 
  | 'rewrite'
  | 'summarize'
  | 'expand'
  | 'bulletify'
  | 'formalize'
  | 'shorten'
  | 'translate'
  | 'fix-grammar';

export interface AIActionConfig {
  id: AIAction;
  label: string;
  description: string;
  icon: string;
  shortcut?: string;
}

export interface APIKeys {
  openai: string;
  anthropic: string;
  perplexity: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  provider: AIProvider;
  translateLanguage: string;
}

export interface HistoryEntry {
  content: string;
  timestamp: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  icon: string;
}

export type StatusType = 'idle' | 'processing' | 'success' | 'error';

export interface Status {
  type: StatusType;
  message?: string;
}

