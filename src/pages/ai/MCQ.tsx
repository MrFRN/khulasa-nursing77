import { Circle as HelpCircle } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function MCQ() {
  return (
    <AIToolPage
      slug="mcq"
      title="أسئلة اختيار من متعدد"
      description="تدريب على أسئلة طبية مع شرح الإجابات"
      icon={<HelpCircle className="h-6 w-6" />}
      inputLabel="الموضوع أو التخصص"
      inputPlaceholder="مثال: أسئلة على pharmacology - antibiotics"
      examples={[
        'أسئلة على أدوية القلب',
        'MCQ على التمريض الباطني',
        'أسئلة anatomy الجهاز التنفسي',
        'أسئلة emergency nursing',
      ]}
    />
  );
}
