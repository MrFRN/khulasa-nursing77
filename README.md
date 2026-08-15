# الخلاصة في التمريض · Al‑Khulasa fi Al‑Tamrid

منصة رقمية عربية (RTL) لمكتبة التمريض — تصفّح، بحث، وتحميل الملفات الدراسية والكتب وأسئلة الانترفيو، مع **لوحة تحكم كاملة** تمنحك تحكمًا 100% في كل صفحة وكل ملف وكل تصنيف ونصوص الموقع — **بدون تعديل أي كود**.

A production‑ready Arabic (RTL) nursing digital library with a full admin CMS. Built with **React + TypeScript + Vite + Tailwind CSS**, **Framer Motion**, and **Supabase** (Auth, Postgres, Storage) via serverless API routes (deployed on Vercel).

---

## ✨ الميزات الرئيسية

- 🎨 تصميم فاخر (Glassmorphism) + وضع ليلي/نهاري مع حفظ التفضيل
- 🌙 دعم كامل للعربية RTL وخط Cairo
- 🔍 بحث مباشر (Live Search) + فلاتر (قسم، تصنيف، مادة، سنة، نوع الملف) + ترتيب + Pagination
- 📄 معاينة PDF داخل الموقع + توليد غلاف تلقائي لأول صفحة
- ⭐ مفضلة (Favorites) + الأكثر تحميلًا + الأحدث + المميزة
- 📊 تحليلات: عدد الزوار، التحميلات، رسم بياني للنشاط، مساحة التخزين
- 🔐 مصادقة آمنة (بريد/كلمة مرور + Google) وحماية مسارات الإدارة
- 🧩 لوحة تحكم لرفع/تعديل/حذف الملفات، إدارة التصنيفات، وتحرير محتوى الصفحة الرئيسية والشعار والبانر والروابط
- 🚀 رفع مباشر للملفات الكبيرة عبر Signed URLs مع شريط تقدم فعلي
- 🧭 أقسام: **ملفات دراسية** (الفرق الأربع)، **كتب التمريض**، **أسئلة الانترفيو**

## 🗂️ الأقسام

1. **ملفات دراسية** — الفرقة الأولى/الثانية/الثالثة/الرابعة (غلاف، عنوان، وصف، مادة، سنة، حجم، تاريخ، تحميلات، معاينة).
2. **كتب عن التمريض** — Medical, Nursing, Pharmacology, Critical Care, ICU, Emergency, Pediatrics, Med‑Surg, Psychiatric, Community, Maternity, Anatomy, Physiology, Pathology, Medical English (غلاف، مؤلف، إصدار، وصف، معاينة).
3. **أسئلة انترفيو الامتياز والشغل** — ICU/ER/OR/Dialysis/NICU/PICU/Wards/HR/Behavioral/Scenarios/MCQs/Tips.

---

## 🧱 البنية التقنية / Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 (class‑based dark mode, `@theme` tokens) |
| Animation | Framer Motion |
| Routing | React Router |
| Backend | Vercel Serverless Functions (`/api/*`) |
| Database | Supabase Postgres (`@supabase/supabase-js`) |
| Storage | Supabase Storage (buckets: `files`, `covers`, `media`) |
| Auth | Supabase Auth (Email/Password + Google) |
| PDF | `pdfjs-dist` (توليد الغلاف) + معاينة عبر iframe |

## 📁 هيكل المشروع

```
api/                      # Vercel serverless functions
  _auth.js                # التحقق من التوكن + CORS
  db-client.js            # عميل Supabase (Service Role)
  resources.js            # CRUD للملفات/الكتب/الأسئلة
  categories.js           # CRUD للتصنيفات (nursing_categories)
  settings.js             # قراءة/تحديث إعدادات الموقع (JSON)
  download.js             # تتبّع التحميل + زيادة العدّاد
  track.js                # تسجيل الزيارات/المشاهدات
  public-stats.js         # إحصائيات الصفحة الرئيسية
  analytics.js            # تحليلات لوحة التحكم
  sign-upload.js          # توليد Signed Upload URL

src/
  components/             # مكوّنات قابلة لإعادة الاستخدام (Navbar, Footer, ResourceCard, Browse, ...)
  contexts/              # ThemeContext, SettingsContext, AuthContext
  lib/                   # api.ts, supabase.ts, format.ts, constants.ts, favorites.ts, filetypes.ts, pdf.ts, googleAuth.ts
  pages/                 # Home, Study, Books, Interview, ResourceDetail, SearchResults, Favorites, Login
    admin/               # Dashboard, ManageResources, Upload, Categories, Settings
  types.ts               # الأنواع (Resource, NursingCategory, ...)

scripts/seed-nursing.mjs # بيانات تجريبية (تصنيفات + ملفات + إحصائيات + إعدادات)
```

## 🗃️ قاعدة البيانات (Schema)

- **resources**: `id, title, description, section(study|books|interview), category(slug), year, subject, author, edition, tags(jsonb), file_name, file_path, file_url, file_size, file_type, cover_image_url, cover_path, status(draft|published|scheduled), featured, popular, download_count, view_count, scheduled_at, user_id, created_at, updated_at`
- **nursing_categories**: `id, name, slug, section, icon, sort, created_at`
- **settings**: `id(=1), data(jsonb), updated_at`
- **events**: `id, type(visit|download|view|newsletter), resource_id, path, created_at`

## 🔑 المتغيرات البيئية

موجودة مسبقًا في `.env` و `vercel.json`:

```
NEXT_PUBLIC_SUPABASE_URL       # عنوان مشروع Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY  # المفتاح العام
SUPABASE_SERVICE_ROLE_KEY      # مفتاح الخدمة (للخادم فقط)
VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
VITE_GOOGLE_CLIENT_ID / VITE_GOOGLE_AUTH_PROXY
```

## 🛠️ التشغيل محليًا

```bash
npm install
npm run dev          # وضع التطوير
npm run build        # بناء الإنتاج (tsc + vite)
npm run preview      # معاينة البناء
node scripts/seed-nursing.mjs   # (اختياري) إعادة تعبئة البيانات التجريبية
```

## 👤 حساب الإدارة التجريبي

```
البريد: demo@example.com
كلمة المرور: password123
```
ادخل من `/login` ثم توجّه إلى `/admin`.

## 🧑‍💼 كيف تدير الموقع (بدون كود)

1. **رفع ملف**: لوحة التحكم → «رفع ملف» → اسحب الملفات → اختر القسم/التصنيف واملأ البيانات → «نشر» أو «مسودة» أو «جدولة».
2. **تعديل/حذف/استبدال**: «الملفات» → أيقونة التعديل (يمكن استبدال الملف مع الاحتفاظ بنفس الرابط) أو الحذف النهائي.
3. **التصنيفات**: «التصنيفات» → إضافة/تعديل/حذف لكل قسم مع اختيار أيقونة.
4. **محتوى الصفحة الرئيسية والعلامة التجارية**: «الإعدادات» → تعديل اسم الموقع، النصوص، الشعار، البانر، وروابط التواصل ثم «حفظ».
5. **التحليلات**: «لوحة التحكم» → الزوار، التحميلات، الرسم البياني، والمساحة.

## ☁️ النشر / Deployment

المشروع جاهز للنشر على **Vercel** (يوفّر تشغيل دوال `/api` تلقائيًا). كذلك يمكن نشر الواجهة على Netlify/Cloudflare مع نقل دوال `/api` إلى مزودها المكافئ.

```bash
# Vercel
vercel --prod
```

تأكد من ضبط متغيرات البيئة أعلاه في إعدادات المشروع.

## 📈 الأداء و SEO

- تقسيم الحزم، Lazy loading للصور، هياكل تحميل (Skeletons)
- Metadata عربية + Open Graph + `robots.txt` + `sitemap.xml`
- خطوط Google (Cairo) مع `preconnect`

---

© جميع الحقوق محفوظة — الخلاصة في التمريض.
