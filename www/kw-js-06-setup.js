/* ===== خطوتك ربح v2 · تشغيل العدّاد: الصلاحيات ← التشغيل ← البطارية ===== */
(function(){
  const KW=window.KW;
  const TIPS={
    xiaomi:'شاومي/ريدمي: الإعدادات ← التطبيقات ← خطوتك ربح ← توفير البطارية ← «بدون قيود»، وفعّل «التشغيل التلقائي».',
    redmi:'شاومي/ريدمي: الإعدادات ← التطبيقات ← خطوتك ربح ← توفير البطارية ← «بدون قيود»، وفعّل «التشغيل التلقائي».',
    poco:'بوكو: الإعدادات ← التطبيقات ← خطوتك ربح ← توفير البطارية ← «بدون قيود»، وفعّل «التشغيل التلقائي».',
    samsung:'سامسونج: الإعدادات ← البطارية ← حدود استخدام الخلفية ← تأكد إنو «خطوتك ربح» مو بقائمة التطبيقات النايمة.',
    huawei:'هواوي: الإعدادات ← البطارية ← تشغيل التطبيقات ← خطوتك ربح ← إدارة يدوية وفعّل الثلاث خيارات.',
    honor:'هونر: الإعدادات ← البطارية ← تشغيل التطبيقات ← خطوتك ربح ← إدارة يدوية وفعّل الثلاث خيارات.',
    oppo:'أوبو: الإعدادات ← البطارية ← خطوتك ربح ← «السماح بالنشاط بالخلفية».',
    realme:'ريلمي: الإعدادات ← البطارية ← خطوتك ربح ← «السماح بالنشاط بالخلفية».',
    vivo:'فيفو: الإعدادات ← البطارية ← استهلاك عالي بالخلفية ← فعّل خطوتك ربح.',
    infinix:'إنفينكس/تكنو: الإعدادات ← البطارية ← خطوتك ربح ← «السماح بالخلفية»، وفعّل التشغيل التلقائي.',
    tecno:'إنفينكس/تكنو: الإعدادات ← البطارية ← خطوتك ربح ← «السماح بالخلفية»، وفعّل التشغيل التلقائي.'
  };
  function paint(box){
    const st=KW.S.status,tip=TIPS[st.brand]||'';
    box.innerHTML=`<div class="setup">
      <h3>👟 شغّل عدّاد الخطوات</h3>
      <p class="muted" style="font-size:14px">3 خطوات صغار مرة وحدة بس، وبعدها بيعدّ لحاله حتى والشاشة مطفأة والتطبيق مسكّر.</p>
      <div class="st"><span>1️⃣</span><div><b>السماح بالنشاط البدني والإشعارات</b><p>حتى نقرأ حسّاس الخطوات ونحطلك العدد بالإشعار</p></div>
        ${st.activity&&st.notifications?'<span class="ok">✓ تم</span>':'<button type="button" class="btn" id="suPerm">اسمح</button>'}</div>
      <div class="st"><span>2️⃣</span><div><b>تشغيل العدّاد بالخلفية</b><p>بيطلعلك إشعار ثابت «خطوتك ربح» — هاد اللي بيخلّيه يضل شغّال</p></div>
        ${st.running?'<span class="ok">✓ شغّال</span>':`<button type="button" class="btn" id="suStart" ${st.activity?'':'disabled'}>شغّل</button>`}</div>
      <div class="st"><span>3️⃣</span><div><b>بدون توفير البطارية</b><p>حتى ما يوقفه الهاتف بالليل (الحسّاس نفسه بيصرف بطارية قليلة كتير)</p></div>
        ${st.battery?'<span class="ok">✓ تم</span>':'<button type="button" class="btn" id="suBat">اسمح</button>'}</div>
      ${tip?`<p class="tip">📱 ${tip}</p>`:''}
      <button type="button" class="btn ${st.running&&st.battery?'':'ghost'} block" id="suDone" style="margin-top:14px">${st.running?'تمام 👍':'لاحقاً'}</button>
    </div>`;
    box.querySelector('#suPerm')?.addEventListener('click',async()=>{
      try{const s=await KW.native.requestPerms();Object.assign(KW.S.status,s);
        if(!s.activity){KW.toast('لازم تسمح بالنشاط البدني. افتح إعدادات التطبيق ← الأذونات');KW.native.openAppSettings()}
        else if(!s.running){const r=await KW.native.start();Object.assign(KW.S.status,r)}
      }catch(e){KW.toast('صار خطأ: '+(e.message||e))}
      paint(box);KW.refresh();
    });
    box.querySelector('#suStart')?.addEventListener('click',async()=>{
      try{Object.assign(KW.S.status,await KW.native.start());KW.toast('العدّاد شغّال ✓')}catch(e){KW.toast('ما اشتغل: '+(e.message||e))}
      paint(box);KW.refresh();
    });
    box.querySelector('#suBat')?.addEventListener('click',()=>{KW._batAsked=true;KW.native.openBattery()});
    box.querySelector('#suDone').onclick=()=>{KW.set.seen=true;KW.save();KW.closeSheet()};
  }
  KW.openSetup=function(){const box=KW.sheet('');KW._setup=box;paint(box)};
  /* لما يرجع من شاشة البطارية حدّث الخطوات */
  KW.on(()=>{const s=document.getElementById('sheet');if(KW._setup&&!s.hidden&&s.firstChild===KW._setup)paint(KW._setup)});
})();
