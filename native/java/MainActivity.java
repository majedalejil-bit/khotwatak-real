package com.khotwatak.app;

import android.graphics.Color;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

/* RIVO v9 · الشاشة الرئيسية: بتفتح RIVO وبتسجّل عدّاد الخطوات */
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(StepCounterPlugin.class);
        super.onCreate(savedInstanceState);
        try {
            getWindow().setStatusBarColor(Color.parseColor("#0c0a1d"));
            getWindow().setNavigationBarColor(Color.parseColor("#0c0a1d"));
        } catch (Exception ignored) {}
    }
}
