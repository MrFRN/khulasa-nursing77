import { FileText } from 'lucide-react';
import Browse from '../components/Browse';

export default function Study() {
  return (
    <Browse
      section="study"
      title="ملفات دراسية"
      subtitle="الفرقة الأولى · الثانية · الثالثة · الرابعة"
      icon={<FileText className="h-6 w-6" />}
    />
  );
}
