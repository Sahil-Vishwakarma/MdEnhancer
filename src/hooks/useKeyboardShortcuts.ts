import { useEffect, useCallback } from 'react';

type ShortcutHandler = () => void;

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: ShortcutHandler;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[], enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    for (const shortcut of shortcuts) {
      const metaOrCtrl = shortcut.meta || shortcut.ctrl;
      const matchesMeta = metaOrCtrl ? (event.metaKey || event.ctrlKey) : true;
      const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = shortcut.alt ? event.altKey : !event.altKey;
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (matchesMeta && matchesShift && matchesAlt && matchesKey) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.handler();
        return;
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

