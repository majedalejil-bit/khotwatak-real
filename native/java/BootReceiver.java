package com.khotwatak.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/* خطوتك ربح v2 · بعد إعادة تشغيل الهاتف أو تحديث التطبيق: رجّع العدّاد يشتغل لحاله */
public class BootReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context c, Intent i) {
        String a = i == null ? null : i.getAction();
        if (a == null) return;
        if (!Intent.ACTION_BOOT_COMPLETED.equals(a) && !Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)
            && !"android.intent.action.QUICKBOOT_POWERON".equals(a)) return;
        if (!StepStore.isAuto(c)) return;
        try { StepService.start(c); } catch (Exception ignored) {}
    }
}
