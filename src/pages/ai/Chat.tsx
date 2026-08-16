import { MessageSquare } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function Chat() {
  return (
    <AIToolPage
      slug="chat"
      title="محادثة طبية"
      description="اسأل أي سؤال طبي أو تمريضي"
      icon={<MessageSquare className="h-6 w-6" />}
      inputLabel="سؤالك"
      inputPlaceholder="اكتب سؤالك الطبي هنا..."
      examples={[
        'ما الفرق بين Systolic و Diastolic؟',
        'شرح أنواع الصدمات (Shock)',
        'متى أستخدم oxygen mask vs nasal cannula؟',
      ]}
    />
  );
}
