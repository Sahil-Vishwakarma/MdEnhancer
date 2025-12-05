# MD Enhancer

A powerful, client-side Markdown editor with AI-powered text enhancement capabilities. Transform your notes with intelligent rewriting, summarization, expansion, and more — all running entirely in your browser.

![MD Enhancer Screenshot](https://via.placeholder.com/800x450?text=MD+Enhancer+Screenshot)

## Features

### Core Editor
- **Monaco Editor** — VS Code-powered editing experience with syntax highlighting
- **Live Preview** — Real-time markdown rendering with GitHub Flavored Markdown support
- **Three-Panel Layout** — Editor, Preview, and AI Actions panels (all toggleable)
- **Auto-save** — Your work is automatically saved to browser localStorage
- **Undo/Redo** — Full history support with keyboard shortcuts

### AI Enhancement
Transform your text with 8 AI-powered actions:

| Action | Shortcut | Description |
|--------|----------|-------------|
| Rewrite | `⌘1` | Improve clarity and flow |
| Summarize | `⌘2` | Create concise summaries |
| Expand | `⌘3` | Add detail and depth |
| Bulletify | `⌘4` | Convert to bullet points |
| Formalize | `⌘5` | Professional tone |
| Shorten | `⌘6` | Make text concise |
| Translate | `⌘7` | Translate to other languages |
| Fix Grammar | `⌘8` | Correct errors |

### Supported AI Providers
- **OpenAI** — GPT-4o-mini
- **Anthropic** — Claude 3 Haiku
- **Perplexity** — Sonar (with web search capabilities)

### Export Options
- **Markdown** (.md)
- **Plain Text** (.txt)
- **PDF Document** (.pdf)

### Templates
Quick-start templates for common note types:
- 📋 Meeting Notes
- 📅 Daily Log
- 📖 Documentation
- 🎓 Study Notes

### UI/UX
- **Dark/Light Mode** — System preference detection + manual toggle
- **Responsive Design** — Works on desktop and tablet
- **Keyboard Shortcuts** — Fast workflow with `⌘K` command palette

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Editor**: Monaco Editor
- **Markdown**: react-markdown + remark-gfm
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Export**: html2pdf.js

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/mdEnhancer.git
cd mdEnhancer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### 1. Configure API Keys

Click the **"Add API Key"** button in the header to configure your AI provider:

1. Select your preferred provider (OpenAI, Anthropic, or Perplexity)
2. Enter your API key
3. Click "Save Configuration"

> **Privacy**: API keys are stored only in your browser's localStorage and are never sent to any server except the official API endpoints.

### 2. Write Markdown

Use the editor on the left to write your markdown content. The preview panel shows the rendered output in real-time.

### 3. Enhance with AI

**Option A: Use the AI Actions Panel**
- Select text in the editor (or leave empty to process entire document)
- Click an action in the right panel

**Option B: Use the Command Palette**
- Press `⌘K` (or `Ctrl+K` on Windows)
- Search and select an action

**Option C: Use Keyboard Shortcuts**
- Press `⌘1` through `⌘8` for quick actions

### 4. Export Your Work

Click the **Export** dropdown to download your document as:
- Markdown (.md)
- Plain Text (.txt)
- PDF (.pdf)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Open command palette |
| `⌘Z` | Undo |
| `⌘⇧Z` | Redo |
| `⌘1` | Rewrite |
| `⌘2` | Summarize |
| `⌘3` | Expand |
| `⌘4` | Bulletify |
| `⌘5` | Formalize |
| `⌘6` | Shorten |
| `⌘7` | Translate |
| `⌘8` | Fix Grammar |

## API Keys

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Navigate to API Keys
3. Create a new secret key
4. Copy and paste into MD Enhancer

### Anthropic
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Navigate to API Keys
3. Create a new key
4. Copy and paste into MD Enhancer

### Perplexity
1. Go to [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)
2. Generate an API key
3. Copy and paste into MD Enhancer

> **Note**: Perplexity's Sonar model includes web search capabilities, making it ideal for research and fact-checking tasks.

## Project Structure

```
src/
├── components/
│   ├── AIActionsMenu.tsx    # Command palette (⌘K)
│   ├── AIActionsPanel.tsx   # Right sidebar
│   ├── APIKeyModal.tsx      # API configuration
│   ├── Editor.tsx           # Monaco editor wrapper
│   ├── ExportMenu.tsx       # Export dropdown
│   ├── Preview.tsx          # Markdown preview
│   ├── StatusIndicator.tsx  # Processing states
│   ├── TemplateSelector.tsx # Note templates
│   └── ThemeToggle.tsx      # Dark/light mode
├── hooks/
│   ├── useAI.ts             # AI provider abstraction
│   ├── useHistory.ts        # Undo/redo
│   ├── useKeyboardShortcuts.ts
│   └── useLocalStorage.ts   # Persistence
├── services/
│   ├── ai/
│   │   ├── prompts.ts       # AI action prompts
│   │   └── providers.ts     # API implementations
│   └── export.ts            # Export utilities
├── types/
│   └── index.ts             # TypeScript types
├── utils/
│   ├── constants.ts         # AI actions config
│   └── templates.ts         # Note templates
├── App.tsx                  # Main application
├── main.tsx                 # Entry point
└── index.css                # Tailwind styles
```

## Privacy & Security

- **No Backend**: MD Enhancer runs entirely in your browser
- **Local Storage**: All data (content, settings, API keys) stored locally
- **Direct API Calls**: AI requests go directly to provider APIs
- **No Tracking**: No analytics or telemetry

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License — feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using React, TypeScript, and AI
