import { Activity } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function ECG() {
  return (
    <AIToolPage
      slug="ecg"
      title="تحليل تخطيط القلب"
      description="تفسير قراءات ECG وتحديد التشخيص"
      icon={<Activity className="h-6 w-6" />}
      inputLabel="وصف قراءة ECG أو الأعراض"
      inputPlaceholder="مثال: HR 120، QRS wide، no P waves، irregular R-R"
      examples={[
        'HR 150، QRS narrow، no P waves',
        'ST elevation in leads II, III, aVF',
        'HR 45، regular، narrow QRS، no P waves',
        'Irregular R-R، absent P waves',
      ]}
    />
  );
}
