import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ClipboardList, Calculator, FileSearch, Circle as HelpCircle, MessageSquare, FileText, BookMarked, Activity, FlaskConical, Pill, GraduationCap, ArrowLeft } from 'lucide-react';

const tools = [
  { slug: 'care-plan', label: 'خطة الرعاية التمريضية', desc: 'توليد خطط رعاية بناءً على الحالة', icon: ClipboardList, color: 'from-primary-500 to-primary-700' },
  { slug: 'calculator', label: 'حاسبات تمريضية', desc: 'حساب الجرعات، الترشيح، BMI', icon: Calculator, color: 'from-secondary-500 to-secondary-700' },
  { slug: 'case', label: 'تحليل حالة سريرية', desc: 'تشخيص تفريقي وخطة علاج', icon: FileSearch, color: 'from-accent-500 to-accent-700' },
  { slug: 'mcq', label: 'أسئلة اختيار من متعدد', desc: 'تدريب على الأسئلة الطبية', icon: HelpCircle, color: 'from-primary-500 to-secondary-500' },
  { slug: 'interview', label: 'تدريب الانترفيو', desc: 'أسئلة وحالة شغل', icon: MessageSquare, color: 'from-secondary-600 to-primary-600' },
  { slug: 'pdf', label: 'محادثة PDF', desc: 'اسأل عن محتوى ملف PDF', icon: FileText, color: 'from-accent-500 to-warning-500' },
  { slug: 'chat', label: 'محادثة طبية', desc: 'اسأل أي سؤال طبي', icon: MessageSquare, color: 'from-primary-600 to-accent-500' },
  { slug: 'dictionary', label: 'قاموس طبي', desc: 'مصطلحات وتعريفات', icon: BookMarked, color: 'from-secondary-500 to-primary-500' },
  { slug: 'ecg', label: 'تحليل تخطيط القلب', desc: 'تفسير ECG', icon: Activity, color: 'from-error-500 to-accent-600' },
  { slug: 'lab', label: 'تفسير التحاليل', desc: 'CBC، CMP، تحاليل مخبرية', icon: FlaskConical, color: 'from-primary-500 to-secondary-600' },
  { slug: 'drug', label: 'معلومات الأدوية', desc: 'جرعات، تداخلات، أعراض جانبية', icon: Pill, color: 'from-secondary-600 to-accent-500' },
  { slug: 'exam', label: 'امتحان تجريبي', desc: 'اختبار شامل مع تصحيح', icon: GraduationCap, color: 'from-primary-600 to-secondary-600' },
];

export default function AIAssistant() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white mb-4">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
          المساعد الذكي للتمريض
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          مجموعة أدوات ذكية لمساعدة طلاب وممارسين التمريض في التحليل السريري، الحسابات، والمراجعة
        </p>
      </motion.div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
          >
            <Link
              to={`/ai-assistant/${tool.slug}`}
              className="card-lift group block rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                {tool.label}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {tool.desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                ابدأ
                <ArrowLeft className="h-4 w-4 rtl-flip" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 rounded-2xl border border-warning-200 dark:border-warning-800/50 bg-warning-50 dark:bg-warning-900/10 p-4">
        <p className="text-sm text-warning-700 dark:text-warning-400">
          هذه الأدوات لأغراض تعليمية فقط ولا تغني عن الاستشارة الطبية المتخصصة.
        </p>
      </div>
    </div>
  );
}
