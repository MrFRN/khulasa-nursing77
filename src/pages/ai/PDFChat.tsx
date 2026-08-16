import { FileText } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function PDFChat() {
  return (
    <AIToolPage
      slug="pdf"
      title="محادثة PDF"
      description="ارفع ملف PDF واطرح أسئلة حول محتواه"
      icon={<FileText className="h-6 w-6" />}
      inputLabel="سؤالك عن الملف"
      inputPlaceholder="مثال: لخّص الفصل الأول، ما هي جرعة الدواء المذكورة؟"
      examples={['لخّص المحتوى', 'ما هي النقاط الرئيسية؟', 'استخرج الجرعات المذكورة']}
    />
  );
}
