/* ===== خطوتك ربح v2 · الشارات: بتنفتح حسب خطواتك ===== */
(function(){
  const KW=window.KW;
  const B=[
    {ic:'👟',t:'أول 1,000',d:'1,000 خطوة بيوم',ok:m=>m.best>=1000},
    {ic:'🚶',t:'ماشي',d:'5,000 خطوة بيوم',ok:m=>m.best>=5000},
    {ic:'🏃',t:'عشرة آلاف',d:'10,000 خطوة بيوم',ok:m=>m.best>=10000},
    {ic:'⚡',t:'صاروخ',d:'20,000 خطوة بيوم',ok:m=>m.best>=20000},
    {ic:'🔥',t:'3 أيام',d:'الهدف 3 أيام ورا بعض',ok:m=>m.streak>=3},
    {ic:'🌟',t:'أسبوع كامل',d:'الهدف 7 أيام ورا بعض',ok:m=>m.streak>=7},
    {ic:'👑',t:'شهر بطل',d:'الهدف 30 يوم ورا بعض',ok:m=>m.streak>=30},
    {ic:'🗺️',t:'100 كم',d:'مجموع 133,000 خطوة',ok:m=>m.sum>=133000},
    {ic:'🌍',t:'نص مليون',d:'مجموع 500,000 خطوة',ok:m=>m.sum>=500000}
  ];
  function meta(){
    const all=KW.allDays(),v=Object.values(all).map(Number);
    return {best:Math.max(0,...v),sum:Math.max(KW.S.total,v.reduce((a,b)=>a+b,0)),streak:KW.streak()};
  }
  let had=null;
  KW.on(()=>{
    const m=meta(),got=B.filter(b=>b.ok(m)).map(b=>b.t);
    if(had&&got.length>had.length){const n=got.find(t=>!had.includes(t));KW.toast('🏅 شارة جديدة: '+n)}
    had=got;
  });
  KW.page('badges',()=>{
    const m=meta(),el=document.getElementById('pg-badges');
    el.innerHTML=`<div class="sec"><h2>الشارات</h2><small><span class="num">${B.filter(b=>b.ok(m)).length}/${B.length}</span></small></div>
      <div class="bdg">${B.map(b=>`<div class="card ${b.ok(m)?'got':''}"><span>${b.ic}</span><b>${b.t}</b><small>${b.d}</small></div>`).join('')}</div>`;
  });
})();
