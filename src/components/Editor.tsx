import { useRef, useCallback } from 'react';
import MonacoEditor, { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange?: (selection: string) => void;
  theme: 'light' | 'dark';
}

export function Editor({ value, onChange, onSelectionChange, theme }: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    
    // Listen for selection changes
    editor.onDidChangeCursorSelection(() => {
      const selection = editor.getSelection();
      if (selection && onSelectionChange) {
        const selectedText = editor.getModel()?.getValueInRange(selection) || '';
        onSelectionChange(selectedText);
      }
    });

    // Focus the editor
    editor.focus();
  }, [onSelectionChange]);

  const handleChange: OnChange = useCallback((newValue) => {
    onChange(newValue || '');
  }, [onChange]);

  // Function to replace selected text or all content
  const replaceSelection = useCallback((newText: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    if (selection && !selection.isEmpty()) {
      editor.executeEdits('ai-replace', [{
        range: selection,
        text: newText,
      }]);
    } else {
      // Replace all content if nothing selected
      const fullRange = editor.getModel()?.getFullModelRange();
      if (fullRange) {
        editor.executeEdits('ai-replace', [{
          range: fullRange,
          text: newText,
        }]);
      }
    }
  }, []);

  // Expose replaceSelection through a custom event
  const getEditorAPI = useCallback(() => ({
    replaceSelection,
    getSelectedText: () => {
      const editor = editorRef.current;
      if (!editor) return '';
      const selection = editor.getSelection();
      if (selection) {
        return editor.getModel()?.getValueInRange(selection) || '';
      }
      return '';
    },
    getAllText: () => editorRef.current?.getValue() || '',
    focus: () => editorRef.current?.focus(),
  }), [replaceSelection]);

  // Store API in window for access from parent
  if (typeof window !== 'undefined') {
    (window as unknown as { editorAPI: ReturnType<typeof getEditorAPI> }).editorAPI = getEditorAPI();
  }

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language="markdown"
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on',
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          tabSize: 2,
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
          },
        }}
      />
    </div>
  );
}

