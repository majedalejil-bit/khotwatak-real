# خطوتك ربح - دليل البناء والنشر

تطبيق حقيقي 100% لعداد الخطوات مع تتبع خلفي حقيقي

## المتطلبات

- **Node.js** 16+ و npm
- **Capacitor CLI**: `npm install -g @capacitor/cli`
- **Android Studio** (اختياري للاختبار على محاكي)
- **Java Development Kit (JDK)** 11+
- **Android SDK** مع Android 10+ (API level 29+)

## الخطوة 1: تثبيت المكتبات

```bash
npm install
```

## الخطوة 2: بناء الويب

```bash
npm run build
```

سيتم إنشاء مجلد `dist/` يحتوي على ملفات الويب المجمعة.

## الخطوة 3: إضافة منصات الجوال

```bash
npx cap add android
```

(اختياري) لإضافة iOS:
```bash
npx cap add ios
```

## الخطوة 4: نسخ ملفات الويب إلى Capacitor

```bash
npx cap copy
```

## الخطوة 5: فتح المشروع في Android Studio

```bash
npx cap open android
```

## الخطوة 6: بناء APK

في Android Studio:

1. اذهب إلى **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. أو انتقل إلى **Build** → **Build Bundle(s) / APK(s)** → **Build Bundle(s)** (AAB) للمتجر

سيتم إنشاء الملف في:
```
android/app/release/app-release.apk
```

## الخطوة 7: اختبار APK (اختياري)

```bash
# تثبيت على جهاز متصل
adb install android/app/release/app-release.apk

# أو استخدام محاكي Android Studio
```

## الخطوة 8: النشر على Netlify (الطريقة الموصى بها)

### الخيار A: رفع مباشر للملف

1. انتقل إلى [Netlify](https://app.netlify.com)
2. أنشئ حساب (إذا لم تكن تملك واحداً)
3. اذهب إلى **Sites** → **New site** → **Deploy manually**
4. انسخ ملف APK من `android/app/release/app-release.apk`
5. اسحب وأفلت الملف على Netlify
6. ستحصل على رابط مباشر مثل: `https://your-site.netlify.app/app-release.apk`

### الخيار B: ربط GitHub (الأفضل للتحديثات)

```bash
# في مستودعك
git init
git add .
git commit -m "خطوتك ربح - تطبيق عداد الخطوات"
git remote add origin https://github.com/USERNAME/khotwatak-real
git push -u origin main
```

ثم في Netlify:
1. اختر **New site from Git**
2. ربط GitHub
3. اختر المستودع
4. تكوين البناء:
   - **Build command**: `npm run build && npx cap copy`
   - **Publish directory**: `dist`
5. انقر **Deploy**

## رابط التحميل المباشر

بعد النشر على Netlify، شارك هذا الرابط للتحميل:
```
https://your-site-name.netlify.app/app-release.apk
```

المستخدمون يمكنهم:
1. فتح الرابط من متصفح هاتفهم
2. اختيار تنزيل APK
3. تثبيت من **الإعدادات** → **الأمان** (قد تحتاج إلى السماح بالتطبيقات من مصادر غير معروفة)

## الميزات الحقيقية

✅ **تتبع حقيقي 100%** - يستخدم Health API الأصلي للهاتف
✅ **يعمل في الخلفية** - يتتبع الخطوات حتى مع إغلاق التطبيق
✅ **يعمل في الجيب** - مستشعرات حقيقية للهاتف
✅ **حفظ محلي** - جميع البيانات محفوظة محلياً
✅ **Dark/Light Mode** - وضع مظلم ومضيء
✅ **إحصائيات دقيقة** - مسافة وسعرات وسعرات

## استكشاف الأخطاء

### المشكلة: "لم يتم العثور على Health API"
- تأكد من تثبيت Android 10+ على الجهاز
- تحقق من الأذونات في **الإعدادات** → **التطبيقات** → **خطوتك ربح** → **الأذونات**

### المشكلة: "لا تظهر الخطوات"
- اترك التطبيق مفتوحاً لمدة دقيقة حتى يبدأ التتبع
- تأكد من أن مستشعر الخطوات مُفعَّل في **الإعدادات** → **الصحة والسلامة**

### المشكلة: لم ينجح البناء
```bash
# امسح المخزن المؤقت
npm cache clean --force
rm -rf node_modules dist android
npm install
npm run build
```

## الدعم والتطوير

للتطوير المستقبلي:
- أضف تنبيهات محلية (`LocalNotifications`)
- أضف تصدير البيانات
- أضف سجل يومي للخطوات
- أضف تكامل مع تطبيقات الصحة الأخرى

## الترخيص

هذا التطبيق مفتوح المصدر ومجاني للاستخدام الشخصي.

---

**تم الإنشاء**: 2026-10-04
**الإصدار**: 1.0.0
