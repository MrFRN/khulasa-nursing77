import { ClipboardList } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function CarePlan() {
  return (
    <AIToolPage
      slug="care-plan"
      title="خطة الرعاية التمريضية"
      description="ولّد خطة رعاية تمريضية متكاملة بناءً على تشخيص المريض"
      icon={<ClipboardList className="h-6 w-6" />}
      inputLabel="التشخيص الطبي / حالة المريض"
      inputPlaceholder="مثال: مريض السكري من النوع الثاني مع قرحة في القدم..."
      examples={['مريض سكري نوع الثاني مع قرحة قدم', 'فشل قلب احتقاني', 'مريض سكتة دماغية بعد الجلطة']}
    />
  );
}
