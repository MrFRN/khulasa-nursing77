import { FlaskConical } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function Lab() {
  return (
    <AIToolPage
      slug="lab"
      title="تفسير التحاليل المخبرية"
      description="حلّل نتائج CBC، CMP، والتحاليل المخبرية"
      icon={<FlaskConical className="h-6 w-6" />}
      inputLabel="نتائج التحاليل"
      inputPlaceholder="مثال: WBC 12.5، Hb 9.2، Platelets 45000..."
      examples={[
        'WBC 14.2، Hb 8.5، Platelets 50000',
        'Glucose 280، HbA1c 9.5',
        'Na 128، K 5.8، Creatinine 2.1',
        'TSH 0.1، Free T4 3.2',
      ]}
    />
  );
}
