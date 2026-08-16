# دليل تشغيل الموقع خطوة بخطوة

هاي شرح كامل، خطوة خطوة، شلون تشغّل الموقع على جهازك وبعدين تنشره على الإنترنت.

---

## 1. تحميل البرامج الأساسية

1. **Node.js** — روح لـ https://nodejs.org وحمّل النسخة LTS (اضغط Next كل مرة).
   - للتأكد إنه انثبت، افتح **Command Prompt** (أو Terminal) واكتب:
     ```
     node -v
     npm -v
     ```
     لازم يطلعلك رقم إصدار مو رسالة خطأ.

2. **محرر أكواد** — حمّل **Visual Studio Code** من https://code.visualstudio.com (مجاني وسهل).

3. **Git** (اختياري بس مفيد) — https://git-scm.com

---

## 2. فتح المشروع

1. فك ضغط الملف اللي رح تستلمه (المجلد `town-places-app`).
2. افتح **VS Code** → File → Open Folder → اختر المجلد.
3. افتح Terminal داخل VS Code (من فوق: Terminal → New Terminal) واكتب:
   ```
   npm install
   ```
   هاي رح تنزّل كل المكتبات اللي المشروع يحتاجها (Express, Mongoose, Passport...).

---

## 3. عمل قاعدة بيانات مجانية (MongoDB Atlas)

1. روح لـ https://www.mongodb.com/cloud/atlas/register وسوّي حساب مجاني.
2. أنشئ **Cluster** مجاني (اختر Free / M0).
3. من "Database Access" أنشئ يوزر وباسورد لقاعدة البيانات (احفظهم).
4. من "Network Access" اضغط "Allow Access from Anywhere" (0.0.0.0/0).
5. اضغط "Connect" → "Drivers" → انسخ الرابط (connection string)، شكله هيك:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/
   ```
6. بدّل USERNAME و PASSWORD بالبيانات اللي سويتها، وضيف اسم قاعدة البيانات بعد الشرطة، مثلاً:
   ```
   mongodb+srv://ahmed:mypass123@cluster0.xxxxx.mongodb.net/townPlaces
   ```

---

## 4. إعداد ملف البيئة (.env)

1. داخل مجلد المشروع، انسخ الملف `.env.example` وسمّي النسخة `.env` (بالضبط بهذا الاسم).
2. افتحه وعبّي:
   - `MONGO_URI` → الرابط اللي جبته من Atlas.
   - `SESSION_SECRET` → اكتب أي جملة عشوائية طويلة (مثلاً: `kj3h4kjh5h4kjh35`).
   - `ADMIN_USERNAME=admin` و `ADMIN_PASSWORD=Rivaldo123` (موجودين مسبقاً، خلّيهم أو غيّرهم لاحقاً).
   - باقي القيم (Google, Facebook, Gmail) رح نعبّيها بالخطوات الجاية.

---

## 5. تفعيل تسجيل الدخول بـ Google

1. روح لـ https://console.cloud.google.com
2. أنشئ مشروع جديد (New Project).
3. من القائمة الجانبية: APIs & Services → OAuth consent screen → اختر "External" واملأ الاسم والإيميل.
4. بعدين روح لـ Credentials → Create Credentials → OAuth client ID.
   - Application type: **Web application**
   - Authorized redirect URIs: أضف
     ```
     http://localhost:3000/auth/google/callback
     ```
5. رح يعطيك **Client ID** و **Client Secret** — حطهم بملف `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

---

## 6. تفعيل تسجيل الدخول بـ Facebook

1. روح لـ https://developers.facebook.com/apps وسوّي تطبيق جديد (نوعه Consumer).
2. من لوحة التطبيق: Add Product → Facebook Login → Set Up.
3. من Settings الخاصة بـ Facebook Login، بقسم "Valid OAuth Redirect URIs" ضيف:
   ```
   http://localhost:3000/auth/facebook/callback
   ```
4. من App Settings → Basic، انسخ **App ID** و **App Secret** وحطهم بملف `.env`:
   ```
   FACEBOOK_APP_ID=...
   FACEBOOK_APP_SECRET=...
   ```

---

## 7. تفعيل إرسال نسخة قاعدة البيانات على إيميلك (Gmail)

عشان تقدر تستلم ملف txt كل ما يصير تحديث، لازم "App Password" من Gmail (مو الباسورد العادي):

1. فعّل "التحقق بخطوتين" (2-Step Verification) على حساب minastalker26@gmail.com من:
   https://myaccount.google.com/security
2. بعدها روح لـ https://myaccount.google.com/apppasswords
3. أنشئ App Password جديد (اختر "Mail" كنوع التطبيق)، رح يعطيك كود من 16 حرف.
4. حط الكود بملف `.env`:
   ```
   GMAIL_USER=minastalker26@gmail.com
   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   ```

---

## 8. تشغيل الموقع على جهازك

بالـ Terminal داخل VS Code اكتب:

```
npm start
```

إذا كلشي مضبوط رح تشوف:
```
✅ MongoDB connected
🚀 Server running: http://localhost:3000
```

افتح المتصفح على: **http://localhost:3000**

- تسجيل حساب ضيف عادي: `/signup`
- دخول لوحة التحكم (أنت المالك): `/admin/login` → يوزر `admin` وباسورد `Rivaldo123`
- من لوحة التحكم تكدر تضيف/تعدّل/تحذف الأماكن، وكل تعديل رح يوصلك إيميل فيه ملف txt محدّث.

---

## 9. نشر الموقع على الإنترنت (عشان يشوفه الناس)

أسهل طريقة مجانية: **Render.com**

1. سوّي حساب على https://render.com وربطه مع GitHub.
2. ارفع مجلد المشروع على GitHub (لو ما تعرف Git، بإمكانك تسحب المجلد مباشرة داخل Render أو تسألني أشرحلك رفع GitHub خطوة بخطوة).
3. بـ Render: New → Web Service → اختر الريبو.
   - Build Command: `npm install`
   - Start Command: `npm start`
4. من "Environment" ضيف نفس المتغيرات اللي بملف `.env` عندك (MONGO_URI, SESSION_SECRET... الخ)، وغيّر:
   ```
   GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/auth/google/callback
   FACEBOOK_CALLBACK_URL=https://your-app-name.onrender.com/auth/facebook/callback
   BASE_URL=https://your-app-name.onrender.com
   ```
5. لا تنسى ترجع لـ Google Cloud Console و Facebook Developers وتضيف نفس الروابط الجديدة بقسم الـ Redirect URIs.
6. اضغط Deploy — بعد دقيقتين رح يصير عندك رابط حقيقي للموقع.

---

## ملاحظات مهمة

- **الأمان**: باسورد الأدمن حالياً نص عادي بملف `.env` — هذا مقبول لموقع صغير خاص فيك، بس لو تحب أرفع مستوى الحماية أقدر أشفّره أو أضيف تحقق بخطوتين للأدمن.
- **الصور**: حالياً تحط "رابط صورة" (مثلاً من موقع صور مجاني) بدل رفع صورة من جهازك مباشرة — إذا تريد رفع صور فعلي من جهازك أقدر أضيفها لاحقاً (تحتاج تخزين ملفات مثل Cloudinary).
- **قاعدة بيانات الضيوف منفصلة تماماً** عن حساب الأدمن — الأدمن ما إله "حساب" بقاعدة البيانات، هو دخول ثابت باسم ورمز سر فقط كما طلبت.
- إذا وصلك خطأ وأنت شغّال، انسخ الرسالة وابعتهالي وأنا أشرح شنو المشكلة.
