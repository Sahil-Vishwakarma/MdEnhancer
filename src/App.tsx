import { useState, useEffect, useRef, useCallback } from 'react';
import { Key, Undo2, Redo2, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { AIActionsPanel } from './components/AIActionsPanel';
import { AIActionsMenu } from './components/AIActionsMenu';
import { APIKeyModal } from './components/APIKeyModal';
import { ExportMenu } from './components/ExportMenu';
import { TemplateSelector } from './components/TemplateSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { ResizableSplitter } from './components/ResizableSplitter';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHistory } from './hooks/useHistory';
import { useAI } from './hooks/useAI';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { downloadAsMarkdown, downloadAsText, downloadAsPDF } from './services/export';
import { DEFAULT_CONTENT } from './utils/constants';
import { AIAction, AIProvider, APIKeys, Template } from './types';

type ThemeSetting = 'light' | 'dark' | 'system';

function App() {
  // Local storage state
  const [content, setContent] = useLocalStorage('md-enhancer-content', DEFAULT_CONTENT);
  const [apiKeys, setApiKeys] = useLocalStorage<APIKeys>('md-enhancer-api-keys', { openai: '', anthropic: '', perplexity: '' });
  const [provider, setProvider] = useLocalStorage<AIProvider>('md-enhancer-provider', 'openai');
  const [themeSetting, setThemeSetting] = useLocalStorage<ThemeSetting>('md-enhancer-theme', 'system');
  const [translateLanguage, setTranslateLanguage] = useLocalStorage('md-enhancer-translate-lang', 'Spanish');
  const [splitRatio, setSplitRatio] = useLocalStorage<number>('md-enhancer-split-ratio', 0.67);

  // UI state
  const [selectedText, setSelectedText] = useState('');
  const [isAPIKeyModalOpen, setIsAPIKeyModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);

  // Refs
  const previewRef = useRef<HTMLDivElement>(null);

  // History for undo/redo
  const { push: pushHistory, undo, redo, canUndo, canRedo } = useHistory(content);

  // Determine actual theme
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const updateTheme = () => {
      if (themeSetting === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(prefersDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(themeSetting);
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [themeSetting]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  // AI hook
  const currentApiKey = provider === 'openai' 
    ? apiKeys.openai 
    : provider === 'anthropic' 
      ? apiKeys.anthropic 
      : apiKeys.perplexity;
  const { processText, status } = useAI({
    provider,
    apiKey: currentApiKey,
    translateLanguage,
  });

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    pushHistory(newContent);
  }, [setContent, pushHistory]);

  // Handle undo
  const handleUndo = useCallback(() => {
    const previousContent = undo();
    if (previousContent !== null) {
      setContent(previousContent);
    }
  }, [undo, setContent]);

  // Handle redo
  const handleRedo = useCallback(() => {
    const nextContent = redo();
    if (nextContent !== null) {
      setContent(nextContent);
    }
  }, [redo, setContent]);

  // Handle AI action
  const handleAIAction = useCallback(async (action: AIAction) => {
    const textToProcess = selectedText || content;
    
    try {
      const result = await processText(textToProcess, action);
      
      // Get editor API and replace content
      const editorAPI = (window as unknown as { editorAPI: { replaceSelection: (text: string) => void } }).editorAPI;
      if (editorAPI && selectedText) {
        editorAPI.replaceSelection(result);
      } else {
        handleContentChange(result);
      }
    } catch (error) {
      // Error is already handled in useAI hook
      console.error('AI action failed:', error);
    }
  }, [selectedText, content, processText, handleContentChange]);

  // Handle template selection
  const handleTemplateSelect = useCallback((template: Template) => {
    handleContentChange(template.content);
  }, [handleContentChange]);

  // Export handlers
  const handleExportMarkdown = useCallback(() => {
    downloadAsMarkdown(content, 'document.md');
  }, [content]);

  const handleExportText = useCallback(() => {
    downloadAsText(content, 'document.txt');
  }, [content]);

  const handleExportPDF = useCallback(async () => {
    if (previewRef.current) {
      await downloadAsPDF(previewRef.current, 'document.pdf');
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'k', meta: true, handler: () => setIsCommandMenuOpen(true) },
    { key: 'z', meta: true, handler: handleUndo },
    { key: 'z', meta: true, shift: true, handler: handleRedo },
    { key: '1', meta: true, handler: () => handleAIAction('rewrite') },
    { key: '2', meta: true, handler: () => handleAIAction('summarize') },
    { key: '3', meta: true, handler: () => handleAIAction('expand') },
    { key: '4', meta: true, handler: () => handleAIAction('bulletify') },
    { key: '5', meta: true, handler: () => handleAIAction('formalize') },
    { key: '6', meta: true, handler: () => handleAIAction('shorten') },
    { key: '7', meta: true, handler: () => handleAIAction('translate') },
    { key: '8', meta: true, handler: () => handleAIAction('fix-grammar') },
  ], !isAPIKeyModalOpen);

  const hasApiKey = currentApiKey.length > 0;

  return (
    <div className="h-screen flex flex-col bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-surface-900 dark:text-white hidden sm:inline">
              MD Enhancer
            </span>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-surface-200 dark:bg-surface-700 hidden sm:block" />

          {/* Templates */}
          <TemplateSelector onSelect={handleTemplateSelect} />
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="btn btn-ghost p-2"
              title="Undo (⌘Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="btn btn-ghost p-2"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-surface-200 dark:bg-surface-700" />

          {/* Panel toggles */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`btn btn-ghost p-2 ${!showPreview ? 'text-surface-400' : ''}`}
            title="Toggle Preview"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className={`btn btn-ghost p-2 ${!showAIPanel ? 'text-surface-400' : ''}`}
            title="Toggle AI Panel"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-surface-200 dark:bg-surface-700" />

          {/* Export */}
          <ExportMenu
            onExportMarkdown={handleExportMarkdown}
            onExportText={handleExportText}
            onExportPDF={handleExportPDF}
          />

          {/* API Key */}
          <button
            onClick={() => setIsAPIKeyModalOpen(true)}
            className={`btn ${hasApiKey ? 'btn-ghost' : 'btn-primary'}`}
            title="Configure API Keys"
          >
            <Key className="w-4 h-4" />
            {!hasApiKey && <span className="hidden sm:inline">Add API Key</span>}
          </button>

          {/* Theme Toggle */}
          <ThemeToggle theme={themeSetting} onChange={setThemeSetting} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div 
          className={`min-w-0 ${!showPreview && !showAIPanel ? 'w-full' : ''}`}
          style={showPreview ? { width: `${splitRatio * 100}%` } : undefined}
        >
          <Editor
            value={content}
            onChange={handleContentChange}
            onSelectionChange={setSelectedText}
            theme={resolvedTheme}
          />
        </div>

        {/* Resizable Splitter */}
        {showPreview && (
          <ResizableSplitter
            onResize={setSplitRatio}
            minLeft={200}
            minRight={300}
          />
        )}

        {/* Preview Panel */}
        {showPreview && (
          <div 
            className="min-w-[300px] border-l border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 overflow-hidden"
            style={{ width: `${(1 - splitRatio) * 100}%` }}
          >
            <Preview ref={previewRef} content={content} />
          </div>
        )}

        {/* AI Actions Panel */}
        {showAIPanel && (
          <div className="w-72 flex-shrink-0">
            <AIActionsPanel
              onAction={handleAIAction}
              status={status}
              disabled={!hasApiKey}
              selectedText={selectedText}
              translateLanguage={translateLanguage}
              onTranslateLanguageChange={setTranslateLanguage}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <APIKeyModal
        isOpen={isAPIKeyModalOpen}
        onClose={() => setIsAPIKeyModalOpen(false)}
        apiKeys={apiKeys}
        onSave={setApiKeys}
        selectedProvider={provider}
        onProviderChange={setProvider}
      />

      <AIActionsMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onAction={handleAIAction}
      />
    </div>
  );
}

export default App;

