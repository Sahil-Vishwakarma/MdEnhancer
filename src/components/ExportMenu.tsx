import { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileType, FileImage, File, ChevronDown } from 'lucide-react';

interface ExportMenuProps {
  onExportMarkdown: () => void;
  onExportText: () => void;
  onExportPDF: () => void;
  onExportDocx: () => void;
}

export function ExportMenu({ onExportMarkdown, onExportText, onExportPDF, onExportDocx }: ExportMenuProps) {
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

  const exportOptions = [
    {
      label: 'Markdown (.md)',
      icon: FileText,
      onClick: () => {
        onExportMarkdown();
        setIsOpen(false);
      },
    },
    {
      label: 'Plain Text (.txt)',
      icon: FileType,
      onClick: () => {
        onExportText();
        setIsOpen(false);
      },
    },
    {
      label: 'PDF Document (.pdf)',
      icon: FileImage,
      onClick: () => {
        onExportPDF();
        setIsOpen(false);
      },
    },
    {
      label: 'Word Document (.docx)',
      icon: File,
      onClick: () => {
        onExportDocx();
        setIsOpen(false);
      },
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-900 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 overflow-hidden z-50 animate-fade-in">
          <div className="py-1">
            {exportOptions.map((option) => (
              <button
                key={option.label}
                onClick={option.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <option.icon className="w-4 h-4 text-surface-500" />
                <span className="text-sm text-surface-700 dark:text-surface-300">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
