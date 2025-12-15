import { useRef, useEffect, useState, useCallback } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizableSplitterProps {
  onResize: (ratio: number) => void;
  minLeft?: number;
  minRight?: number;
}

export function ResizableSplitter({ 
  onResize, 
  minLeft = 200,
  minRight = 200 
}: ResizableSplitterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const splitterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const container = splitterRef.current?.parentElement;
    containerRef.current = container || null;
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      
      // Calculate new ratio (0 to 1, where 1 means editor takes full width)
      const newRatio = Math.max(0, Math.min(1, mouseX / containerWidth));
      
      // Apply min constraints
      const editorWidth = newRatio * containerWidth;
      const previewWidth = (1 - newRatio) * containerWidth;
      
      if (editorWidth >= minLeft && previewWidth >= minRight) {
        onResize(newRatio);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      containerRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize, minLeft, minRight]);

  return (
    <div
      ref={splitterRef}
      onMouseDown={handleMouseDown}
      className={`
        w-1 flex-shrink-0 cursor-col-resize bg-surface-200 dark:bg-surface-700
        hover:bg-surface-300 dark:hover:bg-surface-600
        transition-colors relative group
        ${isDragging ? 'bg-accent-500 dark:bg-accent-500' : ''}
      `}
      style={{ userSelect: 'none' }}
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-surface-500 dark:text-surface-400" />
      </div>
    </div>
  );
}

