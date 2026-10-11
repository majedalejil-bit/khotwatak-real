/* ===== خطوتك ربح v2 · الإعدادات: الهدف، العدّاد، البطارية، المظهر ===== */
(function(){
  const KW=window.KW;
  KW.page('settings',S=>{
    const el=document.getElementById('pg-settings'),st=S.status;
    el.innerHTML=`<div class="sec"><h2>الإعدادات</h2></div>
      <div class="card">
        <div class="row"><div><b>هدفك اليومي</b><p>كم خطوة بدك تمشي باليوم</p></div>
          <div class="goal"><button type="button" data-g="-500" aria-label="أقل">−</button><b class="num">${KW.fmt(KW.set.goal)}</b><button type="button" data-g="500" aria-label="أكتر">+</button></div></div>
        <div class="row"><div><b>عدّاد الخطوات بالخلفية</b><p>${st.running?'شغّال — بيعدّ والشاشة مطفأة':'متوقف'}</p></div>
          <button type="button" class="sw ${st.running?'on':''}" id="stRun" aria-label="عدّاد الخطوات" aria-pressed="${st.running}"></button></div>
        <div class="row"><div><b>توفير البطارية</b><p>${st.battery?'✓ التطبيق مسموح بالخلفية':'⚠️ الهاتف ممكن يوقف العدّاد'}</p></div>
          <button type="button" class="btn ghost" id="stBat">فتح</button></div>
        <div class="row"><div><b>أذونات التطبيق</b><p>النشاط البدني ${st.activity?'✓':'✕'} · الإشعارات ${st.notifications?'✓':'✕'}</p></div>
          <button type="button" class="btn ghost" id="stPerm">فتح</button></div>
        <div class="row"><div><b>الوضع الفاتح</b></div>
          <button type="button" class="sw ${KW.set.theme==='light'?'on':''}" id="stTheme" aria-label="الوضع الفاتح"></button></div>
      </div>
      <button type="button" class="btn ghost block" id="stSetup" style="margin-top:12px">👟 خطوات التشغيل</button>
      <p class="muted" style="font-size:12px;text-align:center;margin-top:16px">خطوتك ربح v2.0 · ${st.native?(st.hasCounter?'حسّاس الخطوات الأصلي':'حسّاس الحركة'):'وضع المعاينة'}</p>`;
    el.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{KW.set.goal=Math.min(50000,Math.max(1000,KW.set.goal+ +b.dataset.g));KW.save();KW.emit()});
    el.querySelector('#stRun').onclick=async()=>{
      try{Object.assign(KW.S.status,st.running?await KW.native.stop():await KW.native.start());KW.toast(KW.S.status.running?'العدّاد شغّال ✓':'وقّفت العدّاد')}
      catch(e){KW.openSetup()}
      KW.refresh();
    };
    el.querySelector('#stBat').onclick=()=>KW.native.openBattery();
    el.querySelector('#stPerm').onclick=()=>KW.native.openAppSettings();
    el.querySelector('#stTheme').onclick=()=>{KW.set.theme=KW.set.theme==='light'?'dark':'light';KW.save();KW.applyTheme();KW.emit()};
    el.querySelector('#stSetup').onclick=()=>KW.openSetup();
  });
})();
