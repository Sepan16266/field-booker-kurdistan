# 🔧 حل مشكلة GitHub Push Protection

## المشكلة:
GitHub يمنع رفع الملفات الحساسة (Firebase credentials)

## الحل:

### 1. افتح Command Prompt أو PowerShell في مجلد المشروع

### 2. قم بتشغيل الأوامر التالية واحد<|im_start|>واحد:

```bash
# إضافة .gitignore المحدث
git add .gitignore

# إضافة .gitattributes
git add .gitattributes

# إنشاء commit جديد
git commit -m "Security: Update .gitignore and add .gitattributes for sensitive files protection"

# محاولة الرفع مرة أخرى
git push origin main
```

### 3. إذا استمرت المشكلة، استخدم هذا الحل:

```bash
# إزالة الملفات الحساسة من Git index (بدون حذفها من جهازك)
git rm --cached server/firebase-service-account.json
git rm --cached "attached_assets/Pasted--type-service-account-project-id-mini-football-booking-private-key-id-5465-1749679448022_1749679448025.txt"
git rm --cached "attached_assets/Pasted--type-service-account-project-id-sample-firebase-ai-app-8e459-private-key-id--1749679363791_1749679363793.txt"

# إضافة التغييرات
git add .

# إنشاء commit
git commit -m "Remove sensitive files from Git tracking"

# الرفع
git push origin main
```

### 4. الحل الأخير (إذا لم تعمل الحلول السابقة):

```bash
# إنشاء فرع جديد بدون تاريخ
git checkout --orphan main-clean

# إضافة جميع الملفات
git add .

# إنشاء commit جديد
git commit -m "Initial commit: Field Booker Kurdistan (cleaned)"

# حذف الفرع القديم
git branch -D main

# إعادة تسمية الفرع
git branch -m main

# فرض الرفع
git push -f origin main
```

## ✅ ملاحظات مهمة:

- الملفات الحساسة ستبقى في جهازك المحلي
- لن يتم رفعها إلى GitHub
- استخدم متغيرات البيئة في منصة النشر
- .gitignore محدث لحماية الملفات الحساسة

## 🚀 بعد حل المشكلة:

يمكنك نشر الموقع على:
- Vercel
- Render
- Railway
- Netlify

باستخدام متغيرات البيئة من ملف `.env.production`
