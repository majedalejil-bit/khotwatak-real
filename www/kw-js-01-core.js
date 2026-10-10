/* ===== خطوتك ربح v2 · الأساس: الحالة، الإعدادات، التنقل بين الصفحات، أدوات مشتركة ===== */
(function(){
  const LS='kw.settings';
  let set={goal:6000,theme:'dark',seen:false};
  try{Object.assign(set,JSON.parse(localStorage.getItem(LS))||{})}catch{}
  const S={today:0,date:'',total:0,history:{},status:{native:false,activity:false,notifications:false,battery:false,running:false,hasCounter:true,brand:''}};
  const subs=[],pages={};let cur='home';

  const KW=window.KW={
    S,set,
    save(){try{localStorage.setItem(LS,JSON.stringify(set))}catch{}},
    on(f){subs.push(f)},
    emit(){subs.forEach(f=>{try{f(S)}catch(e){console.error(e)}});if(pages[cur])try{pages[cur](S)}catch(e){console.error(e)}},
    page(id,render){pages[id]=render},
    go(id){
      cur=id;
      document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!=='pg-'+id);
      document.querySelectorAll('[data-go]').forEach(b=>b.classList.toggle('on',b.dataset.go===id));
      pages[id]?.(S);window.scrollTo(0,0);
    },
    isOn:id=>cur===id,
    fmt:n=>Math.round(+n||0).toLocaleString('en-US'),
    km:s=>(s*0.75/1000).toFixed(2),
    kcal:s=>Math.round(s*0.04),
    points:s=>Math.floor((+s||0)/100),
    /* أيام آخر n يوم (الأقدم أول) مع خطوات كل يوم */
    days(n){
      const out=[],base=S.date?new Date(S.date+'T12:00:00'):new Date();
      for(let i=n-1;i>=0;i--){
        const d=new Date(base);d.setDate(d.getDate()-i);
        const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
        out.push({k,d,steps:i===0?S.today:(+S.history[k]||0)});
      }
      return out;
    },
    allDays(){return Object.assign({},S.history,{[S.date]:S.today})},
    toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('on');clearTimeout(KW._tt);KW._tt=setTimeout(()=>el.classList.remove('on'),2600)},
    sheet(html){const s=document.getElementById('sheet');s.innerHTML='<div>'+html+'</div>';s.hidden=false;s.onclick=e=>{if(e.target===s)KW.closeSheet()};return s.firstChild},
    closeSheet(){const s=document.getElementById('sheet');s.hidden=true;s.innerHTML=''},
    applyTheme(){document.documentElement.dataset.theme=set.theme}
  };
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>KW.go(b.dataset.go));
})();
