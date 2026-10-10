/* ===== خطوتك ربح v2 · الرئيسية: خطوات اليوم، الهدف، المسافة، السعرات، النقاط ===== */
(function(){
  const KW=window.KW,C=2*Math.PI*120;
  KW.page('home',S=>{
    const el=document.getElementById('pg-home'),g=KW.set.goal,pct=Math.min(1,S.today/g),st=S.status;
    const need=!st.running||!st.activity;
    el.innerHTML=`
      <div class="ring-wrap"><div class="ring">
        <svg viewBox="0 0 270 270" aria-hidden="true">
          <defs><linearGradient id="kwGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#fbbf24"/></linearGradient></defs>
          <circle class="bg" cx="135" cy="135" r="120"/>
          <circle class="fg" cx="135" cy="135" r="120" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}"/>
        </svg>
        <div class="ring-in"><small>خطوات اليوم</small><b class="num">${KW.fmt(S.today)}</b>
          <small>${S.today>=g?'🎉 حققت هدفك':`الهدف <span class="num">${KW.fmt(g)}</span>`}</small></div>
      </div></div>
      ${need?`<div class="card alert"><p>${!st.activity?'لازم تسمح للتطبيق يقرأ نشاطك البدني حتى يعدّ خطواتك.':'العدّاد متوقف. شغّله حتى يعدّ خطواتك حتى والشاشة مطفأة.'}</p>
        <button type="button" class="btn block" id="hmFix">▶️ شغّل العدّاد</button></div>`:''}
      ${st.running&&!st.battery?`<div class="card alert"><p>حتى ما يوقف الهاتف العدّاد بالليل: اسمح للتطبيق يشتغل بدون «توفير البطارية».</p>
        <button type="button" class="btn ghost block" id="hmBat">🔋 اسمح بالخلفية</button></div>`:''}
      ${st.native&&!st.hasCounter?`<div class="card alert"><p>هاتفك ما فيه حسّاس خطوات، عم نعدّ بحسّاس الحركة (ممكن يكون أقل دقة).</p></div>`:''}
      <div class="trio">
        <div class="card"><b class="num">${KW.km(S.today)}</b><small>كم</small></div>
        <div class="card"><b class="num">${KW.fmt(KW.kcal(S.today))}</b><small>سعرة</small></div>
        <div class="card"><b class="num">${Math.round(pct*100)}%</b><small>من الهدف</small></div>
      </div>
      <div class="card pts"><div><small class="muted">نقاط اليوم (نقطة لكل 100 خطوة)</small><br><b class="num">${KW.fmt(KW.points(S.today))}</b></div>
        <div style="text-align:left"><small class="muted">كل نقاطك</small><br><b class="num">${KW.fmt(KW.points(S.total))}</b></div></div>
      ${KW.native.isNative?'':'<p class="muted" style="font-size:12px;text-align:center;margin-top:12px">معاينة بالمتصفح بأرقام تجريبية — العدّ الحقيقي بتطبيق APK</p>'}`;
    el.querySelector('#hmFix')?.addEventListener('click',()=>KW.openSetup());
    el.querySelector('#hmBat')?.addEventListener('click',()=>KW.native.openBattery());
  });
})();
