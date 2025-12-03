import { useEffect, useRef, useState } from 'react';
import { 
  RefreshCw, 
  FileText, 
  Maximize2, 
  List, 
  Briefcase, 
  Minimize2, 
  Globe, 
  Check,
  X,
  Search
} from 'lucide-react';
import { AIAction } from '../types';
import { AI_ACTIONS } from '../utils/constants';

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

interface AIActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: AIAction) => void;
}

export function AIActionsMenu({ isOpen, onClose, onAction }: AIActionsMenuProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredActions = AI_ACTIONS.filter(
    (action) =>
      action.label.toLowerCase().includes(search.toLowerCase()) ||
      action.description.toLowerCase().includes(search.toLowerCase())
  );

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % filteredActions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + filteredActions.length) % filteredActions.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            onAction(filteredActions[selectedIndex].id);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onAction, onClose]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="command-overlay animate-fade-in" onClick={onClose}>
      <div 
        ref={menuRef}
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
            <Search className="w-5 h-5 text-surface-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search AI actions..."
              className="flex-1 bg-transparent border-none outline-none text-surface-900 dark:text-white placeholder:text-surface-400"
            />
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <X className="w-4 h-4 text-surface-500" />
            </button>
          </div>

          {/* Actions list */}
          <div className="max-h-80 overflow-auto py-2">
            {filteredActions.length === 0 ? (
              <div className="px-4 py-8 text-center text-surface-500 dark:text-surface-400">
                No actions found
              </div>
            ) : (
              filteredActions.map((action, index) => {
                const Icon = ICONS[action.icon];
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      onAction(action.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left
                      transition-colors duration-100
                      ${isSelected 
                        ? 'bg-accent-50 dark:bg-accent-900/20' 
                        : 'hover:bg-surface-50 dark:hover:bg-surface-800'
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                      ${isSelected 
                        ? 'bg-accent-100 dark:bg-accent-900/30' 
                        : 'bg-surface-100 dark:bg-surface-800'
                      }
                    `}>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-accent-600' : 'text-surface-600 dark:text-surface-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium text-sm ${isSelected ? 'text-accent-700 dark:text-accent-300' : 'text-surface-900 dark:text-white'}`}>
                          {action.label}
                        </span>
                        {action.shortcut && (
                          <span className="text-xs text-surface-400 font-mono">
                            {action.shortcut}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
            <div className="flex items-center justify-between text-xs text-surface-500">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1 rounded bg-surface-200 dark:bg-surface-700">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1 rounded bg-surface-200 dark:bg-surface-700">↵</kbd> Select</span>
              </div>
              <span><kbd className="px-1 rounded bg-surface-200 dark:bg-surface-700">Esc</kbd> Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

