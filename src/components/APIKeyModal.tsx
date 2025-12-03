import { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { AIProvider, APIKeys } from '../types';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: APIKeys;
  onSave: (keys: APIKeys) => void;
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

export function APIKeyModal({
  isOpen,
  onClose,
  apiKeys,
  onSave,
  selectedProvider,
  onProviderChange,
}: APIKeyModalProps) {
  const [keys, setKeys] = useState<APIKeys>(apiKeys);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showPerplexity, setShowPerplexity] = useState(false);

  useEffect(() => {
    setKeys(apiKeys);
  }, [apiKeys, isOpen]);

  const handleSave = () => {
    onSave(keys);
    onClose();
  };

  if (!isOpen) return null;

  const providers: { id: AIProvider; label: string }[] = [
    { id: 'openai', label: 'OpenAI' },
    { id: 'anthropic', label: 'Anthropic' },
    { id: 'perplexity', label: 'Perplexity' },
  ];

  return (
    <div className="command-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-md animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-900/30">
                <Key className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h2 className="font-semibold text-surface-900 dark:text-white">API Configuration</h2>
                <p className="text-xs text-surface-500">Configure your AI provider keys</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Active Provider
              </label>
              <div className="flex gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => onProviderChange(provider.id)}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-all text-sm ${
                      selectedProvider === provider.id
                        ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300'
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800'
                    }`}
                  >
                    {provider.label}
                  </button>
                ))}
              </div>
            </div>

            {/* OpenAI Key */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showOpenAI ? 'text' : 'password'}
                  value={keys.openai}
                  onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                  placeholder="sk-..."
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAI(!showOpenAI)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showOpenAI ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Anthropic Key */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Anthropic API Key
              </label>
              <div className="relative">
                <input
                  type={showAnthropic ? 'text' : 'password'}
                  value={keys.anthropic}
                  onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
                  placeholder="sk-ant-..."
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropic(!showAnthropic)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showAnthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Perplexity Key */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <span className="flex items-center gap-2">
                  Perplexity API Key
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Online Search
                  </span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPerplexity ? 'text' : 'password'}
                  value={keys.perplexity}
                  onChange={(e) => setKeys({ ...keys, perplexity: e.target.value })}
                  placeholder="pplx-..."
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPerplexity(!showPerplexity)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPerplexity ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-surface-500">
                Perplexity can search the web for up-to-date information
              </p>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Your keys are stored locally</p>
                <p className="mt-1 text-amber-700 dark:text-amber-300 text-xs">
                  API keys are saved only in your browser's local storage and are never sent to any server except the official API endpoints.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
