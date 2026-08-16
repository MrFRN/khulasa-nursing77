import { MessageSquare } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function InterviewPrep() {
  return (
    <AIToolPage
      slug="interview"
      title="تدريب الانترفيو"
      description="أسئلة انترفيو تمريض مع إجابات نموذجية"
      icon={<MessageSquare className="h-6 w-6" />}
      inputLabel="نوع الانترفيو / القسم"
      inputPlaceholder="مثال: انترفيو ICU، أسئلة HR، سيناريو طارئ"
      examples={[
        'أسئلة انترفيو ICU',
        'أسئلة سلوكية HR',
        'سيناريو: مريض يعاني من توقف القلب',
        'أسئلة انترفيو قسم الطوارئ',
      ]}
    />
  );
}
