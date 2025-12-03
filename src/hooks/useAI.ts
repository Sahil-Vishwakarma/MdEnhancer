import { useState, useCallback } from 'react';
import { AIAction, AIProvider, Status } from '../types';
import { callOpenAI, callAnthropic, callPerplexity } from '../services/ai/providers';
import { getPromptForAction } from '../services/ai/prompts';

interface UseAIOptions {
  provider: AIProvider;
  apiKey: string;
  translateLanguage?: string;
}

interface UseAIReturn {
  processText: (text: string, action: AIAction) => Promise<string>;
  status: Status;
  cancelRequest: () => void;
}

export function useAI({ provider, apiKey, translateLanguage = 'Spanish' }: UseAIOptions): UseAIReturn {
  const [status, setStatus] = useState<Status>({ type: 'idle' });
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const cancelRequest = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setStatus({ type: 'idle' });
    }
  }, [abortController]);

  const processText = useCallback(async (text: string, action: AIAction): Promise<string> => {
    if (!apiKey) {
      setStatus({ type: 'error', message: 'API key not configured' });
      throw new Error('API key not configured');
    }

    if (!text.trim()) {
      setStatus({ type: 'error', message: 'No text provided' });
      throw new Error('No text provided');
    }

    const controller = new AbortController();
    setAbortController(controller);
    setStatus({ type: 'processing', message: `Running ${action}...` });

    try {
      const prompt = getPromptForAction(action, text, translateLanguage);
      
      let result: string;
      
      if (provider === 'openai') {
        result = await callOpenAI(apiKey, prompt, controller.signal);
      } else if (provider === 'anthropic') {
        result = await callAnthropic(apiKey, prompt, controller.signal);
      } else {
        result = await callPerplexity(apiKey, prompt, controller.signal);
      }

      setStatus({ type: 'success', message: 'Done!' });
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setStatus({ type: 'idle' });
      }, 2000);

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setStatus({ type: 'idle' });
        throw error;
      }
      
      const message = error instanceof Error ? error.message : 'An error occurred';
      setStatus({ type: 'error', message });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus({ type: 'idle' });
      }, 3000);

      throw error;
    } finally {
      setAbortController(null);
    }
  }, [apiKey, provider, translateLanguage]);

  return { processText, status, cancelRequest };
}

