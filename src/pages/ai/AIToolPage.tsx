import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ArrowRight, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';
import { callAI, formatAIOutput, type AIMessage } from '../../lib/ai';
import { trackEvent } from '../../lib/api';

interface AIToolPageProps {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  inputLabel: string;
  inputPlaceholder: string;
  inputType?: 'text' | 'textarea';
  examples?: string[];
  contextFields?: { key: string; label: string; placeholder: string; options?: string[] }[];
  buttonText?: string;
}

export default function AIToolPage({
  slug,
  title,
  description,
  icon,
  inputLabel,
  inputPlaceholder,
  inputType = 'textarea',
  examples = [],
  contextFields = [],
  buttonText = 'تشغيل',
}: AIToolPageProps) {
  const [input, setInput] = useState('');
  const [context, setContext] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent('visit', undefined, `/ai-assistant/${slug}`);
  }, [slug]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: AIMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    const { output, error: aiError } = await callAI({
      tool: slug,
      input,
      context,
    });

    setLoading(false);

    if (aiError) {
      setError(aiError);
    } else if (output) {
      setMessages((prev) => [...prev, { role: 'assistant', content: output }]);
    }
    setInput('');
  };

  const handleExample = (example: string) => {
    setInput(example);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/ai-assistant"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-primary-600 mb-4"
        >
          <ArrowRight className="h-4 w-4 rtl-flip" />
          المساعد الذكي
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4">
            {contextFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {field.label}
                </label>
                {field.options ? (
                  <select
                    value={context[field.key] || ''}
                    onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">— اختر —</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={context[field.key] || ''}
                    onChange={(e) => setContext({ ...context, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                {inputLabel}
              </label>
              {inputType === 'textarea' ? (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={inputPlaceholder}
                  rows={6}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              ) : (
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}
            </div>

            {examples.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => handleExample(ex)}
                    className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs text-neutral-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جارٍ المعالجة...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 rtl-flip" />
                  {buttonText}
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 px-4 py-3 text-sm text-error-600 dark:text-error-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Output panel */}
        <div ref={outputRef} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-20">
              <Sparkles className="h-12 w-12 text-neutral-200 dark:text-neutral-700 mb-3" />
              <p className="text-neutral-400">اكتب مدخلاتك وستظهر النتيجة هنا</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/30'
                        : 'bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                      {msg.role === 'user' ? 'أنت' : 'المساعد'}
                    </div>
                    {msg.role === 'assistant' ? (
                      <div
                        className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed [&_li]:ml-4 [&_li]:list-disc [&_h2]:font-bold [&_h2]:text-lg [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1"
                        dangerouslySetInnerHTML={{ __html: `<p class="mb-2">${formatAIOutput(msg.content)}</p>` }}
                      />
                    ) : (
                      <p className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-neutral-400 px-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارٍ إنشاء الرد...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
