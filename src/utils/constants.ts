import { AIActionConfig } from '../types';

export const AI_ACTIONS: AIActionConfig[] = [
  {
    id: 'rewrite',
    label: 'Rewrite',
    description: 'Rewrite the text with improved clarity and flow',
    icon: 'RefreshCw',
    shortcut: '⌘1',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    description: 'Create a concise summary of the content',
    icon: 'FileText',
    shortcut: '⌘2',
  },
  {
    id: 'expand',
    label: 'Expand',
    description: 'Add more detail and depth to the content',
    icon: 'Maximize2',
    shortcut: '⌘3',
  },
  {
    id: 'bulletify',
    label: 'Bulletify',
    description: 'Convert text into bullet points',
    icon: 'List',
    shortcut: '⌘4',
  },
  {
    id: 'formalize',
    label: 'Formalize',
    description: 'Make the tone more professional and formal',
    icon: 'Briefcase',
    shortcut: '⌘5',
  },
  {
    id: 'shorten',
    label: 'Shorten',
    description: 'Make the text more concise',
    icon: 'Minimize2',
    shortcut: '⌘6',
  },
  {
    id: 'translate',
    label: 'Translate',
    description: 'Translate to another language',
    icon: 'Globe',
    shortcut: '⌘7',
  },
  {
    id: 'fix-grammar',
    label: 'Fix Grammar',
    description: 'Correct grammar and spelling errors',
    icon: 'Check',
    shortcut: '⌘8',
  },
];

export const TRANSLATE_LANGUAGES = [
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Russian',
];

export const DEFAULT_CONTENT = `# Welcome to MD Enhancer

Start writing your markdown here. Use the **AI Actions** panel on the right to enhance your content.

## Features

- 📝 **Live Preview** - See your markdown rendered in real-time
- 🤖 **AI Enhancement** - Rewrite, summarize, expand, and more
- 💾 **Auto-save** - Your work is automatically saved
- 📤 **Export** - Download as .md, .txt, or .pdf

## Getting Started

1. Enter your API key (OpenAI or Anthropic) using the key icon
2. Write or paste your markdown content
3. Select text and use AI actions to enhance it

---

> "The best writing is rewriting." — E.B. White

Happy writing! ✨
`;

