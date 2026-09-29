/* ELM CAFE 1.2.0: loaded only when a related screen is opened. */
window.ELM_MODULES=window.ELM_MODULES||{};
window.ELM_MODULES.management=function(deps){
const {Btn,EmptyState,Field,ICONS,Icon,Modal,PERMISSION_DEFS,Switch,avatarColor,emptyPerms,fmtDate,s,tr,useEffect,useRef,useState}=deps;
function AdminEmployees({ employees, canEdit, onAdd, onUpdate, onArchive, onDelete }) {
    const [open, setOpen] = useState(false);
    const [editTarget,setEditTarget]=useState(null);
    const submitLock=useRef(false);
    const openEditor=(employee=null)=>{
      setEditTarget(employee);setName(employee?.name||"");setNameEn(employee?.name_en||"");setEmpId(String(employee?.employee_code||""));setProfession(employee?.profession||"");setErr("");setOpen(true);
    };
    const [name, setName] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [empId, setEmpId] = useState("");
    const [profession, setProfession] = useState("");
    const [err, setErr] = useState("");
    const [archiveTarget, setArchiveTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [confirmText, setConfirmText] = useState("");
    const [saving, setSaving] = useState(false);
    async function submit(e) {
      e?.preventDefault?.();if(submitLock.current)return;
      if(!name.trim()||!empId.trim()||!profession.trim()){setErr("املأ كل الحقول");return;}
      submitLock.current=true;setSaving(true);setErr("");
      const payload={name:name.trim(),employee_code:empId.trim(),profession:profession.trim(),...(canEdit?{name_en:nameEn.trim()}:{} )};
      try{const ok=editTarget?await onUpdate(editTarget.id,payload):await onAdd({...payload,archived:false});if(ok===true){setOpen(false);setEditTarget(null);}else setErr("لم يتم الحفظ. بياناتك ما زالت موجودة؛ راجع الخطأ وحاول مجددًا.");}
      catch(_){setErr("تعذّر الاتصال. بياناتك لم تُمسح.");}
      finally{submitLock.current=false;setSaving(false);}
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", style: { width: "100%", marginBottom: 14 }, onClick: () => openEditor() }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.plus, size: 16 }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0638\u0641"), !employees.length ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.users, size: 28 }), title: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0638\u0641\u0648\u0646", body: "\u0627\u0628\u062F\u0623 \u0628\u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0644 \u0645\u0648\u0638\u0641." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, employees.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.id, style: { ...s.rowCard, cursor: "default" } }, /* @__PURE__ */ React.createElement("div", { style: { ...s.avatarCircle, background: avatarColor(e.name).bg, color: avatarColor(e.name).fg } }, tr(e.name).slice(0,1)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, e.name, " ", e.archived && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-3)", fontWeight: 400, fontSize: 12 } }, "(\u0645\u0624\u0631\u0634\u0641)")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)" } }, e.profession, " \xB7 \u0631\u0642\u0645 ", e.employee_code)), canEdit && React.createElement(Btn,{variant:"ghost",onClick:()=>openEditor(e)},"تعديل"), /* @__PURE__ */ React.createElement("button", { onClick: () => setArchiveTarget(e), style: s.iconBtn, "aria-label": "\u0623\u0631\u0634\u0641\u0629" }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.archive, size: 16, color: e.archived ? "var(--forest)" : "var(--ink-3)" })), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setDeleteTarget(e);
      setConfirmText("");
    }, style: s.iconBtn, "aria-label": "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A" }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.trash, size: 16, color: "var(--red)" }))))), open && /* @__PURE__ */ React.createElement(Modal, { title: editTarget ? "تعديل بيانات الموظف" : "إضافة موظف", onClose: () => !saving && setOpen(false), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: submit, disabled: saving }, saving ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", disabled:saving,onClick: () => !saving && setOpen(false) }, "\u0625\u0644\u063A\u0627\u0621")) }, /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0638\u0641" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ canEdit && React.createElement(Field, { label: "\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }, /* @__PURE__ */ React.createElement("input", { style: { ...s.input, direction: "ltr", textAlign: "left" }, value: nameEn, onChange: (e) => setNameEn(e.target.value), autoCapitalize: "words" })), /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0648\u0638\u064A\u0641\u064A" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: empId, onChange: (e) => setEmpId(e.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: profession, onChange: (e) => setProfession(e.target.value) })), err && /* @__PURE__ */ React.createElement("div", { style: s.errText }, err)), archiveTarget && /* @__PURE__ */ React.createElement(Modal, { title: archiveTarget.archived ? "\u0625\u0639\u0627\u062F\u0629 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u0648\u0638\u0641" : "\u0623\u0631\u0634\u0641\u0629 \u0627\u0644\u0645\u0648\u0638\u0641", onClose: () => setArchiveTarget(null), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: archiveTarget.archived ? "primary" : "danger", onClick: async () => {
      if(await onArchive(archiveTarget.id, !archiveTarget.archived)===true)setArchiveTarget(null);
    } }, archiveTarget.archived ? "\u062A\u0623\u0643\u064A\u062F \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0639\u064A\u0644" : "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0623\u0631\u0634\u0641\u0629"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setArchiveTarget(null) }, "\u062A\u0631\u0627\u062C\u0639")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)" } }, archiveTarget.archived ? `\u0633\u064A\u0638\u0647\u0631 "${archiveTarget.name}" \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646 \u0627\u0644\u0646\u0634\u0637\u064A\u0646.` : `\u0644\u0646 \u064A\u0638\u0647\u0631 "${archiveTarget.name}" \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646\u060C \u0644\u0643\u0646 \u0633\u062C\u0644 \u062A\u0642\u064A\u064A\u0645\u0627\u062A\u0647 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u064A\u0628\u0642\u0649 \u0645\u062D\u0641\u0648\u0638\u064B\u0627 \u0628\u0627\u0644\u0643\u0627\u0645\u0644.`)), deleteTarget && /* @__PURE__ */ React.createElement(Modal, { title: "\u062D\u0630\u0641 \u0627\u0644\u0645\u0648\u0638\u0641 \u0646\u0647\u0627\u0626\u064A\u064B\u0627", onClose: () => setDeleteTarget(null), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", disabled: ![deleteTarget.name.trim(),tr(deleteTarget.name).trim()].includes(confirmText.trim()), onClick: async () => {
      if(await onDelete(deleteTarget.id, deleteTarget.name)===true)setDeleteTarget(null);
    } }, "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A \u2014 \u0644\u0627 \u0631\u062C\u0648\u0639"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setDeleteTarget(null) }, "\u062A\u0631\u0627\u062C\u0639")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--red)", marginBottom: 12, fontWeight: 600 } }, '\u0647\u0630\u0627 \u0633\u064A\u062D\u0630\u0641 "', deleteTarget.name, '" \u0648\u0643\u0644 \u062A\u0642\u064A\u064A\u0645\u0627\u062A\u0647 \u0644\u0644\u0623\u0628\u062F. \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621. \u0644\u0648 \u062A\u0642\u0635\u062F \u0625\u0628\u0639\u0627\u062F\u0647 \u0641\u0642\u0637\u060C \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0623\u0631\u0634\u0641\u0629 \u0628\u062F\u0644\u064B\u0627 \u0645\u0646 \u0630\u0644\u0643.'), /* @__PURE__ */ React.createElement(Field, { label: `\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0638\u0641 "${deleteTarget.name}" \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0644\u062A\u0623\u0643\u064A\u062F` }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: confirmText, onChange: (e) => setConfirmText(e.target.value) }))));
  }
function AdminUsers({ profiles, userLookup, ownId, onAdd, onToggle, onDelete, onUpdatePermissions }) {
    const h=React.createElement;
    const [open,setOpen]=useState(false),[name,setName]=useState(""),[username,setUsername]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[role,setRole]=useState("evaluator"),[err,setErr]=useState("");
    const [newPerms,setNewPerms]=useState(emptyPerms()),[permTarget,setPermTarget]=useState(null),[editPerms,setEditPerms]=useState(emptyPerms());
    const [infoId,setInfoId]=useState(null),[deleteTarget,setDeleteTarget]=useState(null),[confirmText,setConfirmText]=useState(""),[saving,setSaving]=useState(false),[busyId,setBusyId]=useState(null);
    const accountSubmitLock=useRef(false);
    const infoUser=profiles.find(u=>u?.id===infoId);
    async function submit(e){
      e?.preventDefault?.();if(accountSubmitLock.current)return;
      if(!name.trim()||!/^[a-z0-9_.-]{3,40}$/.test(username.trim().toLowerCase())||!/^\S+@\S+\.\S+$/.test(email.trim())||password.length<8){setErr("أكمل الاسم واسم دخول من 3 أحرف إنجليزية على الأقل وبريدًا صحيحًا وكلمة مرور من 8 أحرف على الأقل.");return;}
      accountSubmitLock.current=true;setSaving(true);
      try{const ok=await onAdd({name:name.trim(),username:username.trim(),email:email.trim(),password,role,permissions:newPerms});if(ok!==false){setOpen(false);setName("");setUsername("");setEmail("");setPassword("");setRole("evaluator");setNewPerms(emptyPerms());setErr("");}}
      catch(error){setErr(error?.message||"تعذرت إضافة المستخدم. حاول مرة أخرى.");}
      finally{setSaving(false);accountSubmitLock.current=false;}
    }
    function openPerms(u){setPermTarget(u);setEditPerms({canManageEmployees:!!u.can_manage_employees,canCreateCycle:!!u.can_create_cycle,canEditCategories:!!u.can_edit_categories,canManageAllEvaluations:!!u.can_manage_all_evaluations});}
    async function toggleUser(u){if(busyId||u.id===ownId)return;setBusyId(u.id);try{await onToggle(u.id,!u.active);}finally{setBusyId(null);}}
    function requestDelete(u){if(u.id===ownId||u.active)return;setInfoId(null);setDeleteTarget(u);setConfirmText("");}
    const field=(label,value)=>h("div",{key:label},h("small",null,label),h("strong",null,value||"—"));
    return h("div",{className:"account-management"},
      h(Btn,{variant:"primary",style:{width:"100%",marginBottom:12},onClick:()=>setOpen(true)},h(Icon,{svg:ICONS.plus,size:16})," إضافة مستخدم"),
      h("div",{style:{display:"grid",gap:8}},profiles.filter(Boolean).map(u=>h("div",{key:u.id,style:{...s.rowCard,cursor:"default",width:"100%",boxSizing:"border-box"}},
        h("button",{type:"button",onClick:()=>setInfoId(u.id),style:{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,background:"none",border:0,padding:0,cursor:"pointer",textAlign:"start",color:"var(--ink)"}},h("div",{style:{...s.avatarCircle,background:avatarColor(u.name).bg,color:avatarColor(u.name).fg,flex:"none"}},u.name.slice(0,1)),h("span",{style:{display:"grid",gap:3,minWidth:0}},h("strong",{style:{fontSize:14}},u.name),h("small",{style:{fontSize:11,color:"var(--ink-3)"}},u.role==="super_admin"?"مدير أعلى":"مقيّم",u.active?" · نشط":" · معطّل"))),
        u.id!==ownId&&h("button",{type:"button",onClick:()=>openPerms(u),style:s.iconBtn,"aria-label":`صلاحيات ${u.name}`},h(Icon,{svg:ICONS.shield,size:17}))))),
      infoUser&&(()=>{const lookup=userLookup.find(l=>l.user_id===infoUser.id),perms=PERMISSION_DEFS.filter(p=>infoUser[p.key.replace(/([A-Z])/g,m=>"_"+m.toLowerCase())]);return h(Modal,{title:"بيانات الحساب",account:true,onClose:()=>setInfoId(null),footer:h(React.Fragment,null,
        infoUser.id!==ownId&&h(Btn,{variant:infoUser.active?"danger":"primary",disabled:busyId===infoUser.id,onClick:()=>toggleUser(infoUser)},busyId===infoUser.id?"جارِ التحديث…":infoUser.active?"إيقاف الحساب":"تفعيل الحساب"),
        infoUser.id!==ownId&&!infoUser.active&&h(Btn,{variant:"danger",onClick:()=>requestDelete(infoUser)},"حذف الوصول"),
        h(Btn,{variant:"ghost",onClick:()=>setInfoId(null)},"إغلاق"))},
        h("div",{className:"account-details"},h("div",{className:"account-details-hero"},h("div",{style:{...s.avatarCircle,background:avatarColor(infoUser.name).bg,color:avatarColor(infoUser.name).fg}},infoUser.name.slice(0,1)),h("span",null,h("strong",null,infoUser.name),h("small",null,infoUser.active?"حساب نشط":"حساب معطّل"))),
        h("div",{className:"account-details-grid"},field("اسم الدخول",lookup?.username),field("الدور",infoUser.role==="super_admin"?"مدير أعلى":"مقيّم"),field("البريد الإلكتروني",lookup?.email),field("تاريخ الإنشاء",infoUser.created_at?fmtDate(infoUser.created_at):"—")),
        infoUser.role!=="super_admin"&&h("div",{className:"account-permissions"},h("strong",null,"الصلاحيات الإضافية"),h("div",null,perms.length?perms.map(p=>p.label).join(" · "):"لا توجد صلاحيات إضافية")),
        infoUser.id===ownId&&h("small",null,"هذا حسابك؛ لا يمكن إيقافه أو حذفه من هنا.")));
      })(),
      open&&h(Modal,{title:"إضافة مستخدم",account:true,onClose:()=>!saving&&setOpen(false),footer:h(React.Fragment,null,h(Btn,{variant:"primary",onClick:submit,disabled:saving},saving?"جارِ الحفظ…":"حفظ المستخدم"),h(Btn,{variant:"ghost",onClick:()=>setOpen(false),disabled:saving},"إلغاء"))},
        h(Field,{label:"الاسم"},h("input",{style:s.input,value:name,onChange:e=>setName(e.target.value)})),
        h(Field,{label:"اسم الدخول (دون مسافات)"},h("input",{style:s.input,value:username,onChange:e=>setUsername(e.target.value.replace(/\s/g,""))})),
        h(Field,{label:"البريد الإلكتروني لاسترجاع كلمة المرور"},h("input",{type:"email",style:s.input,value:email,onChange:e=>setEmail(e.target.value),placeholder:"example@gmail.com"})),
        h(Field,{label:"كلمة المرور"},h("input",{type:"password",style:s.input,value:password,onChange:e=>setPassword(e.target.value)})),
        h(Field,{label:"الدور"},h("select",{style:s.input,value:role,onChange:e=>setRole(e.target.value)},h("option",{value:"evaluator"},"مقيّم"),h("option",{value:"super_admin"},"مدير أعلى"))),
        role==="evaluator"&&h("div",{style:{marginTop:8}},h("strong",null,"صلاحيات إضافية (اختياري)"),PERMISSION_DEFS.map(p=>h(Switch,{key:p.key,checked:newPerms[p.key],onChange:v=>setNewPerms({...newPerms,[p.key]:v}),label:p.label,description:p.description}))),
        err&&h("div",{style:s.errText},err)),
      permTarget&&h(Modal,{title:`صلاحيات ${permTarget.name}`,account:true,onClose:()=>setPermTarget(null),footer:h(React.Fragment,null,h(Btn,{variant:"primary",onClick:async()=>{if(busyId)return;setBusyId(permTarget.id);try{const ok=await onUpdatePermissions(permTarget.id,editPerms);if(ok!==false)setPermTarget(null);}finally{setBusyId(null);}},disabled:busyId===permTarget.id},busyId===permTarget.id?"جارِ الحفظ…":"حفظ الصلاحيات"),h(Btn,{variant:"ghost",onClick:()=>setPermTarget(null)},"إلغاء"))},PERMISSION_DEFS.map(p=>h(Switch,{key:p.key,checked:editPerms[p.key],onChange:v=>setEditPerms({...editPerms,[p.key]:v}),label:p.label,description:p.description}))),
      deleteTarget&&h(Modal,{title:"حذف وصول المستخدم للتطبيق",account:true,onClose:()=>setDeleteTarget(null),footer:h(React.Fragment,null,h(Btn,{variant:"danger",disabled:![deleteTarget.name.trim(),tr(deleteTarget.name).trim()].includes(confirmText.trim())||!!busyId,onClick:async()=>{if(busyId)return;setBusyId(deleteTarget.id);try{const ok=await onDelete(deleteTarget.id,deleteTarget.name);if(ok!==false)setDeleteTarget(null);}finally{setBusyId(null);}}},busyId===deleteTarget.id?"جارِ الحذف…":"تأكيد حذف الوصول"),h(Btn,{variant:"ghost",onClick:()=>setDeleteTarget(null)},"تراجع"))},h("p",{style:{fontSize:13,lineHeight:1.7,color:"var(--red)"}},"الحذف يمنع الوصول للتطبيق. لو لدى المستخدم تقييمات سابقة، استخدم إيقاف الحساب للحفاظ على السجل. حساب Supabase Auth منفصل."),h(Field,{label:`اكتب اسم "${deleteTarget.name}" كاملًا للتأكيد`},h("input",{style:s.input,value:confirmText,onChange:e=>setConfirmText(e.target.value)}))));
  }
function AdminCategories({ canEditNames, categories, ratingBands, onAddCategory, onUpdateCategory, onUpdateBands, onArchiveCategory, onArchiveBand }) {
    const [editCategory,setEditCategory]=useState(null),[editEnglish,setEditEnglish]=useState(""),[nameSaving,setNameSaving]=useState(false),[nameError,setNameError]=useState("");
    const nameLock=useRef(false);
    const saveEnglish=async()=>{if(nameLock.current)return;nameLock.current=true;setNameSaving(true);setNameError("");try{const ok=await onUpdateCategory(editCategory.id,{name_en:editEnglish.trim()||null});if(ok===true)setEditCategory(null);else setNameError("تعذّر حفظ الاسم الإنجليزي");}catch(_){setNameError("تعذّر الاتصال. بياناتك لم تُمسح.");}finally{nameLock.current=false;setNameSaving(false);}};
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [type, setType] = useState("negative");
    const [points, setPoints] = useState(2);
    const [editPoints, setEditPoints] = useState({});
    const [bands, setBands] = useState(ratingBands);
    const [saving, setSaving] = useState(false);
    const [pendingArchive,setPendingArchive]=useState(null);
    useEffect(() => {
      setBands(ratingBands);
    }, [ratingBands]);
    async function submit(e) {
      e.preventDefault();
      if (saving || !name.trim() || !points) return;
      setSaving(true);
      let ok;
      try { ok = await onAddCategory({ name: name.trim(), ...(nameEn.trim() ? { name_en: nameEn.trim() } : {}), type, points: Number(points), active: true }); }
      finally { setSaving(false); }
      if (ok === false) return;
      setOpen(false);
      setName("");
      setNameEn("");
      setType("negative");
      setPoints(2);
    }
    return /* @__PURE__ */ React.createElement("div", null, editCategory&&React.createElement(Modal,{title:"تعديل الاسم الإنجليزي",onClose:()=>!nameSaving&&setEditCategory(null),footer:React.createElement(Btn,{disabled:nameSaving,onClick:saveEnglish},nameSaving?"جارِ الحفظ…":"حفظ")},React.createElement(Field,{label:"الاسم بالإنجليزية (اختياري)"},React.createElement("input",{style:s.input,dir:"ltr",value:editEnglish,onChange:e=>setEditEnglish(e.target.value)})),nameError&&React.createElement("p",{role:"alert"},nameError)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 } }, "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)", marginBottom: 10 } }, "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0646\u0642\u0627\u0637 \u064A\u0624\u062B\u0631 \u0639\u0644\u0649 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0641\u0642\u0637."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 } }, categories.map((c) => {
      var _a;
      return /* @__PURE__ */ React.createElement("div", { key: c.id, style: s.card }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, c.name, " ", !c.active && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-3)", fontWeight: 400, fontSize: 12 } }, "(\u0645\u0639\u0637\u0651\u0644)")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: c.type === "positive" ? "var(--green)" : "var(--red)" } }, c.type === "positive" ? "\u0625\u064A\u062C\u0627\u0628\u064A" : "\u0633\u0644\u0628\u064A")), canEditNames&&React.createElement(Btn,{variant:"ghost",onClick:()=>{setEditCategory(c);setEditEnglish(c.name_en||"");setNameError("");}},"تعديل الاسم الإنجليزي"), /* @__PURE__ */ React.createElement("button", { onClick: () => onUpdateCategory(c.id, { active: !c.active }), style: s.iconBtn }, /* @__PURE__ */ React.createElement(Icon, { svg: c.active ? ICONS.lock : ICONS.unlock, size: 15, color: c.active ? "var(--ink-3)" : "var(--forest)" })), /* @__PURE__ */ React.createElement("button", {onClick:()=>setPendingArchive({type:"category",id:c.id,label:c.name}),style:s.iconBtn,"aria-label":"نقل التصنيف للسلة"}, /* @__PURE__ */ React.createElement(Icon,{svg:ICONS.trash,size:15,color:"var(--red)"}))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10, alignItems: "center" } }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", style: { ...s.input, width: 80 }, value: (_a = editPoints[c.id]) != null ? _a : c.points, onChange: (e) => setEditPoints({ ...editPoints, [c.id]: e.target.value }) }), /* @__PURE__ */ React.createElement(Btn, { onClick: () => {
        var _a2;
        return onUpdateCategory(c.id, { points: Number((_a2 = editPoints[c.id]) != null ? _a2 : c.points) });
      } }, "\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0646\u0642\u0627\u0637")));
    })), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", style: { width: "100%", marginBottom: 20 }, onClick: () => setOpen(true) }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.plus, size: 16 }), " \u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641 \u062C\u062F\u064A\u062F"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 } }, "\u0646\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 } }, bands.map((b, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement("input", { type: "number", style: { ...s.input, width: 60 }, value: b.min, onChange: (e) => {
      const nb = [...bands];
      nb[i] = { ...b, min: Number(e.target.value) };
      setBands(nb);
    } }), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-3)" } }, "\u2014"), /* @__PURE__ */ React.createElement("input", { type: "number", style: { ...s.input, width: 60 }, value: b.max, onChange: (e) => {
      const nb = [...bands];
      nb[i] = { ...b, max: Number(e.target.value) };
      setBands(nb);
    } }), /* @__PURE__ */ React.createElement("input", { style: { ...s.input, flex: 1 }, value: b.label, onChange: (e) => {
      const nb = [...bands];
      nb[i] = { ...b, label: e.target.value };
      setBands(nb);
    } }), /* @__PURE__ */ React.createElement("button", {onClick:()=>{const midpoint=Math.floor((b.min+b.max)/2);if(midpoint>=b.max)return;const next=[...bands];next.splice(i,1,{...b,max:midpoint},{id:null,min:midpoint+1,max:b.max,label:"نطاق جديد"});setBands(next);},disabled:b.max-b.min<1,style:s.iconBtn,"aria-label":"تقسيم النطاق وإضافة نطاق جديد"}, /* @__PURE__ */ React.createElement(Icon,{svg:ICONS.plus,size:15,color:"var(--forest)"})), /* @__PURE__ */ React.createElement("button", {onClick:()=>setPendingArchive({type:"band",id:b.id,label:b.label}),disabled:bands.length<2 || !b.id,style:s.iconBtn,"aria-label":"نقل النطاق للسلة"}, /* @__PURE__ */ React.createElement(Icon,{svg:ICONS.trash,size:15,color:"var(--red)"}))))), /* @__PURE__ */ React.createElement(Btn, { onClick: async () => { if(saving)return;setSaving(true);try{await onUpdateBands(bands);}finally{setSaving(false);} }, disabled:saving, style: { width: "100%" } }, saving ? "جارِ الحفظ…" : "\u062D\u0641\u0638 \u0627\u0644\u0646\u0637\u0627\u0642\u0627\u062A"), open && /* @__PURE__ */ React.createElement(Modal, { title: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641", onClose: () => setOpen(false), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: submit, disabled: saving }, saving ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setOpen(false) }, "\u0625\u0644\u063A\u0627\u0621")) }, /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0627\u0633\u0645" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }, /* @__PURE__ */ React.createElement("input", { style: { ...s.input, direction: "ltr", textAlign: "left" }, value: nameEn, onChange: (e) => setNameEn(e.target.value), autoCapitalize: "words" })), /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0646\u0648\u0639" }, /* @__PURE__ */ React.createElement("select", { style: s.input, value: type, onChange: (e) => setType(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "negative" }, "\u0633\u0644\u0628\u064A"), /* @__PURE__ */ React.createElement("option", { value: "positive" }, "\u0625\u064A\u062C\u0627\u0628\u064A"))), /* @__PURE__ */ React.createElement(Field, { label: "\u0639\u062F\u062F \u0627\u0644\u0646\u0642\u0627\u0637" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", style: s.input, value: points, onChange: (e) => setPoints(e.target.value) }))), pendingArchive && /* @__PURE__ */ React.createElement(Modal,{title:"نقل إلى سلة المهملات",onClose:()=>setPendingArchive(null),footer: /* @__PURE__ */ React.createElement(React.Fragment,null, /* @__PURE__ */ React.createElement(Btn,{variant:"danger",disabled:saving,onClick:async()=>{if(saving)return;setSaving(true);const ok=await(pendingArchive.type==="band"?onArchiveBand:onArchiveCategory)(pendingArchive.id);setSaving(false);if(ok)setPendingArchive(null);}},saving?"جارِ النقل…":"نقل للسلة"), /* @__PURE__ */ React.createElement(Btn,{variant:"ghost",onClick:()=>setPendingArchive(null)},"تراجع"))},"سيختفي «",pendingArchive.label,"» من خيارات التقييم الجديدة. التقييمات السابقة محفوظة. حذف النطاق يضم درجاته للنطاق المجاور حتى لا تترك فجوة."));
  }
function AdminCycles({ cycles, employees, evaluations, onCreate, onClose, onReopen, onCancel, onTrash, onOpenReports }) {
    const h = React.createElement;
    const [open,setOpen]=useState(false), [name,setName]=useState(""), [start,setStart]=useState(""), [end,setEnd]=useState(""), [endTouched,setEndTouched]=useState(false), [err,setErr]=useState(""), [saving,setSaving]=useState(false), [actionTarget,setActionTarget]=useState(null);
    const createLock=useRef(false);
    const [actionBusy,setActionBusy]=useState(false),actionLock=useRef(false);
    async function commitAction(){
      if(!actionTarget||actionLock.current)return;
      actionLock.current=true;setActionBusy(true);
      try{
        setErr("");
        const {cycle,action}=actionTarget;
        const result=await actionConfig[action][3](cycle.id,cycle.name);
        if(result===true)setActionTarget(null);
      }catch(error){setErr(error?.message||"تعذّر تحديث الدورة. حاول مرة أخرى.");}
      finally{actionLock.current=false;setActionBusy(false);}
    }
    const active = cycles.find(c=>c.status==="active");
    async function submit(e){ e?.preventDefault?.(); if(createLock.current)return; if(!name.trim()||!start||!end){setErr("املأ جميع الحقول");return;} if(end<start){setErr("تاريخ النهاية قبل البداية");return;} createLock.current=true;setSaving(true);try{const ok=await onCreate({name:name.trim(),start_date:start,end_date:end,status:"active"});if(ok===true){setOpen(false);setName("");setStart("");setEnd("");setEndTouched(false);setErr("");}}catch(error){setErr(error?.message||"تعذّر إنشاء الدورة. حاول مرة أخرى.");}finally{setSaving(false);createLock.current=false;}}
    const statusLabel={active:"نشطة",closed:"مغلقة",cancelled:"ملغاة",draft:"مسودة"};
    const actionConfig={close:["إغلاق الدورة","سيُوقف إضافة تقييمات جديدة، ويمكن إعادة فتحها لاحقًا.","تأكيد الإغلاق",onClose],reopen:["إعادة فتح الدورة","ستعود الدورة نشطة ويمكن إضافة تقييمات جديدة.","تأكيد إعادة الفتح",onReopen],cancel:["إلغاء الدورة","ستبقى التقييمات محفوظة في السجل، لكن الدورة لن تُحتسب.","تأكيد الإلغاء",onCancel],trash:["نقل لسلة المهملات","يمكن استرجاع الدورة من سلة المهملات.","نقل لسلة المهملات",onTrash]};
    return h("div",{className:"cycles-screen"},
      h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"إدارة الأداء"),h("h1",null,"دورات التقييم")),h("button",{type:"button",className:"create-cycle",onClick:()=>setOpen(true),disabled:!!active},h(Icon,{svg:ICONS.plus,size:17}),"دورة جديدة")),
      active && h("div",{className:"cycle-note"},"توجد دورة نشطة. أغلقها قبل إنشاء دورة أخرى."),
      !cycles.length?h(EmptyState,{icon:h(Icon,{svg:ICONS.clock,size:28}),title:"لا توجد دورات",body:"أنشئ أول دورة لتبدأ تقييم الفريق."}):h("div",{className:"cycles-grid"},cycles.map(c=>{
        const evs=evaluations.filter(e=>e.cycle_id===c.id&&e.status==="active");
        const covered=new Set(evs.map(e=>e.employee_id)).size;
        const pct=employees.length?Math.round(covered/employees.length*100):0;
        return h("article",{key:c.id,className:"cycle-tile"},h("div",{className:"cycle-tile-top"},h("span",{className:`cycle-state ${c.status}`},statusLabel[c.status]||c.status),h("small",null,fmtDate(c.start_date)," — ",fmtDate(c.end_date))),
          h("h2",null,c.name),h("div",{className:"cycle-numbers"},h("span",null,h("strong",null,covered)," / ",employees.length," موظف"),h("span",null,evs.length," تقييم")),
          h("div",{className:"cycle-progress"},h("span",{style:{width:`${pct}%`}})),
          h("button",{type:"button",className:"cycle-open",onClick:()=>onOpenReports(c.id)},"افتح لوحة الدورة",h(Icon,{svg:ICONS.back,size:16})),
          h("div",{className:"cycle-actions"},c.status==="active"&&h("button",{onClick:()=>setActionTarget({cycle:c,action:"close"})},"إغلاق"),c.status==="closed"&&h("button",{onClick:()=>setActionTarget({cycle:c,action:"reopen"}),disabled:!!active},"إعادة فتح"),c.status==="active"&&h("button",{onClick:()=>setActionTarget({cycle:c,action:"cancel"})},"إلغاء"),h("button",{onClick:()=>setActionTarget({cycle:c,action:"trash"}),"aria-label":`نقل ${c.name} لسلة المهملات`},"نقل للسلة")));
      })),
      open&&h(Modal,{title:"إنشاء دورة تقييم",onClose:()=>!saving&&setOpen(false),footer:h(React.Fragment,null,h(Btn,{variant:"primary",onClick:submit,disabled:saving},saving?"جارِ الإنشاء…":"إنشاء وتفعيل"),h(Btn,{variant:"ghost",disabled:saving,onClick:()=>setOpen(false)},"إلغاء"))},
        h(Field,{label:"اسم الدورة"},h("input",{style:s.input,value:name,onChange:e=>setName(e.target.value),placeholder:"مثال: تقييم سبتمبر"})),
        h(Field,{label:"تاريخ البداية"},h("input",{type:"date",style:s.input,value:start,onChange:e=>{setStart(e.target.value);if(!endTouched&&e.target.value)setEnd(addOneMonth(e.target.value));}})),
        h(Field,{label:"تاريخ النهاية"},h("input",{type:"date",style:s.input,value:end,onChange:e=>{setEnd(e.target.value);setEndTouched(true);}})),err&&h("div",{style:s.errText},err)),
      actionTarget&&h(Modal,{title:actionConfig[actionTarget.action][0],onClose:()=>!actionBusy&&setActionTarget(null),footer:h(React.Fragment,null,h(Btn,{variant:actionTarget.action==="reopen"?"primary":"danger",disabled:actionBusy,onClick:commitAction},actionBusy?"جارِ الحفظ…":actionConfig[actionTarget.action][2]),h(Btn,{variant:"ghost",disabled:actionBusy,onClick:()=>setActionTarget(null)},"تراجع"))},h("p",null,actionTarget.cycle.name," — ",actionConfig[actionTarget.action][1]),err&&h("p",{role:"alert",style:s.errText},err),actionBusy&&h("p",{role:"status"},"جارِ تحديث الدورة…"),actionTarget.action==="close"&&(()=>{const cycleEvs=evaluations.filter(e=>e.cycle_id===actionTarget.cycle.id&&e.status==="active");const covered=new Set(cycleEvs.map(e=>e.employee_id)).size;const pending=Math.max(0,employees.filter(e=>!e.archived&&!e.deleted_at).length-covered);return h("div",{className:"close-summary"},h("div",null,h("span",null,"الموظفون الذين لديهم تقييم"),h("strong",null,covered)),h("div",null,h("span",null,"عدد التقييمات المسجلة"),h("strong",null,cycleEvs.length)),h("div",null,h("span",null,"موظفون بلا تقييم"),h("strong",null,pending)),pending>0&&h("small",null,"يمكنك إغلاق الدورة الآن أو الرجوع لإكمال التقييمات. الإغلاق لا يحذف أي بيانات."));})()));
  }
function addOneMonth(dateStr) {
    const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
    const day = d.getDate();
    d.setMonth(d.getMonth() + 1);
    if (d.getDate() !== day) d.setDate(0);
    return d.toISOString().slice(0, 10);
  }
return {AdminEmployees,AdminUsers,AdminCategories,AdminCycles,addOneMonth};
};
