import { Circle as HelpCircle } from 'lucide-react';
import Browse from '../components/Browse';

export default function Interview() {
  return (
    <Browse
      section="interview"
      title="أسئلة الانترفيو"
      subtitle="ICU · ER · OR · Dialysis · NICU · PICU · Wards · HR · Behavioral · Scenarios · MCQs"
      icon={<HelpCircle className="h-6 w-6" />}
    />
  );
}
