interface PromptConfig {
  system: string;
  user: string;
}

export async function callOpenAI(
  apiKey: string,
  prompt: PromptConfig,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function callAnthropic(
  apiKey: string,
  prompt: PromptConfig,
  signal?: AbortSignal
): Promise<string> {
  // Note: Anthropic API requires CORS to be handled, which typically requires a proxy
  // For direct browser usage, users may need to use a CORS proxy or browser extension
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      system: prompt.system,
      messages: [
        { role: 'user', content: prompt.user },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

export async function callPerplexity(
  apiKey: string,
  prompt: PromptConfig,
  signal?: AbortSignal
): Promise<string> {
  // Perplexity API uses OpenAI-compatible format
  // Using 'sonar' model - lightweight search model with web grounding
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

