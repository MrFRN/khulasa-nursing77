import { FileSearch } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function CaseAnalysis() {
  return (
    <AIToolPage
      slug="case"
      title="تحليل حالة سريرية"
      description="تشخيص تفريقي مرتّب، خطة علاج، ورعاية تمريضية"
      icon={<FileSearch className="h-6 w-6" />}
      inputLabel="وصف الحالة السريرية"
      inputPlaceholder="أدخل الأعراض، العلامات الحيوية، التاريخ المرضي، نتائج الفحوصات..."
      examples={[
        'مريض 45 سنة، ألم صدر ضاغق، ضغط 160/95، تعرق',
        'طفل 3 سنوات، حرارة 39.5، طفح جلدي، خمول',
        'امرأة 60، ضيق تنفس، وذمة في الساقين، وزيادة وزن 3 كجم',
      ]}
    />
  );
}
