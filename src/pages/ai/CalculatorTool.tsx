import { Calculator } from 'lucide-react';
import AIToolPage from './AIToolPage';

export default function CalculatorTool() {
  return (
    <AIToolPage
      slug="calculator"
      title="حاسبات تمريضية"
      description="احسب الجرعات، معدل الترشيح، BMI، ومعادلات تمريضية أخرى"
      icon={<Calculator className="h-6 w-6" />}
      inputLabel="ما الذي تريد حسابه؟"
      inputPlaceholder="مثال: احسب جرعة الباراسيتامول لطفل وزنه 15 كجم"
      inputType="text"
      examples={[
        'جرعة باراسيتامول لطفل 15 كجم',
        'حساب GFR للمرأة عمر 60 وكرياتينين 1.2',
        'حساب BMI لوزن 70 وطول 170',
        'معدل تنقيط IV: 1000 مل في 8 ساعات',
      ]}
    />
  );
}
