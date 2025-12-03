import { 
  RefreshCw, 
  FileText, 
  Maximize2, 
  List, 
  Briefcase, 
  Minimize2, 
  Globe, 
  Check,
  Sparkles
} from 'lucide-react';
import { AIAction, Status } from '../types';
import { AI_ACTIONS, TRANSLATE_LANGUAGES } from '../utils/constants';
import { StatusIndicator } from './StatusIndicator';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  RefreshCw,
  FileText,
  Maximize2,
  List,
  Briefcase,
  Minimize2,
  Globe,
  Check,
};

interface AIActionsPanelProps {
  onAction: (action: AIAction) => void;
  status: Status;
  disabled: boolean;
  selectedText: string;
  translateLanguage: string;
  onTranslateLanguageChange: (language: string) => void;
}

export function AIActionsPanel({
  onAction,
  status,
  disabled,
  selectedText,
  translateLanguage,
  onTranslateLanguageChange,
}: AIActionsPanelProps) {
  const hasSelection = selectedText.length > 0;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-700">
      {/* Header */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-500" />
          <h2 className="font-semibold text-surface-900 dark:text-white">AI Actions</h2>
        </div>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          {hasSelection 
            ? `${selectedText.length} characters selected`
            : 'Select text or apply to entire document'
          }
        </p>
      </div>

      {/* Status */}
      {status.type !== 'idle' && (
        <div className="px-4 pt-3">
          <StatusIndicator status={status} />
        </div>
      )}

      {/* Actions */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {AI_ACTIONS.map((action) => {
            const Icon = ICONS[action.icon];
            const isTranslate = action.id === 'translate';

            return (
              <div key={action.id}>
                <button
                  onClick={() => onAction(action.id)}
                  disabled={disabled || status.type === 'processing'}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                    transition-all duration-200
                    ${disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-800 active:scale-[0.98]'
                    }
                    ${status.type === 'processing' ? 'pointer-events-none' : ''}
                  `}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
                    <Icon className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-surface-900 dark:text-white">
                        {action.label}
                      </span>
                      {action.shortcut && (
                        <span className="text-xs text-surface-400 dark:text-surface-500 font-mono">
                          {action.shortcut}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                      {action.description}
                    </p>
                  </div>
                </button>

                {/* Language selector for translate */}
                {isTranslate && (
                  <div className="ml-11 mt-1 mb-2">
                    <select
                      value={translateLanguage}
                      onChange={(e) => onTranslateLanguageChange(e.target.value)}
                      className="w-full text-xs input py-1.5"
                      disabled={disabled}
                    >
                      {TRANSLATE_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="p-4 border-t border-surface-200 dark:border-surface-700">
        <p className="text-xs text-surface-500 dark:text-surface-400 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 font-mono">⌘K</kbd> for quick actions
        </p>
      </div>
    </div>
  );
}

