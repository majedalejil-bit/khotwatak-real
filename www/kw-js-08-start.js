/* ===== خطوتك ربح v2 · بداية التطبيق ===== */
(function(){
  const KW=window.KW;
  KW.applyTheme();
  KW.go('home');
  KW.refresh().then(async()=>{
    const st=KW.S.status;
    /* إذا كان شغّال قبل وانسكّر (أو تحدّث التطبيق) رجّعه */
    if(st.native&&st.auto&&st.activity&&!st.running){try{Object.assign(st,await KW.native.start());KW.refresh()}catch{}}
    if(!st.running||!st.activity||(!st.battery&&!KW.set.seen))KW.openSetup();
  });
})();
