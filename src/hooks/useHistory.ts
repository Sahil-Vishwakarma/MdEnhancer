import { useState, useCallback, useRef } from 'react';
import { HistoryEntry } from '../types';

const MAX_HISTORY_SIZE = 100;

export function useHistory(initialContent: string) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { content: initialContent, timestamp: Date.now() }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastPushTime = useRef(Date.now());

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const push = useCallback((content: string) => {
    const now = Date.now();
    // Debounce: don't push if content is same or too soon (less than 500ms)
    if (
      history[currentIndex]?.content === content ||
      now - lastPushTime.current < 500
    ) {
      return;
    }

    lastPushTime.current = now;

    setHistory(prev => {
      // Remove any future history (if we undid and are now making a new change)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ content, timestamp: now });
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });

    setCurrentIndex(prev => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
  }, [currentIndex, history]);

  const undo = useCallback((): string | null => {
    if (!canUndo) return null;
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex].content;
  }, [canUndo, currentIndex, history]);

  const redo = useCallback((): string | null => {
    if (!canRedo) return null;
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex].content;
  }, [canRedo, currentIndex, history]);

  const reset = useCallback((content: string) => {
    setHistory([{ content, timestamp: Date.now() }]);
    setCurrentIndex(0);
  }, []);

  return {
    push,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    currentContent: history[currentIndex]?.content ?? initialContent,
  };
}

