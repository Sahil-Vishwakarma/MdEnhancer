import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewProps {
  content: string;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ content }, ref) => {
  return (
    <div 
      ref={ref}
      className="h-full overflow-auto p-6 prose-custom"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom component overrides for better styling
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-surface-900 dark:text-white first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-surface-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-surface-900 dark:text-white">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-4 leading-relaxed text-surface-700 dark:text-surface-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 pl-6 list-disc text-surface-700 dark:text-surface-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 pl-6 list-decimal text-surface-700 dark:text-surface-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="my-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 pl-4 border-l-4 border-accent-500 italic text-surface-600 dark:text-surface-400">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-accent-600 dark:text-accent-400" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} block`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 p-4 rounded-lg bg-surface-900 dark:bg-surface-950 overflow-x-auto text-surface-100 font-mono text-sm">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-600 dark:text-accent-400 underline underline-offset-2 hover:text-accent-700 dark:hover:text-accent-300"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-8 border-surface-200 dark:border-surface-700" />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border border-surface-200 dark:border-surface-700">
              {children}
            </td>
          ),
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="my-4 rounded-lg max-w-full"
              loading="lazy"
            />
          ),
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input 
                  type="checkbox" 
                  checked={checked} 
                  readOnly 
                  className="mr-2 accent-accent-600"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

Preview.displayName = 'Preview';

