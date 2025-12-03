import { useState, useRef, useEffect } from 'react';
import { FileText, Users, Calendar, Book, GraduationCap, ChevronDown } from 'lucide-react';
import { Template } from '../types';
import { TEMPLATES } from '../utils/templates';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Calendar,
  Book,
  GraduationCap,
};

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Templates</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-surface-900 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden z-50 animate-fade-in">
          <div className="p-3 border-b border-surface-200 dark:border-surface-700">
            <h3 className="font-medium text-sm text-surface-900 dark:text-white">
              Note Templates
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">
              Start with a pre-made structure
            </p>
          </div>
          <div className="py-1">
            {TEMPLATES.map((template) => {
              const Icon = ICONS[template.icon];
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelect(template);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
                    <Icon className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div>
                    <span className="block font-medium text-sm text-surface-900 dark:text-white">
                      {template.name}
                    </span>
                    <span className="block text-xs text-surface-500 mt-0.5">
                      {template.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

