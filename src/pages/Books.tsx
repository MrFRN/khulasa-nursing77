import { BookOpen } from 'lucide-react';
import Browse from '../components/Browse';

export default function Books() {
  return (
    <Browse
      section="books"
      title="كتب التمريض"
      subtitle="Medical · Nursing · Pharmacology · Critical Care · ICU · Emergency · Pediatrics"
      icon={<BookOpen className="h-6 w-6" />}
    />
  );
}
