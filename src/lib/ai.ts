import { supabase } from '../lib/supabase';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  tool: string;
  input: string;
  context?: Record<string, string>;
}

export interface AIResponse {
  output: string;
  error?: string;
}

export async function callAI(req: AIRequest): Promise<AIResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: req,
    });

    if (error) {
      return { output: '', error: error.message || 'حدث خطأ' };
    }

    if (data?.error) {
      return { output: '', error: data.error };
    }

    return { output: data?.output || '' };
  } catch (err: any) {
    return { output: '', error: 'تعذّر الاتصال بالخدمة. حاول مرة أخرى.' };
  }
}

export function formatAIOutput(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h3 class="font-semibold text-lg mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-xl mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-bold text-2xl mt-4 mb-2">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br/>');
}
