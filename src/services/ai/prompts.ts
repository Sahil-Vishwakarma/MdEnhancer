import { AIAction } from '../../types';

const SYSTEM_PROMPT = `You are a helpful writing assistant that enhances markdown content. 
Your responses should:
- Preserve markdown formatting where appropriate
- Be clear and well-structured
- Maintain the original meaning while improving the content
- Return ONLY the enhanced text without any explanations or meta-commentary`;

const ACTION_PROMPTS: Record<AIAction, (text: string, lang?: string) => string> = {
  rewrite: (text) => `Rewrite the following text to improve clarity, flow, and readability while maintaining the original meaning and any markdown formatting:

${text}`,

  summarize: (text) => `Create a concise summary of the following text, capturing the key points in a clear and organized manner. Use markdown formatting if appropriate:

${text}`,

  expand: (text) => `Expand on the following text by adding more detail, examples, and depth while maintaining the original tone and structure. Preserve any markdown formatting:

${text}`,

  bulletify: (text) => `Convert the following text into a well-organized bullet point list. Group related items and use proper markdown list formatting:

${text}`,

  formalize: (text) => `Rewrite the following text in a more professional, formal tone suitable for business or academic contexts. Maintain any markdown formatting:

${text}`,

  shorten: (text) => `Make the following text more concise while preserving the key information and meaning. Remove unnecessary words and redundancies:

${text}`,

  translate: (text, language) => `Translate the following text to ${language}. Preserve any markdown formatting and maintain the original structure:

${text}`,

  'fix-grammar': (text) => `Fix any grammar, spelling, and punctuation errors in the following text. Make minimal changes to preserve the original style and voice:

${text}`,
};

export function getPromptForAction(action: AIAction, text: string, translateLanguage?: string): { system: string; user: string } {
  const userPrompt = ACTION_PROMPTS[action](text, translateLanguage);
  
  return {
    system: SYSTEM_PROMPT,
    user: userPrompt,
  };
}

