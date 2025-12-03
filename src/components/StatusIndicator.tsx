import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Status } from '../types';

interface StatusIndicatorProps {
  status: Status;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status.type === 'idle') {
    return null;
  }

  const configs = {
    processing: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    success: {
      icon: <Check className="w-4 h-4" />,
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
    },
  };

  const config = configs[status.type];

  return (
    <div 
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm
        ${config.bg} ${config.text} ${config.border}
        animate-fade-in
      `}
    >
      {config.icon}
      <span>{status.message}</span>
    </div>
  );
}

