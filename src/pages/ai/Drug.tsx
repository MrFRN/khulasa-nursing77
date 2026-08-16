import { Pill } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function Drug() {
  return (
    <AIToolPage
      slug="drug"
      title="معلومات الأدوية"
      description="جرعات، تداخلات، أعراض جانبية، وموانع استعمال"
      icon={<Pill className="h-6 w-6" />}
      inputLabel="اسم الدواء أو سؤالك"
      inputPlaceholder="مثال: Metformin، Warfarin، Amoxicillin"
      inputType="text"
      examples={[
        'Metformin',
        'Warfarin تداخلات',
        'Amoxicillin جرعة أطفال',
        'Furosemide أعراض جانبية',
      ]}
    />
  );
}
