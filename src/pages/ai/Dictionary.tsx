import { BookMarked } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function Dictionary() {
  return (
    <AIToolPage
      slug="dictionary"
      title="قاموس طبي"
      description="ابحث عن المصطلحات الطبية وتعريفاتها"
      icon={<BookMarked className="h-6 w-6" />}
      inputLabel="المصطلح أو الكلمة"
      inputPlaceholder="مثال: Hypoxia, Bradycardia, Ischemia"
      inputType="text"
      examples={['Hypoxia', 'Bradycardia', 'Ischemia', 'Anaphylaxis', 'Sepsis']}
    />
  );
}
