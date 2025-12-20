# إعداد تسجيل الدخول بحساب Google

## الخطوات المطلوبة:

### 1. إنشاء مشروع في Google Cloud Console

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. قم بإنشاء مشروع جديد أو اختر مشروع موجود
3. من القائمة الجانبية، اختر **APIs & Services** > **Credentials**

### 2. إعداد OAuth Consent Screen

1. اختر **OAuth consent screen** من القائمة الجانبية
2. اختر **External** ثم اضغط **Create**
3. املأ المعلومات المطلوبة:
   - **App name**: اسم تطبيقك
   - **User support email**: بريدك الإلكتروني
   - **Developer contact information**: بريدك الإلكتروني
4. اضغط **Save and Continue**
5. في صفحة **Scopes**، اضغط **Save and Continue**
6. في صفحة **Test users**، يمكنك إضافة بريدك الإلكتروني للاختبار
7. اضغط **Save and Continue**

### 3. إنشاء OAuth 2.0 Client ID

1. ارجع إلى **Credentials**
2. اضغط **Create Credentials** > **OAuth client ID**
3. اختر **Application type**: **Web application**
4. أضف **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   للإنتاج (Production):
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
5. اضغط **Create**
6. انسخ **Client ID** و **Client Secret**

### 4. إعداد ملف البيئة (.env.local)

1. انسخ ملف `.env.example` إلى `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. افتح `.env.local` وأضف المفاتيح:
   ```env
   GOOGLE_CLIENT_ID="your-client-id-here"
   GOOGLE_CLIENT_SECRET="your-client-secret-here"
   ```

3. أضف أيضاً:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-random-secret-here"
   ```

4. لإنشاء `NEXTAUTH_SECRET`، استخدم:
   ```bash
   openssl rand -base64 32
   ```

### 5. إعداد قاعدة البيانات

1. تأكد من أن قاعدة البيانات تعمل
2. قم بتشغيل:
   ```bash
   npm run db:push
   ```
   أو
   ```bash
   npm run db:migrate
   ```

### 6. تشغيل التطبيق

```bash
npm run dev
```

### 7. اختبار تسجيل الدخول

1. افتح المتصفح على `http://localhost:3000/auth/signin`
2. اضغط على زر **تسجيل الدخول باستخدام Google**
3. اختر حساب Google الخاص بك
4. سيتم تسجيل دخولك تلقائياً

## ملاحظات مهمة:

- ✅ تأكد من أن الـ redirect URI في Google Console يطابق تماماً الـ URL في التطبيق
- ✅ في وضع التطوير، استخدم `http://localhost:3000`
- ✅ في وضع الإنتاج، استخدم `https://yourdomain.com`
- ✅ لا تشارك `GOOGLE_CLIENT_SECRET` مع أحد
- ✅ لا تضف ملف `.env.local` إلى Git

## استكشاف الأخطاء:

### خطأ: "redirect_uri_mismatch"
- تأكد من أن الـ redirect URI في Google Console يطابق `NEXTAUTH_URL/api/auth/callback/google`

### خطأ: "invalid_client"
- تأكد من صحة `GOOGLE_CLIENT_ID` و `GOOGLE_CLIENT_SECRET`

### لا يتم حفظ المستخدم في قاعدة البيانات
- تأكد من تشغيل `npm run db:push` أو `npm run db:migrate`
- تأكد من أن جداول NextAuth موجودة في قاعدة البيانات (User, Account, Session, VerificationToken)
