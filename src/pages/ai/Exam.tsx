import { GraduationCap } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function Exam() {
  return (
    <AIToolPage
      slug="exam"
      title="امتحان تجريبي"
      description="اختبار شامل مع تصحيح وتفسير"
      icon={<GraduationCap className="h-6 w-6" />}
      inputLabel="موضوع الامتحان أو عدد الأسئلة"
      inputPlaceholder="مثال: امتحان تمريض باطني، 10 أسئلة"
      examples={[
        'امتحان تمريض باطني 10 أسئلة',
        'اختبار pharmacology 5 أسئلة',
        'امتحان emergency nursing',
        'NCLEX-style 10 أسئلة mixed',
      ]}
    />
  );
}
