import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const themes: { value: Theme; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-100 dark:bg-surface-800">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          title={label}
          className={`
            p-2 rounded-md transition-all
            ${theme === value
              ? 'bg-white dark:bg-surface-700 text-accent-600 dark:text-accent-400 shadow-sm'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }
          `}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

