/* ===== خطوتك ربح v2 · الربط مع عدّاد الخطوات الأصلي (Android) =====
   بالتطبيق APK: الحسّاس الحقيقي بالهاتف + خدمة بالخلفية (بيعدّ والشاشة مطفأة).
   بالمتصفح: وضع تجريبي بأرقام وهمية بس للمعاينة. */
(function(){
  const KW=window.KW,cap=window.Capacitor;
  const isNative=!!(cap&&((cap.isNativePlatform&&cap.isNativePlatform())||(cap.getPlatform&&cap.getPlatform()==='android')));

  function call(m,o){
    o=o||{};
    const p=cap.Plugins&&cap.Plugins.StepCounter;
    if(p&&typeof p[m]==='function')return p[m](o);
    return cap.nativePromise('StepCounter',m,o);
  }

  /* وضع تجريبي (متصفح) */
  const demo={
    d:null,
    load(){
      if(this.d)return this.d;
      const today=new Date(),k=x=>x.toISOString().slice(0,10),h={};
      for(let i=1;i<=40;i++){const d=new Date(today);d.setDate(d.getDate()-i);h[k(d)]=Math.round(2500+Math.random()*7500)}
      return this.d={date:k(today),today:1840,total:250000,history:h,running:true};
    },
    status(){return{native:false,hasCounter:true,activity:true,notifications:true,battery:true,running:this.load().running,brand:''}},
    data(){const d=this.load();if(d.running)d.today+=Math.round(Math.random()*6);return d}
  };

  KW.native={
    isNative,
    async status(){return isNative?await call('checkStatus'):demo.status()},
    async requestPerms(){return isNative?await call('requestPerms'):demo.status()},
    async start(){if(!isNative){demo.load().running=true;return demo.status()}return await call('start')},
    async stop(){if(!isNative){demo.load().running=false;return demo.status()}return await call('stop')},
    async data(){return isNative?await call('getData'):demo.data()},
    openBattery(){return isNative?call('openBattery'):Promise.resolve()},
    openAppSettings(){return isNative?call('openAppSettings'):Promise.resolve()}
  };

  /* تحديث الأرقام: كل 3 ثواني والتطبيق مفتوح، وفوراً لما ترجع له */
  let busy=false;
  KW.refresh=async function(){
    if(busy)return;busy=true;
    try{
      const [st,d]=await Promise.all([KW.native.status(),KW.native.data()]);
      Object.assign(KW.S.status,st||{});
      KW.S.today=+d.today||0;KW.S.date=d.date||KW.S.date;KW.S.total=+d.total||0;KW.S.history=d.history||{};
      document.getElementById('live').hidden=!KW.S.status.running;
      KW.emit();
    }catch(e){console.error(e)}
    busy=false;
  };
  setInterval(()=>{if(document.visibilityState==='visible')KW.refresh()},3000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')KW.refresh()});
})();
