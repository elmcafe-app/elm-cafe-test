/* ELM CAFE 1.2.0: loaded only when a related screen is opened. */
window.ELM_MODULES=window.ELM_MODULES||{};
window.ELM_MODULES.reports=function(deps){
const {Btn,EmptyState,Field,ICONS,Icon,Modal,fmtDate,fmtDateTime,locale,matches,s,tr,useEffect,useState}=deps;
function ReportsOverall({employees,cycles,evaluations,computeScore,ratingFor,onOpenEmployee,initialCycleId,cycleAwards=[],awardsReady=true,onAward}) {
    const h=React.createElement;
    const [cycleId,setCycleId]=useState(initialCycleId||cycles.find(c=>c.status==="active")?.id||cycles[0]?.id||"");
    const [filter,setFilter]=useState("all"),[query,setQuery]=useState(""),[printMarkup,setPrintMarkup]=useState(""),[printMessage,setPrintMessage]=useState(""),[awardOpen,setAwardOpen]=useState(false),[selectedWinner,setSelectedWinner]=useState(""),[savingAward,setSavingAward]=useState(false);
    useEffect(()=>{
      document.body.classList.toggle("elm-print-preview-open",Boolean(printMarkup));
      return ()=>document.body.classList.remove("elm-print-preview-open");
    },[printMarkup]);
    useEffect(()=>{if(initialCycleId)setCycleId(initialCycleId);else if(!cycleId&&cycles.length)setCycleId(cycles.find(c=>c.status==="active")?.id||cycles[0].id);},[initialCycleId,cycles]);
    const cycle=cycles.find(c=>c.id===cycleId);
    const rows=employees.map(emp=>{const evs=cycle?evaluations.filter(e=>e.employee_id===emp.id&&e.cycle_id===cycle.id&&e.status==="active"):[];const score=evs.length?computeScore(emp.id,cycle.id):null;return{emp,score,total:evs.length,rating:score===null?"لم يُقيّم":ratingFor(score)};}).sort((a,b)=>(b.score??-1)-(a.score??-1)||a.emp.name.localeCompare(b.emp.name,"ar"));
    const rated=rows.filter(r=>r.total>0),best=rated[0]||null,leaders=best?rated.filter(r=>r.score===best.score):[];
    const average=rated.length?Math.round(rated.reduce((sum,r)=>sum+r.score,0)/rated.length):null;
    const savedAward=cycleAwards.find(a=>a.cycle_id===cycleId)||null;
    useEffect(()=>{setSelectedWinner(leaders.length===1?leaders[0].emp.id:"");},[cycleId,leaders.map(r=>r.emp.id).join("|")]);
    const filtered=rows.filter(r=>(filter==="all"||(filter==="rated"?r.total>0:r.total===0))&&(matches(r.emp.name,query)||String(r.emp.employee_code||"").includes(query)));
    function exportCsv(){
      if(!cycle)return;
      const quote=value=>'"'+String(value??"").replace(/"/g,'""')+'"';
      const headers=["الترتيب","اسم الموظف","المسمى الوظيفي","الرقم الوظيفي","النتيجة من 100","عدد التقييمات","إيجابي","سلبي","التقدير"];
      const data=rows.map((r,i)=>{const evs=evaluations.filter(e=>e.employee_id===r.emp.id&&e.cycle_id===cycle.id&&e.status==="active");return[i+1,r.emp.name,r.emp.profession||"",r.emp.employee_code||"",r.score===null?"":Math.round(r.score),r.total,evs.filter(e=>e.type==="positive").length,evs.filter(e=>e.type==="negative").length,r.rating];});
      const delim=";";
      const csvRow=row=>row.map(value=>quote(typeof value==='string'?tr(value):value).replace(/^"([=+@-])/,'"\t$1')).join(delim);
      const summary=["تقرير نتائج الموظفين - ELM CAFE"];
      const reportRows=[summary,["الدورة",cycle.name],["من",fmtDate(cycle.start_date),"إلى",fmtDate(cycle.end_date)],["تاريخ التصدير",new Date().toLocaleDateString(locale())],["عدد الموظفين",rows.length,"تم تقييمهم",rated.length,"متوسط النقاط",average??"—"],[],headers,...data];
      const blob=new Blob(["\uFEFFsep=;\r\n"+reportRows.map(csvRow).join("\r\n")],{type:"text/csv;charset=utf-8"});
      const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="elm-cafe-"+String(cycle.name).replace(/[^\w\u0600-\u06FF-]+/g,"-")+".csv";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    function openPrintableReport(){
      if(!printMarkup)return;
      setPrintMessage("");
      try{window.print();}catch(_){setPrintMessage("تعذر فتح الطباعة من هذا المتصفح. افتح الموقع في Safari أو Chrome وأعد المحاولة.");}
    }
    async function confirmWinner(){
      const selected=leaders.find(r=>r.emp.id===selectedWinner);if(!selected||savingAward)return;
      setSavingAward(true);
      try{
        const evs=evaluations.filter(e=>e.employee_id===selected.emp.id&&e.cycle_id===cycle.id&&e.status==="active");
        const ok=await onAward({cycle_id:cycle.id,cycle_name:cycle.name,employee_id:selected.emp.id,employee_name:selected.emp.name,score:Math.round(selected.score),evaluation_count:selected.total,positive_count:evs.filter(e=>e.type==="positive").length,negative_count:evs.filter(e=>e.type==="negative").length,tied_employee_count:leaders.length});
        if(ok)setAwardOpen(false);
      }finally{setSavingAward(false);}
    }
    return h("div",{className:"report-screen"},
      h("section",{className:"report-head"},h("span",{className:"eyebrow"},"تحليل الأداء"),h("h1",null,"تقارير الفريق"),h("label",null,"دورة التقييم",h("select",{value:cycleId,onChange:e=>setCycleId(e.target.value)},cycles.map(c=>h("option",{key:c.id,value:c.id},c.name))))),
      !cycle?h(EmptyState,{icon:h(Icon,{svg:ICONS.file,size:28}),title:"لا توجد دورة",body:"أنشئ دورة تقييم أولًا."}):h(React.Fragment,null,
        h("div",{className:"report-stats"},[["تم تقييمهم",rated.length],["لم يُقيّموا",rows.length-rated.length],["متوسط النقاط",average??"—"]].map(([label,value])=>h("div",{key:label},h("strong",null,value),h("small",null,label)))),
        (savedAward||best)&&h("div",{className:"mvp-card"},h("span",{className:"mvp-medal"},"★"),h("span",{className:"mvp-copy"},h("small",null,savedAward?"الفائز المعتمد بالمكافأة":"أعلى نتيجة حاليًا"),h("strong",null,savedAward?savedAward.employee_name:(leaders.length>1?leaders.length+" موظفين متعادلون":best.emp.name)),h("small",null,savedAward?savedAward.chosen_by_name:(leaders.length>1?"الاختيار النهائي لك":best.emp.profession||"موظف"))),h("span",{className:"mvp-score"},savedAward?savedAward.score:Math.round(best.score),h("small",null,"من 100"))),
        savedAward&&h("div",{className:"award-snapshot-note"},h("strong",null,"النتيجة المحفوظة: "),savedAward.employee_name," · ",savedAward.score," من 100 · ",savedAward.evaluation_count," تقييم · اعتمده ",savedAward.chosen_by_name," · ",fmtDateTime(savedAward.created_at),"۔"),
        !savedAward&&cycle.status==="closed"&&h("button",{type:"button",className:"award-approve-button",disabled:!awardsReady||!leaders.length,onClick:()=>{setSelectedWinner(leaders.length===1?leaders[0].emp.id:"");setAwardOpen(true);}},leaders.length>1?"اختيار الفائز من المتعادلين":"اعتماد الفائز وحفظ النتيجة"),
        !savedAward&&cycle.status!=="closed"&&h("div",{className:"award-setup-note"},"اعتماد الفائز يظهر بعد إغلاق الدورة. لا يوجد حد أدنى للتقييمات."),
        !awardsReady&&h("div",{className:"award-setup-note"},"لتفعيل سجل الفائز المحفوظ، شغّل ملف إعداد سجل الفائز في Supabase."),
        h("div",{className:"report-toolbar"},h("div",null,h("span",{className:"eyebrow"},"تفاصيل الدورة"),h("h2",null,"الموظفون")),h("div",{className:"report-actions"},h("button",{className:"text-action",type:"button",onClick:exportCsv},"تنزيل بيانات التقرير (CSV)"),h("button",{className:"text-action",type:"button",onClick:()=>{const section=document.querySelector(".report-screen .print-report");if(section)setPrintMarkup(section.innerHTML);}},"معاينة وطباعة التقرير"))),
        h("input",{className:"modern-search",value:query,onChange:e=>setQuery(e.target.value),placeholder:"ابحث عن موظف","aria-label":"بحث التقارير"}),
        h("div",{className:"segmented"},[["all","الكل"],["rated","تم تقييمهم"],["pending","لم يُقيّموا"]].map(([key,label])=>h("button",{key,type:"button",className:filter===key?"selected":"",onClick:()=>setFilter(key)},label))),
        h("section",{className:"print-report","aria-label":"تقرير الدورة للطباعة"},
          h("header",{className:"print-report-head"},h("div",null,h("small",null,"ELM CAFE · تقرير تقييم الموظفين"),h("h1",null,cycle.name),h("p",null,"الفترة: ",fmtDate(cycle.start_date)," — ",fmtDate(cycle.end_date))),h("div",{className:"print-report-stamp"},"تاريخ الطباعة",h("strong",null,new Date().toLocaleDateString(locale())))),
          h("div",{className:"print-report-summary"},[["إجمالي الموظفين",rows.length],["تم تقييمهم",rated.length],["لم يُقيّموا",rows.length-rated.length],["متوسط النقاط",average??"—"]].map(([label,value])=>h("div",{key:label},h("small",null,label),h("strong",null,value)))),
          savedAward&&h("div",{className:"print-award"},"الفائز المعتمد بالمكافأة: ",h("strong",null,savedAward.employee_name)," — ",savedAward.score," من 100"),
          h("h2",null,"نتائج الموظفين"),
          h("table",{className:"print-report-table"},h("thead",null,h("tr",null,["م","الموظف","الوظيفة","رقم الموظف","النتيجة","عدد التقييمات","التقدير"].map(label=>h("th",{key:label},label)))),h("tbody",null,rows.map((r,index)=>h("tr",{key:r.emp.id},h("td",null,index+1),h("td",null,r.emp.name),h("td",null,r.emp.profession||"—"),h("td",null,r.emp.employee_code||"—"),h("td",null,r.score===null?"—":Math.round(r.score)+" / 100"),h("td",null,r.total),h("td",null,r.rating))))),
          h("footer",null,"يعرض التقرير التقييمات النشطة فقط. التقييمات الملغاة لا تدخل في النتيجة.")),
        filtered.length?h("div",{className:"report-grid"},filtered.map(r=>h("button",{key:r.emp.id,type:"button",className:"report-tile",onClick:()=>onOpenEmployee(r.emp.id)},h("span",{className:"report-rank"},r.total?"#"+(rows.indexOf(r)+1):"—"),h("span",{className:"report-score"},r.score===null?"—":Math.round(r.score),h("small",null,r.score===null?"بلا تقييم":"/ 100")),h("strong",null,r.emp.name),h("small",null,r.emp.profession||"موظف"),h("span",{className:r.total?"status-chip done":"status-chip"},r.total?r.total+" تقييم · "+r.rating:"لم يُقيّم بعد")))):h("div",{className:"dash-empty"},"لا توجد نتائج مطابقة.")),
      printMarkup&&ReactDOM.createPortal(h("div",{className:"report-print-preview",role:"dialog","aria-modal":true,"aria-label":"معاينة تقرير الدورة"},h("div",{className:"report-preview-toolbar"},h("button",{type:"button",onClick:openPrintableReport},"فتح الطباعة / حفظ PDF"),h("button",{type:"button",onClick:()=>{setPrintMarkup("");setPrintMessage("");}},"إغلاق المعاينة")),printMessage&&h("p",{className:"report-print-message",role:"status"},printMessage),h("div",{className:"report-preview-page"},h("section",{className:"print-report",dangerouslySetInnerHTML:{__html:printMarkup}}))),document.body),
      awardOpen&&h(Modal,{title:leaders.length>1?"اختيار الفائز من المتعادلين":"تأكيد الفائز بالدورة",onClose:()=>!savingAward&&setAwardOpen(false),footer:h(React.Fragment,null,h(Btn,{variant:"primary",disabled:!selectedWinner||savingAward,onClick:confirmWinner},savingAward?"جارِ الحفظ…":"حفظ واعتماد الفائز"),h(Btn,{variant:"ghost",disabled:savingAward,onClick:()=>setAwardOpen(false)},"رجوع"))},
        h("div",{className:"award-candidate-list"},leaders.map(r=>h("label",{key:r.emp.id,className:"award-candidate "+(selectedWinner===r.emp.id?"selected":"")},h("input",{type:"radio",name:"cycle-winner",value:r.emp.id,checked:selectedWinner===r.emp.id,onChange:()=>setSelectedWinner(r.emp.id)}),h("span",null,h("strong",null,r.emp.name),h("small",null,r.emp.profession||"موظف"," · ",r.total," تقييم")),h("b",null,Math.round(r.score)," / 100")))),
        h("p",{className:"award-modal-note"},leaders.length>1?"النتيجة متعادلة؛ اختار الفائز بنفسك. لن يختار التطبيق تلقائيًا.":"سيحفظ التطبيق اسم الفائز ونتيجته وعدد تقييماته وقت الاعتماد.")));
  }
function EvaluatorActivityScreen({ evaluations, activeCycle, cycles }) {
    const h=React.createElement;
    const [cycleId,setCycleId]=useState(activeCycle?.id||cycles[0]?.id||"");
    useEffect(()=>{if(!cycles.some(c=>c.id===cycleId)&&cycles.length)setCycleId(activeCycle?.id||cycles[0].id);},[cycles,activeCycle,cycleId]);
    const cycle=cycles.find(c=>c.id===cycleId);
    const evs=cycle?evaluations.filter(e=>e.cycle_id===cycle.id&&e.status==="active"):[];
    const grouped={};
    evs.forEach(e=>{
      const id=e.evaluator_id||e.evaluator_name||"unknown";
      if(!grouped[id])grouped[id]={id,name:e.evaluator_name||"مقيم",positive:0,negative:0,total:0,positivePoints:0,negativePoints:0};
      const row=grouped[id];row.total++;
      if(e.type==="positive"){row.positive++;row.positivePoints+=Number(e.category_points)||0;}
      else {row.negative++;row.negativePoints+=Number(e.category_points)||0;}
    });
    const rows=Object.values(grouped).map(r=>({...r,positiveRate:r.total?Math.round(r.positive/r.total*100):0,net:r.positivePoints-r.negativePoints,avgNet:r.total?(r.positivePoints-r.negativePoints)/r.total:0})).sort((a,b)=>b.total-a.total);
    const teamAvg=rows.length?rows.reduce((sum,r)=>sum+r.avgNet,0)/rows.length:0;
    return h("div",{className:"evaluator-compare"},h(Field,{label:"الدورة"},h("select",{style:s.input,value:cycleId,onChange:e=>setCycleId(e.target.value)},cycles.map(c=>h("option",{key:c.id,value:c.id},c.name)))),
      h("div",{className:"compare-intro"},h("strong",null,"نشاط المقيمين"),h("p",null,"الأرقام للمقارنة والمراجعة فقط؛ اختلاف عدد التقييمات أو نتيجتها لا يثبت وحده أن التقييم غير صحيح.")),
      !cycle||!rows.length?h(EmptyState,{icon:h(Icon,{svg:ICONS.chart,size:28}),title:"لا يوجد نشاط بعد",body:"لا توجد تقييمات نشطة في هذه الدورة."}):h("div",{className:"compare-list"},rows.map(r=>{
        const rateText=`${r.positiveRate}٪ إيجابي`;
        const diff=r.avgNet-teamAvg;
        return h("article",{key:r.id,className:"compare-card"},h("div",{className:"compare-card-head"},h("strong",null,r.name),h("span",null,r.total," تقييم")),
          h("div",{className:"compare-meter"},h("span",{style:{width:`${r.positiveRate}%`}})),
          h("div",{className:"compare-metrics"},h("span",{className:"positive-text"},"+",r.positive," إيجابي · ",r.positivePoints," نقطة"),h("span",{className:"negative-text"},"−",r.negative," سلبي · ",r.negativePoints," نقطة")),
          h("div",{className:"compare-footer"},h("span",null,rateText),h("span",null,"متوسط الأثر الصافي ",diff>0?"+":"",diff.toFixed(1)," نقطة/تقييم")));
      })));
  }
return {ReportsOverall,EvaluatorActivityScreen};
};
