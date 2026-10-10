package com.khotwatak.app;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.List;

/* خطوتك ربح v2 · الجسر بين واجهة التطبيق (JavaScript) وعدّاد الخطوات الأصلي */
@CapacitorPlugin(
    name = "StepCounter",
    permissions = {
        @Permission(alias = "activity", strings = { Manifest.permission.ACTIVITY_RECOGNITION }),
        @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS })
    }
)
public class StepCounterPlugin extends Plugin {

    private boolean activityOk() {
        return Build.VERSION.SDK_INT < 29 || getPermissionState("activity") == PermissionState.GRANTED;
    }

    private boolean notifOk() {
        return Build.VERSION.SDK_INT < 33 || getPermissionState("notifications") == PermissionState.GRANTED;
    }

    private boolean batteryOk() {
        if (Build.VERSION.SDK_INT < 23) return true;
        PowerManager pm = (PowerManager) getContext().getSystemService(Context.POWER_SERVICE);
        return pm != null && pm.isIgnoringBatteryOptimizations(getContext().getPackageName());
    }

    private JSObject status() {
        JSObject o = new JSObject();
        o.put("native", true);
        o.put("hasCounter", StepService.hasCounter(getContext()));
        o.put("activity", activityOk());
        o.put("notifications", notifOk());
        o.put("battery", batteryOk());
        o.put("running", StepService.running);
        o.put("auto", StepStore.isAuto(getContext()));
        o.put("brand", Build.MANUFACTURER == null ? "" : Build.MANUFACTURER.toLowerCase());
        o.put("sdk", Build.VERSION.SDK_INT);
        return o;
    }

    @PluginMethod
    public void checkStatus(PluginCall call) { call.resolve(status()); }

    @PluginMethod
    public void requestPerms(PluginCall call) {
        List<String> need = new ArrayList<>();
        if (!activityOk()) need.add("activity");
        if (!notifOk()) need.add("notifications");
        if (need.isEmpty()) { call.resolve(status()); return; }
        requestPermissionForAliases(need.toArray(new String[0]), call, "permsDone");
    }

    @PermissionCallback
    private void permsDone(PluginCall call) { call.resolve(status()); }

    @PluginMethod
    public void start(PluginCall call) {
        if (!activityOk()) { call.reject("NO_PERMISSION"); return; }
        try {
            StepStore.setAuto(getContext(), true);
            StepService.start(getContext());
            call.resolve(status());
        } catch (Exception e) {
            call.reject("START_FAILED: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        StepStore.setAuto(getContext(), false);
        StepService.stop(getContext());
        call.resolve(status());
    }

    @PluginMethod
    public void getData(PluginCall call) {
        try {
            call.resolve(new JSObject(StepStore.snapshot(getContext()).toString()));
        } catch (Exception e) {
            call.reject("DATA_FAILED");
        }
    }

    @PluginMethod
    public void openBattery(PluginCall call) {
        String pkg = getContext().getPackageName();
        try {
            Intent i = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + pkg));
            getActivity().startActivity(i);
        } catch (Exception e) {
            try { getActivity().startActivity(new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)); }
            catch (Exception ignored) {}
        }
        call.resolve();
    }

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        try {
            Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(i);
        } catch (Exception ignored) {}
        call.resolve();
    }
}
