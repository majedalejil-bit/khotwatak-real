/* ===== خطوتك ربح v2 · الإحصائيات: أسبوع / شهر، المعدل، أفضل يوم، أيام متتالية ===== */
(function(){
  const KW=window.KW;let range=7;
  const DN=['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];
  KW.streak=function(){
    const g=KW.set.goal,ds=KW.days(400).reverse();let n=0;
    for(let i=0;i<ds.length;i++){if(ds[i].steps>=g)n++;else if(i===0)continue;else break}
    return n;
  };
  KW.page('stats',S=>{
    const el=document.getElementById('pg-stats'),g=KW.set.goal,ds=KW.days(range);
    const sum=ds.reduce((a,x)=>a+x.steps,0),mx=Math.max(g,...ds.map(x=>x.steps)),best=ds.reduce((a,x)=>x.steps>a.steps?x:a,ds[0]);
    const act=ds.filter(x=>x.steps>0).length||1,hit=ds.filter(x=>x.steps>=g).length;
    el.innerHTML=`
      <div class="sec"><h2>إحصائياتك</h2><div class="seg"><button type="button" data-r="7" class="${range===7?'on':''}">أسبوع</button><button type="button" data-r="30" class="${range===30?'on':''}">شهر</button></div></div>
      <div class="card"><div class="bars" style="grid-template-columns:repeat(${ds.length},1fr);gap:${range===7?8:3}px">
        ${ds.map((x,i)=>`<div class="bar"><em class="num">${range===7&&x.steps?(x.steps/1000).toFixed(1)+'k':''}</em>
          <i class="${x.steps>=g?'hit':''} ${i===ds.length-1?'today':''}" style="height:${Math.max(2,x.steps/mx*100)}%"></i>
          <small>${range===7?DN[x.d.getDay()]:(i%5===4?x.d.getDate():'')}</small></div>`).join('')}
      </div></div>
      <div class="kpis" style="margin-top:12px">
        <div class="card"><b class="num">${KW.fmt(sum)}</b><small>مجموع الخطوات</small></div>
        <div class="card"><b class="num">${KW.fmt(sum/act)}</b><small>المعدل باليوم</small></div>
        <div class="card"><b class="num">${KW.fmt(best.steps)}</b><small>أفضل يوم</small></div>
        <div class="card"><b class="num">${hit}/${ds.length}</b><small>أيام حققت فيها الهدف</small></div>
        <div class="card"><b class="num">${KW.km(sum)}</b><small>كم مشيت</small></div>
        <div class="card"><b class="num">🔥 ${KW.streak()}</b><small>أيام متتالية بالهدف</small></div>
      </div>`;
    el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{range=+b.dataset.r;KW.go('stats')});
  });
})();
