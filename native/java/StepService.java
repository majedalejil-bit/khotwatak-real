package com.khotwatak.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

/* خطوتك ربح v2 · خدمة بالخلفية: بتضل تعدّ والشاشة مطفأة والتطبيق مسكّر */
public class StepService extends Service implements SensorEventListener {
    static final String CH = "kw_steps";
    static final int NID = 7001;
    static volatile boolean running = false;

    private SensorManager sm;
    private PowerManager.WakeLock wake;
    private boolean fallback = false;
    private long lastNotif = 0;
    private long shown = -1;

    /* الطريقة الاحتياطية: كشف الخطوات من حسّاس الحركة */
    private double avg = 9.8;
    private boolean above = false;
    private long lastStepAt = 0;

    static void start(Context c) {
        Intent i = new Intent(c, StepService.class);
        if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i); else c.startService(i);
    }

    static void stop(Context c) { c.stopService(new Intent(c, StepService.class)); }

    static boolean hasCounter(Context c) {
        SensorManager s = (SensorManager) c.getSystemService(Context.SENSOR_SERVICE);
        return s != null && s.getDefaultSensor(Sensor.TYPE_STEP_COUNTER) != null;
    }

    @Override public void onCreate() {
        super.onCreate();
        channel();
        Notification n = build(StepStore.snapshot(this).optLong("today", 0));
        if (Build.VERSION.SDK_INT >= 34) startForeground(NID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH);
        else startForeground(NID, n);
        running = true;
        sm = (SensorManager) getSystemService(SENSOR_SERVICE);
        Sensor counter = sm == null ? null : sm.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        if (counter != null) {
            // تجميع القراءات كل 10 ثواني: الحسّاس بيضل يعدّ والمعالج نايم، بطارية شبه صفر
            sm.registerListener(this, counter, SensorManager.SENSOR_DELAY_NORMAL, 10_000_000);
        } else if (sm != null) {
            Sensor acc = sm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
            if (acc != null) {
                fallback = true;
                PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
                if (pm != null) {
                    wake = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "khotwatak:steps");
                    wake.acquire();
                }
                sm.registerListener(this, acc, SensorManager.SENSOR_DELAY_GAME);
            }
        }
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) { return START_STICKY; }

    @Override public void onSensorChanged(SensorEvent ev) {
        long today;
        if (ev.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            today = StepStore.onRaw(this, (long) ev.values[0]);
        } else {
            double m = Math.sqrt(ev.values[0] * ev.values[0] + ev.values[1] * ev.values[1] + ev.values[2] * ev.values[2]);
            avg = avg * 0.9 + m * 0.1;
            long now = System.currentTimeMillis();
            if (!above && m > avg + 1.6) {
                above = true;
                if (now - lastStepAt > 280) { lastStepAt = now; today = StepStore.add(this, 1); notifyMaybe(today); }
            } else if (above && m < avg) above = false;
            return;
        }
        notifyMaybe(today);
    }

    private void notifyMaybe(long today) {
        long now = System.currentTimeMillis();
        if (today == shown || now - lastNotif < 5000) return;
        lastNotif = now; shown = today;
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(NID, build(today));
    }

    @Override public void onAccuracyChanged(Sensor s, int a) {}

    @Override public void onDestroy() {
        running = false;
        if (sm != null) sm.unregisterListener(this);
        if (wake != null && wake.isHeld()) wake.release();
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent i) { return null; }

    private void channel() {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel c = new NotificationChannel(CH, "عدّاد الخطوات", NotificationManager.IMPORTANCE_LOW);
            c.setShowBadge(false);
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (nm != null) nm.createNotificationChannel(c);
        }
    }

    private Notification build(long today) {
        Intent open = new Intent(this, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(this, 0, open,
            PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0));
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(this, CH) : new Notification.Builder(this);
        b.setSmallIcon(R.drawable.ic_kw_steps)
         .setContentTitle("👟 " + String.format(java.util.Locale.US, "%,d", today) + " خطوة اليوم")
         .setContentText(fallback ? "عم نعدّ خطواتك (وضع حسّاس الحركة)" : "عم نعدّ خطواتك حتى والشاشة مطفأة")
         .setContentIntent(pi)
         .setOngoing(true)
         .setOnlyAlertOnce(true)
         .setShowWhen(false);
        if (Build.VERSION.SDK_INT < 26) b.setPriority(Notification.PRIORITY_LOW);
        return b.build();
    }
}
