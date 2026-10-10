package com.khotwatak.app;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

/* خطوتك ربح v2 · تخزين الخطوات على الهاتف (اليوم + سجل الأيام) */
public final class StepStore {
    private static final String P = "kw_steps";
    private static final int KEEP_DAYS = 400;

    private StepStore() {}

    static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(P, Context.MODE_PRIVATE);
    }

    static String todayStr() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    /* إذا تغيّر اليوم: احفظ أمس بالسجل وابدأ من صفر */
    private static void roll(SharedPreferences p, SharedPreferences.Editor e) {
        String now = todayStr();
        String day = p.getString("day", now);
        if (!now.equals(day)) {
            JSONObject h = history(p);
            try {
                h.put(day, p.getLong("today", 0));
                trim(h);
            } catch (Exception ignored) {}
            e.putString("history", h.toString());
            e.putLong("today", 0);
        }
        e.putString("day", now);
    }

    private static void trim(JSONObject h) {
        if (h.length() <= KEEP_DAYS) return;
        List<String> keys = new ArrayList<>();
        Iterator<String> it = h.keys();
        while (it.hasNext()) keys.add(it.next());
        Collections.sort(keys);
        for (int i = 0; i < keys.size() - KEEP_DAYS; i++) h.remove(keys.get(i));
    }

    static JSONObject history(SharedPreferences p) {
        try { return new JSONObject(p.getString("history", "{}")); }
        catch (Exception e) { return new JSONObject(); }
    }

    /* قراءة حسّاس Step Counter (عدّاد تراكمي من آخر تشغيل للهاتف) */
    static synchronized long onRaw(Context c, long raw) {
        SharedPreferences p = prefs(c);
        SharedPreferences.Editor e = p.edit();
        roll(p, e);
        long last = p.getLong("lastRaw", -1);
        long delta;
        if (last < 0) delta = 0;            // أول قراءة: نقطة البداية
        else if (raw < last) delta = raw;   // الهاتف انعاد تشغيله
        else delta = raw - last;
        if (delta > 30000) delta = 0;       // قراءة غلط
        long today = (todayChanged(p) ? 0 : p.getLong("today", 0)) + delta;
        e.putLong("today", today);
        e.putLong("lastRaw", raw);
        e.putLong("total", p.getLong("total", 0) + delta);
        e.apply();
        return today;
    }

    /* طريقة احتياطية (هواتف بدون حسّاس خطوات): زيادة مباشرة */
    static synchronized long add(Context c, long n) {
        SharedPreferences p = prefs(c);
        SharedPreferences.Editor e = p.edit();
        roll(p, e);
        long today = (todayChanged(p) ? 0 : p.getLong("today", 0)) + n;
        e.putLong("today", today);
        e.putLong("total", p.getLong("total", 0) + n);
        e.apply();
        return today;
    }

    private static boolean todayChanged(SharedPreferences p) {
        return !todayStr().equals(p.getString("day", todayStr()));
    }

    static synchronized JSONObject snapshot(Context c) {
        SharedPreferences p = prefs(c);
        SharedPreferences.Editor e = p.edit();
        roll(p, e);
        e.apply();
        JSONObject o = new JSONObject();
        try {
            o.put("date", todayStr());
            o.put("today", todayChanged(p) ? 0 : p.getLong("today", 0));
            o.put("total", p.getLong("total", 0));
            o.put("history", history(p));
        } catch (Exception ignored) {}
        return o;
    }

    static void setAuto(Context c, boolean on) { prefs(c).edit().putBoolean("auto", on).apply(); }
    static boolean isAuto(Context c) { return prefs(c).getBoolean("auto", false); }
}
