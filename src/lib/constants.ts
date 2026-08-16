import type { Section } from '../types';

export const SECTIONS: { key: Section; label: string; labelEn: string; icon: string }[] = [
  { key: 'study', label: 'ملفات دراسية', labelEn: 'Study Files', icon: 'FileText' },
  { key: 'books', label: 'كتب التمريض', labelEn: 'Nursing Books', icon: 'BookOpen' },
  { key: 'interview', label: 'أسئلة الانترفيو', labelEn: 'Interview Questions', icon: 'HelpCircle' },
];

export const STUDY_YEARS = [
  { slug: 'first', label: 'الفرقة الأولى' },
  { slug: 'second', label: 'الفرقة الثانية' },
  { slug: 'third', label: 'الفرقة الثالثة' },
  { slug: 'fourth', label: 'الفرقة الرابعة' },
];

export const BOOK_CATEGORIES = [
  'Medical', 'Nursing', 'Pharmacology', 'Critical Care', 'ICU',
  'Emergency', 'Pediatrics', 'Med-Surg', 'Psychiatric', 'Community',
  'Maternity', 'Anatomy', 'Physiology', 'Pathology', 'Medical English',
];

export const INTERVIEW_TOPICS = [
  'ICU', 'ER', 'OR', 'Dialysis', 'NICU', 'PICU',
  'Wards', 'HR', 'Behavioral', 'Scenarios', 'MCQs', 'Tips',
];

export const RESOURCE_STATUS_LABELS: Record<string, string> = {
  draft: 'مسودة',
  published: 'منشور',
  scheduled: 'مجدول',
};

export const FILE_TYPE_LABELS: Record<string, string> = {
  pdf: 'PDF',
  doc: 'Word',
  docx: 'Word',
  ppt: 'PowerPoint',
  pptx: 'PowerPoint',
  zip: 'ZIP',
  image: 'صورة',
  video: 'فيديو',
};

export const PAGE_SIZE = 12;

export const DEFAULT_SETTINGS = {
  site_name: 'الخلاصة في التمريض',
  tagline: 'مكتبة التمريض الرقمية',
  logo_url: '',
  banner_title: 'الخلاصة في التمريض',
  banner_subtitle: 'تصفح، ابحث، وحمّل الملفات الدراسية والكتب وأسئلة الانترفيو',
  banner_image_url: '',
  social_links: {
    facebook: '',
    twitter: '',
    instagram: '',
    telegram: '',
  },
};
