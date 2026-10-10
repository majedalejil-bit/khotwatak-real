// خطوتك ربح v2 · بيضيف الكود الأصلي (عدّاد الخطوات) لمشروع أندرويد اللي بيعمله Capacitor
// بيشتغل تلقائياً على GitHub Actions بعد «npx cap add android»
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const app = path.join(root, 'android/app');
const pkgDir = path.join(app, 'src/main/java/com/khotwatak/app');
const res = path.join(app, 'src/main/res');
const must = (c, m) => { if (!c) { console.error('PATCH FAILED: ' + m); process.exit(1); } };

// 1) ملفات Java
fs.mkdirSync(pkgDir, { recursive: true });
for (const f of fs.readdirSync('native/java')) fs.copyFileSync(path.join('native/java', f), path.join(pkgDir, f));

// 2) الأيقونات وأيقونة الإشعار
const copyDir = (a, b) => {
  fs.mkdirSync(b, { recursive: true });
  for (const f of fs.readdirSync(a)) {
    const s = path.join(a, f), d = path.join(b, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
};
copyDir('native/res', res);
fs.rmSync(path.join(res, 'mipmap-anydpi-v26'), { recursive: true, force: true });

// 3) AndroidManifest: الصلاحيات + الخدمة + الاستقبال بعد إعادة التشغيل
const mf = path.join(app, 'src/main/AndroidManifest.xml');
let m = fs.readFileSync(mf, 'utf8');
const perms = [
  'android.permission.ACTIVITY_RECOGNITION',
  'com.google.android.gms.permission.ACTIVITY_RECOGNITION',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_HEALTH',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.WAKE_LOCK',
  'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS'
].filter(p => !m.includes(`"${p}"`)).map(p => `    <uses-permission android:name="${p}" />`).join('\n');
const feats = '    <uses-feature android:name="android.hardware.sensor.stepcounter" android:required="false" />\n' +
              '    <uses-feature android:name="android.hardware.sensor.accelerometer" android:required="false" />';
must(m.includes('<application'), 'no <application>');
m = m.replace('<application', `${perms}\n${feats}\n\n    <application`);
const comps = `
        <service
            android:name=".StepService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="health" />
        <receiver
            android:name=".BootReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
                <action android:name="android.intent.action.MY_PACKAGE_REPLACED" />
            </intent-filter>
        </receiver>
    </application>`;
must(m.includes('</application>'), 'no </application>');
m = m.replace('</application>', comps);
fs.writeFileSync(mf, m);

// 4) رقم النسخة + التوقيع الثابت (حتى التحديثات تنزل فوق القديم بدون حذف)
const bg = path.join(app, 'build.gradle');
let g = fs.readFileSync(bg, 'utf8');
g = g.replace(/versionCode \d+/, 'versionCode 2').replace(/versionName "[^"]*"/, 'versionName "2.0"');
g += `
android {
    signingConfigs {
        kw {
            storeFile file('../../keystore/khotwatak.jks')
            storePassword 'khotwatak2026'
            keyAlias 'khotwatak'
            keyPassword 'khotwatak2026'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.kw
            minifyEnabled false
        }
    }
}
`;
fs.writeFileSync(bg, g);

console.log('✓ patched android project');
