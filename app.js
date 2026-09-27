var __startElmCafeApp__ = (() => {
  const { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } = React;
  const SUPABASE_URL = "https://izfimghzcasnbmdsftps.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_FnhXzXCDLHTwvGGkZBBrkA_UPrm-tZ3";
  const VAPID_PUBLIC_KEY = "BEwpC6fDUNsyVsIZBJZFeuRfTEeH3kyslmsWvBN47CXSaIPDP5nbxJD7QoJdOKQTumM8xAj815BBoJfIiZvIHeQ";
  const EMAIL_DOMAIN = "elmcafe.app";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const LOGO_SRC = "./elm-cafe-logo.png";
  const DEFAULT_RATING_BANDS_FALLBACK = [
    { min: 90, max: 100, label: "\u0645\u0645\u062A\u0627\u0632" },
    { min: 80, max: 89, label: "\u062C\u064A\u062F \u062C\u062F\u064B\u0627" },
    { min: 70, max: 79, label: "\u062C\u064A\u062F" },
    { min: 60, max: 69, label: "\u064A\u062D\u062A\u0627\u062C \u062A\u062D\u0633\u064A\u0646" },
    { min: 0, max: 59, label: "\u063A\u064A\u0631 \u0645\u0631\u0636\u064D" }
  ];
  function nowISO() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function fmtDateTime(iso) {
    try {
      return new Date(iso).toLocaleString("ar-EG-u-nu-latn", {
        timeZone: "Asia/Riyadh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (e) {
      return iso;
    }
  }
  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit" });
    } catch (e) {
      return iso;
    }
  }
  function relTime(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1e3;
    if (diff < 60) return "\u0627\u0644\u0622\u0646";
    if (diff < 3600) return `\u0645\u0646\u0630 ${Math.floor(diff / 60)} \u062F\u0642\u064A\u0642\u0629`;
    if (diff < 86400) return `\u0645\u0646\u0630 ${Math.floor(diff / 3600)} \u0633\u0627\u0639\u0629`;
    return `\u0645\u0646\u0630 ${Math.floor(diff / 86400)} \u064A\u0648\u0645`;
  }
  const AVATAR_PALETTE = [
    { bg: "#E4EAE3", fg: "#2E4635" },
    // forest
    { bg: "#F7EFD6", fg: "#8A6A16" },
    // gold
    { bg: "#F7E7E3", fg: "#A6382C" },
    // red
    { bg: "#E3ECF2", fg: "#2A5D7A" },
    // blue
    { bg: "#EFE3F2", fg: "#6A3D8A" },
    // purple
    { bg: "#E9F2E0", fg: "#3B6D24" },
    // green
    { bg: "#F2E9D8", fg: "#8A5A2A" },
    // brown
    { bg: "#E3EEF0", fg: "#2A7A72" }
    // teal
  ];
  function avatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = hash * 31 + name.charCodeAt(i) >>> 0;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  }
  function Icon({ svg, size = 18, color = "currentColor", rotate }) {
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: rotate ? { transform: `rotate(${rotate}deg)` } : void 0,
        dangerouslySetInnerHTML: { __html: svg }
      }
    );
  }
  const ICONS = {
    back: '<path d="m15 18-6-6 6-6" />',
    plus: '<path d="M5 12h14" /><path d="M12 5v14" />',
    x: '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
    search: '<path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />',
    logout: '<path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />',
    archive: '<rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" />',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />',
    unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" />',
    clipboard: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />',
    clock: '<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />',
    settings: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" />',
    file: '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />',
    print: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><rect x="6" y="14" width="12" height="8" rx="1" />',
    up: '<path d="M16 7h6v6" /><path d="m22 7-8.5 8.5-5-5L2 17" />',
    down: '<path d="M16 17h6v-6" /><path d="m22 17-8.5-8.5-5 5L2 7" />',
    stop: '<rect width="18" height="18" x="3" y="3" rx="2" />',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />',
    trash: '<path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" />',
    eyeOff: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" />',
    moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />',
    sun: '<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />',
    check: '<path d="M20 6 9 17l-5-5" />',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />'
  };
  function Logo({ size = 32 }) {
    return /* @__PURE__ */ React.createElement("img", { src: LOGO_SRC, alt: "Elm Cafe", style: { width: size, height: "auto", display: "block", margin: "-5px -7px" } });
  }
  function TopBar({ title, onBack, session, onLogout, onRefresh, refreshing, violationCount, notificationsReady, onOpenNotifications, theme, onToggleTheme, connectionState, lastSyncAt }) {
    const h = React.createElement;
    const circleBtn = { ...s.iconBtn, background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: 16 };
    return h("header", { style: s.topbar, className: "no-print app-topbar" },
      h("div", { style: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 } },
        onBack ? h("button", { type: "button", onClick: onBack, style: circleBtn, "aria-label": "رجوع", title: "رجوع" }, h(Icon, { svg: ICONS.back, size: 19, rotate: 180 })) : h(Logo, { size: 48 }),
        h("div", { className: "topbar-heading" },
          h("div", { className: "topbar-title", title }, title),
          session && h("div", { className:`connection-status ${connectionState || "checking"}`, role:"status", title:lastSyncAt ? `آخر تحديث ناجح: ${new Date(lastSyncAt).toLocaleString("ar-EG")}` : "لم يكتمل تحديث البيانات بعد" },
            h("span", { className:"connection-dot" }),
            h("span", null, connectionState === "connected" ? "متصل" : connectionState === "offline" ? "لا يوجد إنترنت" : connectionState === "error" ? "تعذّر التحديث" : "جارٍ التحقق"),
            h("span", { className:"connection-separator" }, "·"),
            h("span", null, lastSyncAt ? `آخر تحديث ${new Date(lastSyncAt).toLocaleTimeString("ar-EG",{hour:"2-digit",minute:"2-digit"})}` : "لم يتم التحديث")))),
      h("div", { style: { display: "flex", alignItems: "center", gap: 5, flexShrink: 0 } },
        session?.role === "super_admin" && notificationsReady && h("button", { type: "button", onClick: onOpenNotifications, style: { ...circleBtn, position: "relative" }, "aria-label": `الإشعارات، ${violationCount} غير مراجعة`, title: "الإشعارات" },
          h(Icon, { svg: ICONS.bell, size: 18 }), violationCount > 0 && h("span", { className: "notification-badge" }, violationCount > 9 ? "9+" : violationCount)),
        h("button", { type: "button", onClick: () => window.ElmI18n?.setLanguage(window.ElmI18n.getLanguage() === 'ar' ? 'en' : 'ar'), style: circleBtn, "aria-label": window.ElmI18n?.getLanguage() === 'ar' ? 'Switch to English' : 'التبديل للعربية', title: window.ElmI18n?.getLanguage() === 'ar' ? 'English' : 'العربية' }, window.ElmI18n?.getLanguage() === 'ar' ? 'EN' : 'ع'),
        h("button", { type: "button", onClick: onToggleTheme, style: circleBtn, "aria-label": theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي", title: theme === "dark" ? "الوضع الفاتح" : "الوضع الليلي" }, h(Icon, { svg: theme === "dark" ? ICONS.sun : ICONS.moon, size: 17 })),
        onRefresh && h("button", { type: "button", onClick: onRefresh, disabled: refreshing, style: circleBtn, "aria-label": "تحديث البيانات", title: "تحديث البيانات" }, h("span", { className: refreshing ? "spin" : "", style: { display: "flex" } }, h(Icon, { svg: ICONS.refresh, size: 17 }))),
        session && h("button", { type: "button", onClick: onLogout, style: circleBtn, "aria-label": "تسجيل الخروج", title: "تسجيل الخروج" }, h(Icon, { svg: ICONS.logout, size: 17 }))));
  }
  const TABS = [
    { key: "adminHome", icon: ICONS.home, label: "الرئيسية" },
    { key: "adminEmployees", icon: ICONS.users, label: "الموظفون" },
    { key: "home", icon: ICONS.check, label: "التقييمات" },
    { key: "reportsOverall", icon: ICONS.file, label: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631" },
    { key: "moreMenu", icon: ICONS.grid, label: "\u0627\u0644\u0645\u0632\u064A\u062F" }
  ];
  function tabForScreen(screen) {
    if (["home", "employee", "newEval", "history"].includes(screen)) return "home";
    if (screen === "adminEmployees") return "adminEmployees";
    if (["adminUsers", "adminCategories", "adminCycles", "evaluatorActivity", "auditLog", "moreMenu", "trash"].includes(screen)) return "moreMenu";
    if (screen === "reportsOverall") return "reportsOverall";
    return "adminHome";
  }
  function BottomNav({ activeScreen, onSelect }) {
    const active = tabForScreen(activeScreen);
    return /* @__PURE__ */ React.createElement("nav", { className: "no-print app-bottomnav", style: s.bottomNav, "aria-label": "التنقل الرئيسي" }, TABS.map((t) => {
      const isActive = active === t.key;
      return /* @__PURE__ */ React.createElement("button", { key: t.key, type: "button", onClick: () => onSelect(t.key), "aria-current": isActive ? "page" : void 0, style: { ...s.bottomNavBtn, color: isActive ? "var(--forest)" : "var(--ink-3)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 30, height: 30, borderRadius: 11, background: isActive ? "var(--forest-10)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s ease" } }, /* @__PURE__ */ React.createElement(Icon, { svg: t.icon, size: 19 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: isActive ? 700 : 500, marginTop: 0 } }, t.label));
    }));
  }
  function ScoreRing({ score, size = 148 }) {
    const r = (size - 14) / 2, c = 2 * Math.PI * r, pct = Math.max(0, Math.min(100, score));
    const offset = c - pct / 100 * c;
    const color = pct >= 90 ? "var(--gold)" : pct >= 70 ? "var(--green)" : pct >= 60 ? "#B9862F" : "var(--red)";
    return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: size, height: size } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" } }, /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r, stroke: "var(--border)", strokeWidth: "10", fill: "none" }), /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: size / 2,
        cy: size / 2,
        r,
        stroke: color,
        strokeWidth: "10",
        fill: "none",
        strokeDasharray: c,
        strokeDashoffset: offset,
        strokeLinecap: "round",
        style: { transition: "stroke-dashoffset .6s ease" }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 34, fontWeight: 800, lineHeight: 1 } }, Math.round(pct)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)", marginTop: 2 } }, "\u0645\u0646 100")));
  }
  function Modal({ title, children, onClose, footer, compact = false, account = false }) {
    const panel = React.createElement("div", { className: "app-modal-overlay" + (compact ? " compact" : "") + (account ? " account-modal" : ""), style: s.modalOverlay, role: "dialog", "aria-modal": true, "aria-label": title, onClick: onClose },
      React.createElement("div", { className: "app-modal-card" + (compact ? " compact" : ""), style: s.modalCard, onClick: (e) => e.stopPropagation() },
        React.createElement("div", { className: "app-modal-heading" },
          React.createElement("strong", null, title),
          React.createElement("button", { type:"button", onClick:onClose, className:"app-modal-close", "aria-label":"إغلاق النافذة" }, React.createElement(Icon, { svg: ICONS.x, size: 19 }))),
        React.createElement("div", { className: "app-modal-content" }, children),
        footer && React.createElement("div", { className: "app-modal-footer" }, footer)));
    // A portal keeps the dialog outside animated and filtered page layers on iOS.
    return typeof document !== "undefined" ? ReactDOM.createPortal(panel, document.body) : panel;
  }
  function Toast({ toast }) {
    const [expanded, setExpanded] = useState(false);
    useEffect(() => setExpanded(false), [toast]);
    if (!toast) return null;
    const raw = String(toast.msg || "");
    const isError = toast.type === "error";
    const dbDetail = raw.includes("foreign key constraint") ? "في بيانات مرتبطة بهذا العنصر. راجع خطوة إصلاح قاعدة البيانات." :
      raw.includes("row-level security") || raw.includes("permission denied") ? "حسابك لا يملك صلاحية إتمام العملية." :
      raw.includes("Failed to fetch") || raw.includes("NetworkError") ? "الاتصال انقطع. تأكد من الإنترنت وحاول مجددًا." : "";
    const short = dbDetail || (raw.length > 115 ? raw.slice(0, 112).trimEnd() + "…" : raw);
    return React.createElement("div", { className:`app-toast ${isError ? "error" : ""}`, role:isError?"alert":"status" },
      React.createElement("span", { className:"toast-indicator" }, isError ? "!" : "✓"),
      React.createElement("div", { className:"toast-content" }, React.createElement("strong",null,short),
        isError && raw !== short && React.createElement("button", { type:"button", onClick:()=>setExpanded(!expanded) }, expanded ? "إخفاء التفاصيل" : "تفاصيل الخطأ"),
        expanded && React.createElement("small",null,raw)));
  }
  class AppErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { failed:false, errorText:"" }; this.recoverSession=this.recoverSession.bind(this); }
    static getDerivedStateFromError(error) {
      const message = `${error?.name || "Error"}: ${error?.message || "تعذّر عرض الصفحة"}`;
      const stack = typeof error?.stack === "string" ? error.stack.split("\n").slice(0, 8).join("\n") : "";
      return { failed:true, errorText:[message, stack].filter(Boolean).join("\n") };
    }
    componentDidCatch(error) { console.error("Elm Cafe render error", error); }
    async recoverSession() { try { await supabase.auth.signOut({scope:"local"}); } catch (_) {} location.replace(location.pathname + "?reload=" + Date.now()); }
    render() {
      if (!this.state.failed) return this.props.children;
      return React.createElement("div",{className:"app-fallback"},
        React.createElement("strong",null,"تعذّر عرض هذه الشاشة"),
        React.createElement("p",null,"يمكنك إعادة تحميل التطبيق. لو كنت بتكتب تقييم، راجع السجل قبل إعادة المحاولة حتى لا يتكرر."),
        React.createElement("button",{type:"button",onClick:()=>location.replace(location.pathname + "?reload=" + Date.now())},"إعادة تحميل التطبيق"),
        React.createElement("button",{type:"button",className:"fallback-secondary",onClick:this.recoverSession},"تسجيل الدخول من جديد على هذا المتصفح"),
        this.state.errorText && React.createElement("details",null,React.createElement("summary",null,"تفاصيل الخطأ لإرسالها للدعم"),React.createElement("pre",null,this.state.errorText)));
    }
  }
  function Field({ label, children }) {
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, color: "var(--ink-2)", marginBottom: 6 } }, label), children);
  }
  function Switch({ checked, onChange, label, description }) {
    return /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => onChange(!checked), style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", padding: "10px 0", cursor: "pointer", textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, marginLeft: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--ink)" } }, label), description && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)", marginTop: 1 } }, description)), /* @__PURE__ */ React.createElement("div", { style: { width: 46, height: 28, borderRadius: 999, background: checked ? "var(--forest)" : "var(--border-strong)", position: "relative", transition: "background .18s ease", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, right: checked ? 21 : 3, transition: "right .18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" } })));
  }
  function Btn({ children, onClick, variant = "secondary", disabled, style, type = "button" }) {
    const base = { ...s.btn, ...variant === "primary" ? s.btnPrimary : variant === "danger" ? s.btnDanger : variant === "ghost" ? s.btnGhost : {} };
    return /* @__PURE__ */ React.createElement("button", { type, onClick, disabled, style: { ...base, ...disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}, ...style } }, children);
  }
  function EmptyState({ icon, title, body }) {
    return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "56px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "var(--forest-10)", color: "var(--forest)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, icon), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--ink-2)", marginBottom: 5 } }, title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-3)" } }, body));
  }
  async function fetchAllRows(table, orderColumn, ascending = true) {
    const pageSize = 500;
    const rows = [];
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase.from(table).select("*")
        .order(orderColumn, { ascending })
        .order("id", { ascending: true })
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      rows.push(...(data || []));
      if (!data || data.length < pageSize) break;
    }
    return rows;
  }
  async function fetchInboxRows() {
    const recent = await supabase.from("violation_inbox").select("*")
      .order("created_at", { ascending: false }).limit(150);
    if (recent.error) return recent;
    const unread = [];
    for (let offset = 0; ; offset += 500) {
      const page = await supabase.from("violation_inbox").select("*")
        .is("read_at", null).order("created_at", { ascending: false })
        .range(offset, offset + 499);
      if (page.error) return page;
      unread.push(...(page.data || []));
      if (!page.data || page.data.length < 500) break;
    }
    const merged = new Map([...(recent.data || []), ...unread].map(item => [item.id, item]));
    return { data: [...merged.values()].sort((a,b) => new Date(b.created_at)-new Date(a.created_at)), error: null };
  }
  function pushSupported() {
    return typeof navigator !== 'undefined' && 'serviceWorker' in navigator &&
      'PushManager' in window && 'Notification' in window && !!VAPID_PUBLIC_KEY;
  }
  function decodeVapidKey(value) {
    const normalized = value.replace(/-/g,'+').replace(/_/g,'/');
    const bytes = atob(normalized.padEnd(Math.ceil(normalized.length/4)*4,'='));
    return Uint8Array.from(bytes,character=>character.charCodeAt(0));
  }
  async function enableDevicePush(userId) {
    if(!pushSupported()) throw new Error('الإشعارات الخارجية غير متاحة في هذا المتصفح. على الآيفون افتح التطبيق من أيقونة الشاشة الرئيسية.');
    const permission = await Notification.requestPermission();
    if(permission !== 'granted') throw new Error('لم تُمنح صلاحية الإشعارات من إعدادات الجهاز.');
    const registration = await navigator.serviceWorker.register('./sw.js',{scope:'./'});
    let subscription = await registration.pushManager.getSubscription();
    let created = !subscription;
    if(!subscription) subscription = await registration.pushManager.subscribe({
      userVisibleOnly:true,applicationServerKey:decodeVapidKey(VAPID_PUBLIC_KEY)
    });
    const {data:old,error:lookupError}=await supabase.from('push_subscriptions')
      .select('id').eq('endpoint',subscription.endpoint).maybeSingle();
    if(lookupError) throw lookupError;
    if(!old && !created){
      // A subscription from a previous login must never keep receiving that user's alerts.
      await subscription.unsubscribe();
      subscription=await registration.pushManager.subscribe({
        userVisibleOnly:true,applicationServerKey:decodeVapidKey(VAPID_PUBLIC_KEY)
      });
      created=true;
    }
    const keys=subscription.toJSON().keys;
    if(!keys?.p256dh || !keys?.auth) throw new Error('لم يقدّم الجهاز مفاتيح اشتراك صالحة.');
    if(!old){
      const {error}=await supabase.from('push_subscriptions').insert({
        user_id:userId,endpoint:subscription.endpoint,p256dh:keys.p256dh,auth_secret:keys.auth
      });
      if(error){if(created)await subscription.unsubscribe();throw error;}
    }
    return true;
  }
  async function disableDevicePush() {
    if(!pushSupported()) return;
    const registration=await navigator.serviceWorker.getRegistration('./');
    const subscription=await registration?.pushManager?.getSubscription();
    if(!subscription)return;
    const {error}=await supabase.from('push_subscriptions').delete().eq('endpoint',subscription.endpoint);
    await subscription.unsubscribe();
    if(error)throw error;
  }
  async function mutateRowsByIds(table, operation, ids, changes) {
    const rows=[];
    for(let i=0;i<ids.length;i+=50){
      const chunk=ids.slice(i,i+50);
      const base=supabase.from(table);
      const query=operation==="delete" ? base.delete() : base.update(changes);
      const selected=query.in("id",chunk);
      const {data,error}=await (operation==="delete" ? selected.not("deleted_at","is",null) : selected).select("id");
      if(error)return {data:rows,error};
      rows.push(...(data||[]));
      if(!chunk.every(id=>(data||[]).some(row=>row.id===id)))
        return {data:rows,error:new Error(`تعذّر تأكيد تحديث كل سجلات ${table}`)};
    }
    return {data:rows,error:null};
  }
  async function fetchAll() {
    const [emp, cat, cycles, evaluations, aud, rb, lookup, awardResult, rewardCatalogResult, rewardEarningsResult, rewardRedemptionsResult, inboxResult] = await Promise.all([
      supabase.from("employees").select("*").order("name"),
      supabase.from("categories").select("*"),
      fetchAllRows("cycles", "created_at", false),
      fetchAllRows("evaluations", "created_at", false),
      fetchAllRows("audit_log", "created_at", false).then(data=>({data,error:null})).catch(error=>({data:null,error})),
      supabase.from("rating_bands").select("*").order("sort_order"),
      supabase.from("user_lookup").select("*"),
      supabase.from("cycle_awards").select("*").order("created_at", { ascending: false }),
      supabase.from("employee_reward_catalog").select("*").order("created_at", { ascending: false }),
      fetchAllRows("employee_reward_earnings", "earned_at", false).then(data=>({data,error:null})).catch(error=>({data:null,error})),
      fetchAllRows("employee_reward_redemptions", "redeemed_at", false).then(data=>({data,error:null})).catch(error=>({data:null,error})),
      fetchInboxRows().catch(error => ({ data: null, error }))
    ]);
    const failed = [emp, cat, aud, rb, lookup].find(result => result.error);
    if (failed) throw failed.error;
    const awardSchemaReady = !awardResult.error;
    const optionalResults = [awardResult, rewardCatalogResult, rewardEarningsResult, rewardRedemptionsResult];
    const schemaMissing = error => error && ["PGRST205", "42P01"].includes(error.code);
    const unexpectedOptionalFailure = optionalResults.find(result => result.error && !schemaMissing(result.error));
    if (unexpectedOptionalFailure) throw unexpectedOptionalFailure.error;
    const rewardsReady = optionalResults.slice(1,4).every(result => !result.error);
    return {
      employees: emp.data || [],
      categories: cat.data || [],
      cycles,
      evaluations,
      audit: aud.data || [],
      ratingBands: rb.data || DEFAULT_RATING_BANDS_FALLBACK,
      userLookup: lookup.data || [],
      cycleAwards: awardSchemaReady ? (awardResult.data || []) : [],
      awardsReady: awardSchemaReady,
      rewardsReady,
      rewardCatalog: rewardsReady ? (rewardCatalogResult.data || []) : [],
      rewardEarnings: rewardsReady ? (rewardEarningsResult.data || []) : [],
      rewardRedemptions: rewardsReady ? (rewardRedemptionsResult.data || []) : [],
      violationInbox: inboxResult.error ? [] : (inboxResult.data || []),
      inboxReady: !inboxResult.error
    };
  }
  async function fetchProfiles() {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at");
    if (error) throw error;
    return (data || []).filter((profile) => profile && profile.id);
  }
  function App() {
    const [language, setLanguage] = useState(() => window.ElmI18n?.getLanguage() || 'ar');
    useEffect(() => {
      const sync = () => setLanguage(window.ElmI18n?.getLanguage() || 'ar');
      window.addEventListener('elm-language-change', sync);
      return () => window.removeEventListener('elm-language-change', sync);
    }, []);
    const [booting, setBooting] = useState(true);
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
    useEffect(() => { document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0c0e' : '#f4f4f2'); }, [theme]);
    function toggleTheme() {
      setTheme(current => {
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0b0c0e' : '#f4f4f2');
        try { localStorage.setItem("elm-theme", next); } catch (_) {}
        return next;
      });
    }
    const [session, setSession] = useState(null);
    const [isOwner,setIsOwner]=useState(false);
    async function refreshOwner() {
      const {data,error}=await supabase.rpc("is_app_owner");
      setIsOwner(!error && data===true);
      return !error && data===true;
    }
    const [screen, setScreen] = useState("login");
    const [stack, setStack] = useState([]);
    const [ctx, setCtx] = useState({});
    const [toast, setToast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [connectionState, setConnectionState] = useState(() => navigator.onLine ? "checking" : "offline");
    const [lastSyncAt, setLastSyncAt] = useState(null);
    const [pendingNav, setPendingNav] = useState(null);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [pullState, setPullState] = useState("");
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const hasUnsavedRef = useRef(false);
    const [employees, setEmployees] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cycles, setCycles] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [audit, setAudit] = useState([]);
    const [ratingBands, setRatingBands] = useState(DEFAULT_RATING_BANDS_FALLBACK);
    const [profiles, setProfiles] = useState([]);
    const [userLookup, setUserLookup] = useState([]);
    const [cycleAwards, setCycleAwards] = useState([]);
    const [awardsReady, setAwardsReady] = useState(true);
    const [rewardsReady, setRewardsReady] = useState(false);
    const [rewardCatalog, setRewardCatalog] = useState([]);
    const [rewardEarnings, setRewardEarnings] = useState([]);
    const [rewardRedemptions, setRewardRedemptions] = useState([]);
    const [violationInbox,setViolationInbox]=useState([]);
    const [inboxReady,setInboxReady]=useState(false);
    const refreshVersion = useRef(0);
    const toastTimer = useRef(null);
    const showToast = useCallback((msg, type = "ok") => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ msg, type });
      toastTimer.current = setTimeout(() => setToast(null), type === "error" ? 5200 : 2800);
    }, []);
    async function refetch() {
      const request = ++refreshVersion.current;
      let d;
      try { d = await fetchAll(); }
      catch (error) {
        if (request === refreshVersion.current) {
          setConnectionState(navigator.onLine ? "error" : "offline");
          showToast("تعذّر تحديث البيانات. تحقق من الاتصال ثم أعد المحاولة", "error");
        }
        return false;
      }
      if (request !== refreshVersion.current) return false;
      setConnectionState(navigator.onLine ? "connected" : "offline");
      setLastSyncAt(new Date().toISOString());
      setEmployees(d.employees);
      setCategories(d.categories);
      setCycles(d.cycles);
      setEvaluations(d.evaluations);
      setAudit(d.audit);
      setRatingBands(d.ratingBands);
      setUserLookup(d.userLookup);
      setCycleAwards(d.cycleAwards);
      setAwardsReady(d.awardsReady);
      setRewardsReady(d.rewardsReady);
      setRewardCatalog(d.rewardCatalog);
      setRewardEarnings(d.rewardEarnings);
      setRewardRedemptions(d.rewardRedemptions);
      setViolationInbox(d.violationInbox);
      setInboxReady(d.inboxReady);
    }
    async function refetchProfiles() {
      setProfiles(await fetchProfiles());
    }
    const tableRefreshVersion = useRef({});
    async function refreshChangedTable(table) {
      const version = tableRefreshVersion.current[table] = (tableRefreshVersion.current[table] || 0) + 1;
      try {
        if(table === "violation_inbox"){
          const {data,error}=await fetchInboxRows();
          if(error)throw error;
          if(version===tableRefreshVersion.current[table])setViolationInbox(data||[]);
          return;
        }
        if (table === "profiles") { await refetchProfiles(); return; }
        const paged = {
          evaluations:["created_at",setEvaluations], cycles:["created_at",setCycles],
          audit_log:["created_at",setAudit], employee_reward_earnings:["earned_at",setRewardEarnings],
          employee_reward_redemptions:["redeemed_at",setRewardRedemptions]
        };
        if (paged[table]) {
          const [column,setRows]=paged[table];
          const rows=await fetchAllRows(table,column,false);
          if (version === tableRefreshVersion.current[table]) setRows(rows);
          return;
        }
        const simple = {
          employees:["name",setEmployees],categories:[null,setCategories],
          rating_bands:["sort_order",setRatingBands],
          employee_reward_catalog:["created_at",setRewardCatalog]
        };
        if (!simple[table]) return;
        const [order,setRows]=simple[table];
        let query=supabase.from(table).select("*");
        if(order) query=query.order(order,{ascending:table!=="employee_reward_catalog"});
        const {data,error}=await query;
        if(error) throw error;
        if(version===tableRefreshVersion.current[table]) setRows(data||[]);
      } catch (error) {
        setConnectionState(navigator.onLine ? "error" : "offline");
        console.error("ELM CAFE refresh failed",table,error);
      }
    }
    async function loadSessionProfile(authUser) {
      if (!authUser?.id) return null;
      const { data: prof, error: profileError } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      if (profileError) throw profileError;
      if (!prof || !["super_admin", "evaluator"].includes(prof?.role)) {
        await supabase.auth.signOut({ scope: "local" });
        showToast("بيانات صلاحية الحساب غير مكتملة. سجّل الدخول مرة أخرى أو راجع المدير الأعلى", "error");
        return null;
      }
      if (!prof.active) {
        await supabase.auth.signOut();
        showToast("\u0647\u0630\u0627 \u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0639\u0637\u0651\u0644. \u0631\u0627\u062C\u0639 \u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0623\u0639\u0644\u0649", "error");
        return null;
      }
      return {
        id: prof.id,
        name: prof.name,
        role: prof?.role,
        active: prof.active,
        email: authUser.email,
        canManageEmployees: !!prof.can_manage_employees,
        canCreateCycle: !!prof.can_create_cycle,
        canEditCategories: !!prof.can_edit_categories,
        canManageAllEvaluations: !!prof.can_manage_all_evaluations
      };
    }
    useEffect(() => {
      (async () => {
        try {
        const { data: { session: authSession } } = await supabase.auth.getSession();
        if (authSession) {
          const prof = await loadSessionProfile(authSession.user);
          if (prof) {
            await refreshOwner();
            if (await refetch() !== false) {
              await refetchProfiles();
              setSession(prof);
              setScreen(prof?.role === "super_admin" ? "adminHome" : "home");
            }
          }
        }
        } catch (_) { showToast("تعذّر الاتصال. حاول التحديث", "error"); }
        finally { setBooting(false); }
      })();
      const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") setScreen("resetPassword");
      });
      return () => {
        var _a;
        (_a = authListener == null ? void 0 : authListener.subscription) == null ? void 0 : _a.unsubscribe();
      };
    }, []);
    useEffect(() => {
      const onOffline = () => setConnectionState("offline");
      const onOnline = () => { setConnectionState("checking"); if (session) refetch(); };
      window.addEventListener("offline", onOffline);
      window.addEventListener("online", onOnline);
      return () => { window.removeEventListener("offline", onOffline); window.removeEventListener("online", onOnline); };
    }, [session]);
    useEffect(() => {
      if (!session) return;
      let timer = null;
      const changed = new Set();
      const scheduleRefresh = table => {
        changed.add(table);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          const tables=[...changed]; changed.clear();
          tables.forEach(name => refreshChangedTable(name));
        }, 350);
      };
      const channel = supabase.channel("elm-realtime")
        .on("postgres_changes", { event:"*", schema:"public", table:"evaluations" }, () => scheduleRefresh("evaluations"))
        .on("postgres_changes", { event:"*", schema:"public", table:"employees" }, () => scheduleRefresh("employees"))
        .on("postgres_changes", { event:"*", schema:"public", table:"categories" }, () => scheduleRefresh("categories"))
        .on("postgres_changes", { event:"*", schema:"public", table:"cycles" }, () => scheduleRefresh("cycles"))
        .on("postgres_changes", { event:"*", schema:"public", table:"rating_bands" }, () => scheduleRefresh("rating_bands"))
        .on("postgres_changes", { event:"*", schema:"public", table:"audit_log" }, () => scheduleRefresh("audit_log"))
        .on("postgres_changes", { event:"*", schema:"public", table:"employee_reward_catalog" }, () => scheduleRefresh("employee_reward_catalog"))
        .on("postgres_changes", { event:"*", schema:"public", table:"employee_reward_earnings" }, () => scheduleRefresh("employee_reward_earnings"))
        .on("postgres_changes", { event:"*", schema:"public", table:"employee_reward_redemptions" }, () => scheduleRefresh("employee_reward_redemptions"))
        .on("postgres_changes", { event:"*", schema:"public", table:"profiles" }, () => scheduleRefresh("profiles"))
        .on("postgres_changes", { event:"*", schema:"public", table:"violation_inbox" }, () => scheduleRefresh("violation_inbox"))
        .subscribe();
      return () => { if (timer) clearTimeout(timer); supabase.removeChannel(channel); };
    }, [session]);
    async function manualRefresh() {
      if (refreshing) return;
      setRefreshing(true);
      try { const ok = await refetch(); if (ok !== false) await refetchProfiles(); }
      catch (_) { showToast("تعذّر تحديث الحسابات", "error"); }
      finally { setRefreshing(false); }
    }
    useEffect(() => {
      if (!session) return;
      let gesture=null, returnTimer=0, refreshTimer=0;
      const surface=()=>document.querySelector('.app-main-content');
      const follow=distance=>{
        const el=surface();
        if(el){el.style.transition='none';el.style.transform=`translate3d(0,${Math.max(0,distance)}px,0)`;}
      };
      const release=()=>{
        const el=surface();
        if(!el)return;
        el.style.transition='transform .30s cubic-bezier(.2,.72,.25,1)';
        el.style.transform='translate3d(0,0,0)';
        clearTimeout(returnTimer);
        returnTimer=setTimeout(()=>{
          if(el.isConnected){el.style.transition='';el.style.transform='';}
        },330);
      };
      const onStart=event=>{
        if(event.touches.length!==1||refreshing||document.querySelector('[role="dialog"], .certificate-overlay'))return;
        if(event.target.closest('input, textarea, select, [contenteditable="true"]'))return;
        if((document.scrollingElement?.scrollTop||window.scrollY)>1)return;
        clearTimeout(returnTimer);
        clearTimeout(refreshTimer);
        gesture={x:event.touches[0].clientX,y:event.touches[0].clientY,distance:0,active:false};
      };
      const onMove=event=>{
        if(!gesture||event.touches.length!==1)return;
        const dx=event.touches[0].clientX-gesture.x;
        const dy=event.touches[0].clientY-gesture.y;
        if(!gesture.active){
          if(Math.abs(dx)>Math.max(9,Math.abs(dy)*.7)){gesture=null;return;}
          if(dy<=6)return;
          gesture.active=true;
        }
        if(event.cancelable)event.preventDefault();
        gesture.distance=Math.max(0,dy);
        follow(gesture.distance);
        setPullState(previous=>{
          const next=gesture.distance>=75?'ready':gesture.distance>6?'pulling':'';
          return previous===next?previous:next;
        });
      };
      const onEnd=()=>{
        const shouldRefresh=gesture?.active&&gesture.distance>=75;
        gesture=null;
        setPullState('');
        release();
        if(shouldRefresh)refreshTimer=setTimeout(()=>manualRefresh(),300);
      };
      const onCancel=()=>{gesture=null;setPullState('');release();};
      window.addEventListener('touchstart',onStart,{passive:true});
      window.addEventListener('touchmove',onMove,{passive:false});
      window.addEventListener('touchend',onEnd,{passive:true});
      window.addEventListener('touchcancel',onCancel,{passive:true});
      return ()=>{
        window.removeEventListener('touchstart',onStart);
        window.removeEventListener('touchmove',onMove);
        window.removeEventListener('touchend',onEnd);
        window.removeEventListener('touchcancel',onCancel);
        clearTimeout(returnTimer);
        clearTimeout(refreshTimer);
      };
    },[session,refreshing]);
    async function addAudit(action, target, details = "") {
      const { data } = await supabase.from("audit_log").insert({ actor: session ? session.name : "\u0627\u0644\u0646\u0638\u0627\u0645", action, target, details }).select().single();
      if (data) setAudit((prev) => [data, ...prev]);
    }
    function displayAuditTarget(target) {
      if (!target || target === "-") return "";
      return employees.find(x => x.id === target)?.name || cycles.find(x => x.id === target)?.name || profiles.find(x => x.id === target)?.name || evaluations.find(x => x.id === target)?.category_name || (/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(target) ? "عنصر محذوف" : target);
    }
    function goto(next, nextCtx = {}) {
      const doNav = () => {
        setStack((s2) => [...s2, { screen, ctx }]);
        setCtx(nextCtx);
        setScreen(next);
        hasUnsavedRef.current = false;
      };
      if (screen === "newEval" && hasUnsavedRef.current) setPendingNav(() => doNav);
      else doNav();
    }
    function gotoTab(tabScreen) {
      const doNav = () => {
        setStack([]);
        setCtx({});
        setScreen(tabScreen);
        hasUnsavedRef.current = false;
      };
      if (screen === "newEval" && hasUnsavedRef.current) setPendingNav(() => doNav);
      else doNav();
    }
    useLayoutEffect(() => {
      if (!session) return;
      window.scrollTo(0,0);
      if (document.scrollingElement) document.scrollingElement.scrollTop=0;
      const content=document.querySelector(".app-main-content");
      if (content) content.scrollTop=0;
    }, [screen,session?.id]);
    function goBack() {
      const doNav = () => {
        setStack((s2) => {
          if (!s2.length) return s2;
          const last = s2[s2.length - 1];
          setCtx(last.ctx);
          setScreen(last.screen);
          return s2.slice(0, -1);
        });
        hasUnsavedRef.current = false;
      };
      if (screen === "newEval" && hasUnsavedRef.current) setPendingNav(() => doNav);
      else doNav();
    }
    useEffect(() => {
      if (!session || pendingNav || notificationsOpen) return;
      let start = null;
      let navigating=false;
      const surface=()=>document.querySelector('.app-main-content');
      const resetSwipe=()=>{const el=surface();if(el){el.style.transition='transform .24s cubic-bezier(.2,.75,.25,1)';el.style.transform='translate3d(0,0,0)';setTimeout(()=>{if(el.isConnected){el.style.transition='';el.style.transform='';}},280);}};
      const overlays = '[role="dialog"], .certificate-overlay, .quick-search-scrim';
      const onTouchStart = (event) => {
        if (event.touches.length !== 1 || document.querySelector(overlays) || !stack.length) return;
        if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        const touch = event.touches[0], width = window.innerWidth;
        const edge = touch.clientX <= 28 ? "left" : touch.clientX >= width - 28 ? "right" : null;
        start = edge ? { x: touch.clientX, y: touch.clientY, edge } : null;
      };
      const onTouchMove = (event) => {
        if (!start || event.touches.length !== 1) return;
        const dx = event.touches[0].clientX - start.x;
        const dy = event.touches[0].clientY - start.y;
        const inward = start.edge === "left" ? dx : -dx;
        if (inward > 12 && Math.abs(dy) < inward * .6) {
          if(event.cancelable)event.preventDefault();
          const el=surface();if(el){el.style.transition='none';el.style.transform=`translate3d(${(start.edge==='left'?1:-1)*Math.min(64,(inward-12)*.27)}px,0,0)`;}
        }
      };
      const onTouchEnd = (event) => {
        if (!start || event.changedTouches.length !== 1) { start = null; resetSwipe(); return; }
        const dx = event.changedTouches[0].clientX - start.x;
        const dy = event.changedTouches[0].clientY - start.y;
        const inward = start.edge === "left" ? dx : -dx;
        start = null;
        resetSwipe();
        if (stack.length && inward >= 82 && Math.abs(dy) < Math.min(60, inward * 0.6) && !document.querySelector(overlays) && !navigating) { navigating=true; setTimeout(()=>goBack(),100); }
      };
      const onTouchCancel = () => { start = null; resetSwipe(); };
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchCancel, { passive: true });
      return () => {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchCancel);
      };
    }, [session, stack.length, screen, ctx, pendingNav, notificationsOpen]);
    async function logout() {
      try { await disableDevicePush(); } catch(error) { console.warn('Device push cleanup failed',error); }
      await supabase.auth.signOut();
      setSession(null);
      setIsOwner(false);
      setStack([]);
      setCtx({});
      setScreen("login");
    }
    const activeCycle = cycles.find((c) => c.status === "active" && !c.deleted_at);
    function computeScore(employeeId, cycleId) {
      const evs = evaluations.filter((e) => e.employee_id === employeeId && e.cycle_id === cycleId && e.status === "active");
      let delta = 0;
      evs.forEach((e) => {
        const points = Number(e.category_points);
        if (Number.isFinite(points)) delta += e.type === "positive" ? points : -points;
      });
      return Math.max(0, Math.min(100, 100 + delta));
    }
    const visibleViolations = useMemo(() => {
      if (!inboxReady) return [];
      const evaluationsById = new Map(evaluations.map(item => [item.id, item]));
      return violationInbox.flatMap(row => {
        const evaluation = evaluationsById.get(row.evaluation_id);
        return evaluation?.is_violation && evaluation.status === "active"
          ? [{...evaluation, inbox_id: row.id, violation_reviewed: !!row.read_at}] : [];
      });
    }, [inboxReady, violationInbox, evaluations]);
    useEffect(() => {
      if(!session) return;
      const onMessage=event=>{if(event.data?.type==='OPEN_VIOLATIONS' && inboxReady)setNotificationsOpen(true);};
      navigator.serviceWorker?.addEventListener('message',onMessage);
      if(location.search.includes('notifications=1') && inboxReady){
        setNotificationsOpen(true);
        history.replaceState(history.state,'',location.pathname);
      }
      return ()=>navigator.serviceWorker?.removeEventListener('message',onMessage);
    },[session,inboxReady]);
    function ratingFor(score) {
      const b = ratingBands.find((b2) => !b2.deleted_at && score >= b2.min && score <= b2.max);
      return b ? b.label : "-";
    }
    if (booting) return React.createElement("div", { className: "initial-splash" }, React.createElement(Logo, { size: 112 }), React.createElement("span", { className: "splash-pulse" }), React.createElement("span", null, "لحظات..."));
    return /* @__PURE__ */ React.createElement("div", { dir: language === "en" ? "ltr" : "rtl" }, !session && screen !== "resetPassword" && /* @__PURE__ */ React.createElement(
      LoginScreen,
      {
        onLogin: async (username, password) => {
          const uname = username.trim().toLowerCase();
          const { data: lookup } = await supabase.from("user_lookup").select("email").eq("username", uname).maybeSingle();
          const email = lookup ? lookup.email : `${uname}@${EMAIL_DOMAIN}`;
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) return "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u062E\u0648\u0644 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629";
          const prof = await loadSessionProfile(data.user);
          if (!prof) return "\u0627\u0644\u062D\u0633\u0627\u0628 \u063A\u064A\u0631 \u0645\u0641\u0639\u0651\u0644 \u0623\u0648 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F";
          await refreshOwner();
          if (await refetch() === false) return "تم تسجيل الدخول، لكن تعذّر تحميل البيانات. تحقق من الاتصال وحاول مجددًا.";
          await refetchProfiles();
          setSession(prof);
          setScreen(prof?.role === "super_admin" ? "adminHome" : "home");
          await supabase.from("audit_log").insert({ actor: prof.name, action: "\u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644", target: "-" });
          return null;
        },
        theme,
        onToggleTheme: toggleTheme,
        onReset: async (username) => {
          const uname = username.trim().toLowerCase();
          const { data: lookup } = await supabase.from("user_lookup").select("email").eq("username", uname).maybeSingle();
          const email = lookup ? lookup.email : `${uname}@${EMAIL_DOMAIN}`;
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
        }
      }
    ), screen === "resetPassword" && /* @__PURE__ */ React.createElement(
      ResetPasswordScreen,
      {
        onSubmit: async (newPw) => {
          const { error } = await supabase.auth.updateUser({ password: newPw });
          if (error) return `\u062A\u0639\u0630\u0651\u0631 \u062A\u062D\u062F\u064A\u062B \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631: ${error.message}`;
          await supabase.auth.signOut();
          setSession(null);
          setStack([]);
          setCtx({});
          setScreen("login");
          showToast("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0628\u0646\u062C\u0627\u062D \u2014 \u0633\u062C\u0651\u0644 \u062F\u062E\u0648\u0644 \u0628\u0647\u0627 \u0627\u0644\u0622\u0646");
          return null;
        }
      }
    ), session && screen !== "resetPassword" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      TopBar,
      {
        title: titleFor(screen, ctx, employees),
        onBack: stack.length ? goBack : null,
        session,
        onLogout: () => setConfirmLogout(true),
        onRefresh: null,
        refreshing,
        violationCount: visibleViolations.filter(e=>!e.violation_reviewed).length,
        notificationsReady:inboxReady,
        onOpenNotifications: () => setNotificationsOpen(true),
        theme,
        onToggleTheme: toggleTheme,
        connectionState,
        lastSyncAt,
      }
    ), /* @__PURE__ */ React.createElement("main", { className: "app-main-content" + (["moreMenu","auditLog"].includes(screen) ? " compact-admin-page" : ""), key: screen + "-" + (ctx.employeeId || ""), style: { ...session?.role === "super_admin" ? { ...s.body, paddingBottom: "calc(128px + env(safe-area-inset-bottom, 0px))" } : s.body, animation: "fadeIn .28s cubic-bezier(.2,.75,.25,1)" } }, screen === "home" && /* @__PURE__ */ React.createElement(
      EvaluatorHome,
      {
        employees: employees.filter((e) => !e.archived && !e.deleted_at),
        activeCycle,
        computeScore,
        session,
        evaluations,
        onGo: (scr) => goto(scr),
        onOpen: (emp) => goto("newEval", { employeeId: emp.id }),
        onProfile: (emp) => goto("employee", { employeeId: emp.id }),
        initialEvaluationId: null
      }
    ), screen === "evaluationsLog" && React.createElement(EvaluationsLog, { employees, evaluations, activeCycle, initialEvaluationId:ctx.evaluationId }), screen === "employee" && /* @__PURE__ */ React.createElement(
      EmployeeDetail,
      {
        employee: employees.find((e) => e.id === ctx.employeeId),
        activeCycle,
        cycles: cycles.filter((c) => !c.deleted_at),
        evaluations,
        computeScore,
        ratingFor,
        canManageRewards: session?.role === "super_admin",
        onOpenRewards:()=>gotoTab("rewardsHub"),
        rewardsReady,
        rewardEarnings,
        rewardRedemptions,
        managerName: session.name,
        onNewEval: () => goto("newEval", { employeeId: ctx.employeeId }),
        onHistory: () => goto("history", { employeeId: ctx.employeeId })
      }
    ), screen === "newEval" && /* @__PURE__ */ React.createElement(
      NewEvaluationScreen,
      {
        employee: employees.find((e) => e.id === ctx.employeeId && !e.archived && !e.deleted_at),
        categories: categories.filter((c) => c.active && !c.deleted_at),
        activeCycle,
        session,
        hasUnsavedRef,
        onDone: async (rec) => {
          var _a;
          try {
          const { data, error } = await supabase.from("evaluations").insert(rec).select().single();
          if (error) {
            showToast(`تعذّر الحفظ: ${error.message}`, "error");
            return false;
          }
          setEvaluations((prev) => [data, ...prev]);
          const empName = ((_a = employees.find((e) => e.id === rec.employee_id)) == null ? void 0 : _a.name) || "";
          try { await addAudit("إضافة تقييم", `${empName} — ${rec.category_name}`); } catch (_) { /* The saved evaluation remains valid. */ }
          const notePreview = rec.note ? ` \u2014 ${rec.note.slice(0, 40)}${rec.note.length > 40 ? "\u2026" : ""}` : "";
          showToast(`\u062A\u0645 \u062A\u0633\u062C\u064A\u0644: ${rec.category_name}${notePreview}`);
          hasUnsavedRef.current = false;
          goBack();
          return true;
          } catch (_) { showToast("تعذّر الاتصال أثناء الحفظ. المسودة محفوظة لإعادة المحاولة", "error"); return false; }
        }
      }
    ), screen === "history" && /* @__PURE__ */ React.createElement(
      HistoryScreen,
      {
        employee: employees.find((e) => e.id === ctx.employeeId),
        evaluations: evaluations.filter((e) => e.employee_id === ctx.employeeId),
         cycles: cycles.filter((c) => !c.deleted_at),
         activeCycle,
        session,
        onCancel: async (evId, reason) => {
          const patch = { status: "cancelled", edited_by: session.name, edited_at: nowISO(), cancel_reason: reason };
          const { error } = await supabase.from("evaluations").update(patch).eq("id", evId);
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u0625\u0644\u063A\u0627\u0621: ${error.message}`, "error");
            return;
          }
          setEvaluations((prev) => prev.map((e) => e.id === evId ? { ...e, ...patch } : e));
          const cancelled = evaluations.find(e => e.id === evId);
          const employeeName = employees.find(e => e.id === cancelled?.employee_id)?.name || "موظف";
          await addAudit("إلغاء تقييم", `${employeeName} — ${cancelled?.category_name || "تقييم"}`, reason || "");
          showToast("\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u0642\u064A\u064A\u0645");
        }
      }
    ), screen === "adminHome" && /* @__PURE__ */ React.createElement(
      AdminDashboard,
      {
        employees,
        profiles,
        evaluations,
        notifications:visibleViolations,
        notificationsReady:inboxReady,
        activeCycle,
        computeScore,
        audit,
        displayTarget: displayAuditTarget,
        onGo: (scr, nextCtx) => goto(scr, nextCtx),
        onOpenEmployee: (id) => goto("employee", { employeeId: id }),
        onNewEval: (id) => goto("newEval", { employeeId: id }),
        onOpenNotifications: () => setNotificationsOpen(true)
      }
    ), screen === "adminEmployees" && /* @__PURE__ */ React.createElement(
      AdminEmployees,
      {
        employees,
        onAdd: async (emp) => {
          const { data, error } = await supabase.from("employees").insert(emp).select().single();
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0625\u0636\u0627\u0641\u0629: ${error.message}`, "error");
            return false;
          }
          setEmployees((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name, "ar")));
          await addAudit("\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0638\u0641", emp.name);
          showToast("\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0648\u0638\u0641");
          return true;
        },
        onArchive: async (id, archived) => {
          const { error } = await supabase.from("employees").update({ archived }).eq("id", id);
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error.message}`, "error");
            return;
          }
          setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, archived } : e));
          await addAudit(archived ? "\u0623\u0631\u0634\u0641\u0629 \u0645\u0648\u0638\u0641" : "\u0625\u0639\u0627\u062F\u0629 \u062A\u0641\u0639\u064A\u0644 \u0645\u0648\u0638\u0641", id);
          showToast(archived ? "\u062A\u0645\u062A \u0627\u0644\u0623\u0631\u0634\u0641\u0629" : "\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0639\u064A\u0644");
        },
        onDelete: async (id, name) => {
          const { error } = await supabase.from("employees").delete().eq("id", id);
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062D\u0630\u0641: ${error.message}`, "error");
            return;
          }
          setEmployees((prev) => prev.filter((e) => e.id !== id));
          setEvaluations((prev) => prev.filter((e) => e.employee_id !== id));
          await addAudit("\u062D\u0630\u0641 \u0645\u0648\u0638\u0641 \u0646\u0647\u0627\u0626\u064A\u064B\u0627", name);
          showToast("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0648\u0638\u0641 \u0648\u0643\u0644 \u062A\u0642\u064A\u064A\u0645\u0627\u062A\u0647 \u0646\u0647\u0627\u0626\u064A\u064B\u0627");
        }
      }
    ), screen === "adminUsers" && (isOwner ? /* @__PURE__ */ React.createElement(
      AdminUsers,
      {
        profiles,
        userLookup,
        ownId:session.id,
        onAdd: async (u) => {
          var _a, _b, _c, _d, _e, _f;
          const username = u.username.trim().toLowerCase();
          const realEmail = u.email.trim().toLowerCase();
          const {data,error}=await supabase.functions.invoke("elm-cafe-create-account",{body:u});
          if(error||!data?.id){showToast(data?.error||"تعذر إنشاء الحساب. تأكد من نشر وظيفة إنشاء الحساب وإعداد قاعدة البيانات، ثم راجع التفاصيل في سجل الوظيفة.","error");return false;}
          const newProfile = {
            id: data.id,
            name: u.name,
            role: u?.role,
            active: true,
            can_manage_employees: !!((_c = u.permissions) == null ? void 0 : _c.canManageEmployees),
            can_create_cycle: !!((_d = u.permissions) == null ? void 0 : _d.canCreateCycle),
            can_edit_categories: !!((_e = u.permissions) == null ? void 0 : _e.canEditCategories),
            can_manage_all_evaluations: !!((_f = u.permissions) == null ? void 0 : _f.canManageAllEvaluations)
          };
          setProfiles((prev) => [...prev, newProfile]);
          setUserLookup((prev) => [...prev, { username, email: realEmail, user_id: data.id }]);
          await addAudit("\u0625\u0646\u0634\u0627\u0621 \u0645\u0633\u062A\u062E\u062F\u0645", u.name);
          showToast("\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645");
          return true;
        },
        onToggle: async (id, active) => {
          if (!isOwner || id === session.id) return false;
          const { data, error } = await supabase.from("profiles").update({ active }).eq("id", id).select("id,active");
          if (error || !data?.some(row => row.id === id && row.active === active)) {
            showToast(`تعذّر حفظ حالة الحساب: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, active } : p));
          await addAudit(active ? "\u062A\u0641\u0639\u064A\u0644 \u0645\u0633\u062A\u062E\u062F\u0645" : "\u062A\u0639\u0637\u064A\u0644 \u0645\u0633\u062A\u062E\u062F\u0645", id);
          showToast(active ? "\u062A\u0645 \u0627\u0644\u062A\u0641\u0639\u064A\u0644" : "\u062A\u0645 \u0627\u0644\u062A\u0639\u0637\u064A\u0644");
          return true;
        },
        onUpdatePermissions: async (id, perms) => {
          if (!isOwner || id === session.id) return false;
          const patch = { can_manage_employees: perms.canManageEmployees, can_create_cycle: perms.canCreateCycle, can_edit_categories: perms.canEditCategories, can_manage_all_evaluations: perms.canManageAllEvaluations };
          const { data, error } = await supabase.from("profiles").update(patch).eq("id", id).select("id");
          if (error || !data?.some(row => row.id === id)) {
            showToast(`تعذّر حفظ الصلاحيات: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, ...patch } : p));
          await addAudit("\u062A\u0639\u062F\u064A\u0644 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0645\u0633\u062A\u062E\u062F\u0645", id);
          showToast("\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A");
          return true;
        },
        onDelete: async (id, name) => {
          if (!isOwner || id === session.id) { showToast("لا يمكن حذف هذا الحساب", "error"); return false; }
          const { error } = await supabase.rpc("owner_remove_app_account", { p_id:id });
          if (error) {
            if (error.message.includes("foreign key") || error.code === "23503") {
              showToast("\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0644\u0623\u0646\u0647 \u0642\u0627\u0645 \u0628\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0633\u0627\u0628\u0642\u0629 \u2014 \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u062A\u0639\u0637\u064A\u0644 \u0628\u062F\u0644\u064B\u0627 \u0645\u0646 \u0630\u0644\u0643", "error");
            } else {
              showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062D\u0630\u0641: ${error.message}`, "error");
            }
            return false;
          }
          setProfiles((prev) => prev.filter((p) => p.id !== id));
          setUserLookup(prev=>prev.filter(row=>row.user_id!==id));
          await addAudit("\u062D\u0630\u0641 \u0645\u0633\u062A\u062E\u062F\u0645 \u0646\u0647\u0627\u0626\u064A\u064B\u0627", name);
          showToast("تم حذف وصول المستخدم إلى التطبيق. حساب الدخول في Supabase Auth يُدار منفصلًا.");
          return true;
        }
      }
    ) : React.createElement(EmptyState,{icon:React.createElement(Icon,{svg:ICONS.lock,size:28}),title:"إدارة الحسابات لصاحب التطبيق فقط",body:"لا يمكنك إدارة الحسابات من هذا الحساب."})), screen === "adminCategories" && /* @__PURE__ */ React.createElement(
      AdminCategories,
      {
        ratingBands: ratingBands.filter(b=>!b.deleted_at),
        categories: categories.filter(c=>!c.deleted_at),
        onAddCategory: async (cat) => {
          const { data, error } = await supabase.from("categories").insert(cat).select().single();
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0625\u0636\u0627\u0641\u0629: ${error.message}`, "error");
            return false;
          }
          setCategories((prev) => [...prev, data]);
          await addAudit("\u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641 \u062A\u0642\u064A\u064A\u0645", cat.name);
          showToast("\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062A\u0635\u0646\u064A\u0641");
          return true;
        },
        onUpdateCategory: async (id, patch) => {
          const { error } = await supabase.from("categories").update(patch).eq("id", id);
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062A\u062D\u062F\u064A\u062B: ${error.message}`, "error");
            return;
          }
          setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
          await addAudit("\u062A\u0639\u062F\u064A\u0644 \u062A\u0635\u0646\u064A\u0641 \u062A\u0642\u064A\u064A\u0645", id, JSON.stringify(patch));
          showToast("\u062A\u0645 \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u2014 \u0644\u0646 \u064A\u0624\u062B\u0631 \u0639\u0644\u0649 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629");
        },
        onArchiveCategory: async (id) => {
          const { data, error } = await supabase.from("categories").update({deleted_at:nowISO()}).eq("id",id).is("deleted_at",null).select("id,deleted_at").single();
          if (error || !data) { showToast("تعذّر نقل التصنيف للسلة: "+(error?.message||"راجع الصلاحيات"),"error"); return false; }
          setCategories(prev=>prev.map(c=>c.id===id?{...c,deleted_at:data.deleted_at}:c));
          await addAudit("نقل تصنيف للسلة",id);
          return true;
        },
        onArchiveBand: async (id) => {
          const {error}=await supabase.rpc("archive_rating_band",{p_id:id});
          if(error){showToast("تعذّر نقل النطاق: "+error.message,"error");return false;}
          await refetch();
          await addAudit("نقل نطاق تقييم للسلة",id);
          return true;
        },
        onUpdateBands: async (bands) => {
          const ordered=[...bands].sort((a,b)=>a.min-b.min);
          let next=0;
          for(const b of ordered){if(!Number.isInteger(b.min)||!Number.isInteger(b.max)||b.min!==next||b.max>100||!String(b.label||"").trim()){
            showToast("النطاقات يجب أن تغطي 0 إلى 100 دون فجوات","error");return false;
          }next=b.max+1;}
          if(next!==101){showToast("النطاقات يجب أن تصل إلى 100","error");return false;}
          const {error}=await supabase.rpc("update_rating_bands",{p_bands:ordered.map(b=>({id:b.id,min:b.min,max:b.max,label:b.label}))});
          if(error){showToast("تعذّر تحديث النطاقات: "+error.message,"error");return false;}
          await refetch();
          await addAudit("تعديل نطاقات التقييم","-");
          showToast("تم تحديث نطاقات التقييم");return true;
        }
      }
    ), screen === "adminCycles" && /* @__PURE__ */ React.createElement(
      AdminCycles,
      {
        cycles: cycles.filter((c) => !c.deleted_at),
        employees: employees.filter(e => !e.archived && !e.deleted_at),
        evaluations,
        onOpenReports: (id) => goto("reportsOverall", { cycleId: id }),
        onCreate: async (cy) => {
          if (cycles.some((c) => c.status === "active" && !c.deleted_at)) {
            showToast("\u064A\u0648\u062C\u062F \u0628\u0627\u0644\u0641\u0639\u0644 \u062F\u0648\u0631\u0629 \u0646\u0634\u0637\u0629", "error");
            return false;
          }
          const { data, error } = await supabase.from("cycles").insert(cy).select().single();
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u0625\u0646\u0634\u0627\u0621: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setCycles((prev) => [data, ...prev]);
          await addAudit("\u0625\u0646\u0634\u0627\u0621 \u062F\u0648\u0631\u0629 \u062A\u0642\u064A\u064A\u0645", cy.name);
          showToast("\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062F\u0648\u0631\u0629 \u0648\u062A\u0641\u0639\u064A\u0644\u0647\u0627");
          return true;
        },
        onClose: async (id) => {
          const { data, error } = await supabase.from("cycles").update({ status: "closed" }).eq("id", id).select("id,status");
          if (error || !data?.some(row => row.id === id && row.status === "closed")) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setCycles((prev) => prev.map((c) => c.id === id ? { ...c, status: "closed" } : c));
          await addAudit("\u0625\u063A\u0644\u0627\u0642 \u062F\u0648\u0631\u0629 \u062A\u0642\u064A\u064A\u0645", cycles.find(c => c.id === id)?.name || "دورة");
          showToast("\u062A\u0645 \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u062F\u0648\u0631\u0629");
          return true;
        },
        onReopen: async (id) => {
          if (cycles.some(c => c.id !== id && c.status === "active" && !c.deleted_at)) { showToast("أغلق الدورة النشطة أولًا", "error"); return false; }
          const { data, error } = await supabase.from("cycles").update({ status: "active" }).eq("id", id).select("id,status");
          if (error || !data?.some(row => row.id === id && row.status === "active")) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setCycles((prev) => prev.map((c) => c.id === id ? { ...c, status: "active" } : c));
          await addAudit("\u0625\u0639\u0627\u062F\u0629 \u0641\u062A\u062D \u062F\u0648\u0631\u0629 \u062A\u0642\u064A\u064A\u0645", cycles.find(c => c.id === id)?.name || "دورة");
          showToast("\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u0641\u062A\u062D \u0627\u0644\u062F\u0648\u0631\u0629");
          return true;
        },
        onCancel: async (id) => {
          const { data, error } = await supabase.from("cycles").update({ status: "cancelled" }).eq("id", id).select("id,status");
          if (error || !data?.some(row => row.id === id && row.status === "cancelled")) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setCycles((prev) => prev.map((c) => c.id === id ? { ...c, status: "cancelled" } : c));
          await addAudit("\u0625\u0644\u063A\u0627\u0621 \u062F\u0648\u0631\u0629 \u062A\u0642\u064A\u064A\u0645", cycles.find(c => c.id === id)?.name || "دورة");
          showToast("\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062F\u0648\u0631\u0629");
          return true;
        },
        onTrash: async (id, name) => {
          const deletedAt=nowISO();
          const { data, error } = await supabase.from("cycles").update({ deleted_at: deletedAt }).eq("id", id).select("id,deleted_at");
          if (error || !data?.some(row => row.id === id && !!row.deleted_at)) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setCycles((prev) => prev.map((c) => c.id === id ? { ...c, deleted_at: deletedAt } : c));
          await addAudit("\u0646\u0642\u0644 \u062F\u0648\u0631\u0629 \u062A\u0642\u064A\u064A\u0645 \u0644\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A", name);
          showToast("\u062A\u0645 \u0646\u0642\u0644 \u0627\u0644\u062F\u0648\u0631\u0629 \u0644\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A");
          return true;
        }
      }
    ), screen === "rewardsHub" && session?.role === "super_admin" && React.createElement(RewardsHub, {
      employees:employees.filter(e=>!e.archived&&!e.deleted_at), categories, catalog:rewardCatalog, earnings:rewardEarnings, redemptions:rewardRedemptions, cycleAwards, ready:rewardsReady,
      onOpenEmployee:id=>goto("employee",{employeeId:id}),
      onSaveReward:async reward=>{
        if(!rewardsReady){showToast("شغّل ملف SQL الخاص بالمكافآت أولًا","error");return false;}
        const {data,error}=await supabase.from("employee_reward_catalog").insert({...reward,updated_at:new Date().toISOString()}).select().single();
        if(error){showToast("تعذّر حفظ المكافأة: "+error.message,"error");return false;}
        setRewardCatalog(prev=>[data,...prev]);try{await addAudit("إضافة مكافأة",data.name,JSON.stringify({points_cost:data.points_cost,reward_type:data.reward_type}));}catch(_){}
        showToast("تمت إضافة المكافأة");return true;
      },
      onUpdateReward:async(id,patch)=>{
        const {data,error}=await supabase.from("employee_reward_catalog").update({...patch,updated_at:new Date().toISOString()}).eq("id",id).select().single();
        if(error){showToast("تعذّر تعديل المكافأة: "+error.message,"error");return false;}
        setRewardCatalog(prev=>prev.map(r=>r.id===id?data:r));try{await addAudit("تعديل مكافأة",data.name);}catch(_){}
        showToast("تم تحديث المكافأة");return true;
      },
      onRedeem:async(employeeId,rewardId)=>{
        if(!rewardsReady){showToast("شغّل ملف SQL الخاص بالمكافآت أولًا","error");return false;}
        const {data,error}=await supabase.rpc("redeem_employee_reward",{p_employee_id:employeeId,p_reward_id:rewardId});
        if(error){showToast(error.message.includes("Insufficient positive reward points")?"رصيد النقاط الإيجابية غير كافٍ":"تعذّر تسجيل الصرف. راجع البيانات وحاول مرة أخرى.","error");return false;}
        const redemption=Array.isArray(data)?data[0]:data;
        if(redemption)setRewardRedemptions(prev=>[redemption,...prev]);
        try{await addAudit("صرف مكافأة",redemption?.employee_name||"موظف",JSON.stringify({reward:redemption?.reward_name,points:redemption?.points_spent}));}catch(_){}
        showToast("تم تسجيل صرف المكافأة");return true;
      }
    }), screen === "reportsOverall" && React.createElement(ReportsOverall, {
      employees:employees.filter(e=>!e.archived&&!e.deleted_at), cycles:cycles.filter(c=>!c.deleted_at), initialCycleId:ctx.cycleId,
      evaluations, computeScore, ratingFor, cycleAwards, awardsReady,
      onOpenEmployee:id=>goto("employee",{employeeId:id}),
      onAward:async payload=>{
        if(!awardsReady){showToast("شغّل ملف إعداد سجل الفائز في Supabase أولًا","error");return false;}
        if(session?.role!=="super_admin"){showToast("اعتماد الفائز متاح للمدير الأعلى فقط","error");return false;}
        const row={...payload,chosen_by:session.id,chosen_by_name:session.name};
        const {data,error}=await supabase.from("cycle_awards").insert(row).select().single();
        if(error){if(error.code==="23505"){showToast("تم اعتماد فائز لهذه الدورة من قبل. حدّث الصفحة لعرض السجل.","error");await refetch();}else showToast("تعذّر حفظ الفائز: "+error.message,"error");return false;}
        setCycleAwards(prev=>[data,...prev]);
        try{await addAudit("اعتماد فائز الدورة",payload.cycle_name,JSON.stringify({employee_name:payload.employee_name,score:payload.score,evaluation_count:payload.evaluation_count,tied_employee_count:payload.tied_employee_count}));}catch(_){}
        showToast("تم حفظ الفائز: "+payload.employee_name);return true;
      }
    }),    ), screen === "evaluatorActivity" && /* @__PURE__ */ React.createElement(EvaluatorActivityScreen, { evaluations, activeCycle, cycles: cycles.filter((c) => !c.deleted_at) }), screen === "auditLog" && /* @__PURE__ */ React.createElement(
      AuditLogScreen,
      {
        audit: audit.filter((a) => !a.deleted_at),
        displayTarget: displayAuditTarget,
        onTrash: async (id) => {
          const movedAt = nowISO();
          const { data, error } = await supabase.from("audit_log").update({ deleted_at: movedAt }).eq("id", id).select("id");
          if (error || !data?.some((row) => row.id === id)) {
            showToast(error ? `\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error.message}` : "لم يُحفظ نقل السجل. راجع صلاحية تحديث سجل التدقيق.", "error");
            return;
          }
          setAudit((prev) => prev.map((a) => a.id === id ? { ...a, deleted_at: movedAt } : a));
        },
        onTrashAll: async () => {
          const ids = audit.filter((a) => !a.deleted_at).map((a) => a.id);
          if (!ids.length) return true;
          const movedAt = nowISO();
          const { data, error } = await mutateRowsByIds("audit_log","update",ids,{deleted_at:movedAt});
          const changedIds = (data || []).map((row) => row.id);
          if (error || changedIds.length !== ids.length) {
            showToast(error ? `\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error.message}` : "لم تُنقل كل السجلات. راجع صلاحية تحديث سجل التدقيق.", "error");
            await refetch();
            return false;
          }
          setAudit((prev) => prev.map((a) => ids.includes(a.id) ? { ...a, deleted_at: movedAt } : a));
          showToast("\u062A\u0645 \u0646\u0642\u0644 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u0644\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A");
          return true;
        }
      }
    ), screen === "trash" && /* @__PURE__ */ React.createElement(
      TrashScreen,
      {
        cycles: cycles.filter((c) => c.deleted_at),
        audit: audit.filter((a) => a.deleted_at),
        archivedCategories:categories.filter(c=>c.deleted_at),
        archivedBands:ratingBands.filter(b=>b.deleted_at),
        onRestoreCategory:async id=>{
          const {data,error}=await supabase.from("categories").update({deleted_at:null}).eq("id",id).not("deleted_at","is",null).select("id");
          if(error||!data?.length){showToast("تعذّر استرجاع التصنيف: "+(error?.message||"راجع الصلاحيات"),"error");return;}
          setCategories(prev=>prev.map(c=>c.id===id?{...c,deleted_at:null}:c));
        },
        onRestoreBand:async id=>{
          const {error}=await supabase.rpc("restore_rating_band",{p_id:id});
          if(error){showToast("تعذّر استرجاع النطاق: "+error.message,"error");return;}
          await refetch();
        },
        onRestoreCycle: async (id) => {
          const { error } = await supabase.from("cycles").update({ deleted_at: null }).eq("id", id);
          if (error) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error.message}`, "error");
            return;
          }
          setCycles((prev) => prev.map((c) => c.id === id ? { ...c, deleted_at: null } : c));
          showToast("\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0627\u0644\u062F\u0648\u0631\u0629");
        },
        onDeleteCycleForever: async (id) => {
          const { data, error } = await supabase.from("cycles").delete().eq("id", id).not("deleted_at", "is", null).select("id");
          if (error || !data?.some(row => row.id === id)) {
            showToast(error ? `\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062D\u0630\u0641: ${error.message}` : "لم تُحذف الدورة من قاعدة البيانات. راجع صلاحية الحذف النهائي.", "error");
            await refetch();
            return false;
          }
          setCycles((prev) => prev.filter((c) => c.id !== id));
           setEvaluations((prev) => prev.filter((e) => e.cycle_id !== id));
          showToast("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u062F\u0648\u0631\u0629 \u0646\u0647\u0627\u0626\u064A\u064B\u0627");
          return true;
        },
        onRestoreAudit: async (id) => {
          const { data, error } = await supabase.from("audit_log").update({ deleted_at: null }).eq("id", id).select("id");
          if (error || !data?.some((row) => row.id === id)) {
            showToast(error ? `\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error.message}` : "لم يُحفظ استرجاع السجل. راجع صلاحية تحديث سجل التدقيق.", "error");
            return;
          }
          setAudit((prev) => prev.map((a) => a.id === id ? { ...a, deleted_at: null } : a));
        },
        onDeleteAuditForever: async (id) => {
          const { data, error } = await supabase.from("audit_log").delete().eq("id", id).not("deleted_at", "is", null).select("id");
          if (error || !data?.some(row => row.id === id)) {
            showToast(error ? `\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062D\u0630\u0641: ${error.message}` : "لم يُحذف السجل من قاعدة البيانات. راجع صلاحية الحذف النهائي.", "error");
            await refetch();
            return false;
          }
          setAudit((prev) => prev.filter((a) => a.id !== id));
          return true;
        },
        onEmptyTrash: async () => {
          const cycleIds = cycles.filter((c) => c.deleted_at).map((c) => c.id);
          const auditIds = audit.filter((a) => a.deleted_at).map((a) => a.id);
          if (cycleIds.length) {
            const { data, error } = await mutateRowsByIds("cycles","delete",cycleIds);
            if (error || data?.length !== cycleIds.length || !cycleIds.every(id => data.some(row => row.id === id))) {
              showToast(error ? `تعذّر حذف الدورات: ${error.message}` : "لم تُحذف كل الدورات من قاعدة البيانات. راجع صلاحية الحذف النهائي.", "error");
              await refetch();
              return false;
            }
            setCycles(prev => prev.filter(c => !cycleIds.includes(c.id)));
             setEvaluations(prev => prev.filter(e => !cycleIds.includes(e.cycle_id)));
          }
          if (auditIds.length) {
            const { data, error } = await mutateRowsByIds("audit_log","delete",auditIds);
            if (error || data?.length !== auditIds.length || !auditIds.every(id => data.some(row => row.id === id))) {
              showToast(error ? `تعذّر حذف السجل: ${error.message}` : "لم تُحذف كل أحداث السجل من قاعدة البيانات. راجع صلاحية الحذف النهائي.", "error");
              await refetch();
              return false;
            }
            setAudit(prev => prev.filter(a => !auditIds.includes(a.id)));
          }
          showToast("تم إفراغ سلة المهملات نهائيًا");
          return true;
        }
      }
    ), screen === "moreMenu" && /* @__PURE__ */ React.createElement(MoreMenuScreen, { onGo: (scr) => goto(scr), isOwner })), session?.role === "super_admin" && /* @__PURE__ */ React.createElement(BottomNav, { activeScreen: screen, onSelect: gotoTab }), /* @__PURE__ */ React.createElement(Toast, { toast }), (pullState || refreshing) && React.createElement("div", { className:"pull-status", role:"status" }, refreshing ? "جارٍ تحديث البيانات…" : pullState === "ready" ? "اترك الشاشة للتحديث" : "اسحب للتحديث"), confirmLogout && React.createElement(Modal, { title:"تسجيل الخروج", onClose:()=>setConfirmLogout(false), footer:React.createElement(React.Fragment,null,React.createElement(Btn,{variant:"primary",onClick:()=>{setConfirmLogout(false);logout();}},"تأكيد الخروج"),React.createElement(Btn,{variant:"ghost",onClick:()=>setConfirmLogout(false)},"البقاء")) }, "سيتم إغلاق جلسة حسابك على هذا الجهاز."), pendingNav && /* @__PURE__ */ React.createElement(Modal, { compact:true, title: "\u0644\u062F\u064A\u0643 \u062A\u063A\u064A\u064A\u0631\u0627\u062A \u063A\u064A\u0631 \u0645\u062D\u0641\u0648\u0638\u0629", onClose: () => setPendingNav(null), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: () => {
      const f = pendingNav;
      setPendingNav(null);
      f();
    } }, "\u0646\u0639\u0645\u060C \u062E\u0631\u0648\u062C \u0628\u062F\u0648\u0646 \u062D\u0641\u0638"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setPendingNav(null) }, "\u0644\u0627\u060C \u0627\u0644\u0628\u0642\u0627\u0621 \u0648\u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--ink-2)" } }, "\u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u062E\u0631\u0648\u062C \u0628\u062F\u0648\u0646 \u062D\u0641\u0638 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u062D\u0627\u0644\u064A\u061F \u0633\u062A\u0628\u0642\u0649 \u0627\u0644\u0645\u0633\u0648\u062F\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632 \u0644\u0648 \u0631\u062C\u0639\u062A \u0644\u0627\u062D\u0642\u064B\u0627.")), notificationsOpen && /* @__PURE__ */ React.createElement(
      NotificationsModal,
      {
        evaluations:visibleViolations,
        employees,
        onClose: () => setNotificationsOpen(false),
        onEnablePush: async () => {
          try { await enableDevicePush(session.id); showToast('تم تشغيل إشعارات المخالفات على هذا الجهاز'); return true; }
          catch(error){showToast(error?.message||'تعذّر تشغيل إشعارات الجهاز','error');return false;}
        },
        onDisablePush: async () => {
          try { await disableDevicePush(); showToast('تم إيقاف إشعارات هذا الجهاز'); return true; }
          catch(error){showToast(error?.message||'تعذّر إيقاف إشعارات الجهاز','error');return false;}
        },
        onReview: async (evId) => {
          const item=visibleViolations.find(e=>e.id===evId);
          if(!item)return;
          const reviewedAt=new Date().toISOString();
          const {data,error} = await supabase.from("violation_inbox").update({ read_at:reviewedAt }).eq("id", item.inbox_id).select("id");
          if (error || !data?.some(row=>row.id===item.inbox_id)) {
            showToast(`تعذّرت مراجعة الإشعار: ${error?.message||"راجع صلاحية الحساب"}`, "error");
            return;
          }
          setViolationInbox(prev=>prev.map(row=>row.id===item.inbox_id?{...row,read_at:reviewedAt}:row));
        }
      }
    ));
  }
  function titleFor(screen, ctx, employees) {
    const emp = employees.find((e) => e.id === ctx.employeeId);
    switch (screen) {
      case "home":
        return "\u0627\u0644\u0645\u0648\u0638\u0641\u0648\u0646";
      case "employee":
        return emp ? emp.name : "\u0627\u0644\u0645\u0648\u0638\u0641";
      case "newEval":
        return "\u062A\u0642\u064A\u064A\u0645 \u062C\u062F\u064A\u062F";
      case "evaluationsLog":
        return "سجل تقييمات الدورة";
      case "history":
        return "\u0633\u062C\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A";
      case "adminHome":
        return "\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645";
      case "adminEmployees":
        return "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646";
      case "adminUsers":
        return "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646";
      case "adminCategories":
        return "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645";
      case "adminCycles":
        return "\u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645";
      case "rewardsHub":
        return "المكافآت والجوائز";
      case "reportsOverall":
        return "\u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0639\u0627\u0645";
      case "evaluatorActivity":
        return "\u0646\u0634\u0627\u0637 \u0627\u0644\u0645\u0642\u064A\u0651\u0645\u064A\u0646";
      case "auditLog":
        return "\u0633\u062C\u0644 \u0627\u0644\u062A\u062F\u0642\u064A\u0642";
      case "moreMenu":
        return "\u0627\u0644\u0645\u0632\u064A\u062F";
      case "trash":
        return "\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A";
      default:
        return "ELM CAFE";
    }
  }
  function LoginScreen({ onLogin, onReset, theme, onToggleTheme }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const submitLock = useRef(false);
    const [resetMsg, setResetMsg] = useState("");
    async function submit(e) {
      e.preventDefault();
      if (submitLock.current) return;
      submitLock.current = true;
      setErr("");
      setBusy(true);
      try {
        const errMsg = await onLogin(username, password);
        if (errMsg) setErr(errMsg);
      } catch (_) {
        setErr(navigator.onLine ? "تعذّر التحقق من الحساب. حاول مرة أخرى." : "لا يوجد اتصال بالإنترنت.");
      } finally { setBusy(false); submitLock.current = false; }
    }
    async function reset() {
      if (!username.trim()) {
        setErr("\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648\u0644\u064B\u0627");
        return;
      }
      try { await onReset(username); }
      catch (_) { setErr("تعذّر طلب رابط الاستعادة. تحقق من الإنترنت وحاول مرة أخرى."); return; }
      setResetMsg("\u0644\u0648 \u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0648\u062C\u0648\u062F\u060C \u0647\u064A\u0648\u0635\u0644\u0643 \u0631\u0627\u0628\u0637 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0645\u0633\u062C\u0644.");
    }
    return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", background: "radial-gradient(ellipse 70% 50% at 50% 0%, var(--forest-10), transparent)", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "login-theme-button", onClick: onToggleTheme, "aria-label": theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي" }, /* @__PURE__ */ React.createElement(Icon, { svg: theme === "dark" ? ICONS.sun : ICONS.moon, size: 18 })), /* @__PURE__ */ React.createElement("button", { type:"button", className:"login-language-button", onClick:()=>window.ElmI18n?.setLanguage(window.ElmI18n.getLanguage()==="ar"?"en":"ar"), "aria-label":"Switch language" }, window.ElmI18n?.getLanguage()==="ar"?"EN":"ع"), /* @__PURE__ */ React.createElement("img", { src: LOGO_SRC, alt: "", "aria-hidden": "true", style: { position: "absolute", width: 520, height: "auto", opacity: 0.05, top: "-8%", right: "-18%", transform: "rotate(8deg)", pointerEvents: "none", filter: "grayscale(1)" } }), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Logo, { size: 108 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", textAlign: "center" } }, "ELM CAFE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-3)", marginTop: 5, marginBottom: 30, textAlign: "center" } }, "\u0646\u0638\u0627\u0645 \u062A\u0642\u064A\u064A\u0645 \u0623\u062F\u0627\u0621 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646"), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { ...s.card, maxWidth: "100%" } }, /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: username, onChange: (e) => setUsername(e.target.value), autoCapitalize: "none", autoCorrect: "off", autoFocus: true })), /* @__PURE__ */ React.createElement(Field, { label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showPw ? "text" : "password", style: { ...s.input, paddingLeft: 42 }, value: password, onChange: (e) => setPassword(e.target.value) }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowPw((v) => !v), style: { position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--ink-3)", display: "flex" }, "aria-label": "\u0625\u0638\u0647\u0627\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }, /* @__PURE__ */ React.createElement(Icon, { svg: showPw ? ICONS.eyeOff : ICONS.eye, size: 17 })))), err && /* @__PURE__ */ React.createElement("div", { style: s.errText }, err), resetMsg && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--forest)", marginBottom: 10 } }, resetMsg), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", type: "submit", disabled: busy, style: { width: "100%", marginTop: 8 } }, busy ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062F\u062E\u0648\u0644\u2026" : "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: reset, style: { background: "none", border: "none", color: "var(--ink-3)", fontSize: 12, marginTop: 16, cursor: "pointer", width: "100%" } }, "\u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061F"))));
  }
  function ResetPasswordScreen({ onSubmit }) {
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    async function submit(e) {
      e.preventDefault();
      setErr("");
      if (pw.length < 6) {
        setErr("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644");
        return;
      }
      if (pw !== pw2) {
        setErr("\u0643\u0644\u0645\u062A\u0627 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u062A\u0637\u0627\u0628\u0642\u062A\u064A\u0646");
        return;
      }
      setBusy(true);
      const errMsg = await onSubmit(pw);
      setBusy(false);
      if (errMsg) setErr(errMsg);
    }
    return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", background: "radial-gradient(ellipse 70% 50% at 50% 0%, var(--forest-10), transparent)" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 24 } }, /* @__PURE__ */ React.createElement(Logo, { size: 54 }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, marginTop: 14 } }, "\u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062C\u062F\u064A\u062F\u0629"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-3)", marginTop: 4 } }, "\u0627\u062E\u062A\u0631 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062C\u062F\u064A\u062F\u0629 \u0644\u062D\u0633\u0627\u0628\u0643")), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { ...s.card, maxWidth: 340 } }, /* @__PURE__ */ React.createElement(Field, { label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629" }, /* @__PURE__ */ React.createElement("input", { type: "password", style: s.input, value: pw, onChange: (e) => setPw(e.target.value), autoFocus: true })), /* @__PURE__ */ React.createElement(Field, { label: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }, /* @__PURE__ */ React.createElement("input", { type: "password", style: s.input, value: pw2, onChange: (e) => setPw2(e.target.value) })), err && /* @__PURE__ */ React.createElement("div", { style: s.errText }, err), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", type: "submit", disabled: busy, style: { width: "100%", marginTop: 8 } }, busy ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631")));
  }
  function EvaluatorHome({ employees, activeCycle, session, evaluations, onOpen, onProfile, onGo, initialEvaluationId }) {
    const h = React.createElement;
    const [query, setQuery] = useState("");
    const current = activeCycle ? evaluations.filter(e => e.cycle_id === activeCycle.id && e.status === "active") : [];
    const filtered = employees.filter(e => (e.name || "").includes(query) || String(e.employee_code || "").includes(query));
    return h("div", { className:"work-screen evaluation-hub" },
      h("header", { className:"evaluation-hub-head" },
        h("span", { className:"eyebrow" }, "تقييمات الفريق"),
        h("h1", null, "سجّل تقييمًا"),
        h("p", null, activeCycle ? `الدورة: ${activeCycle.name} · اختر الموظف، ثم نوع التقييم وسببه.` : "افتح دورة تقييم أولًا لتسجيل الملاحظات.")),
      activeCycle ? h(React.Fragment, null,
        h("section", { className:"dashboard-panel" },
          h("div", { className:"section-heading" }, h("h2", null, "اختر الموظف"), h("button", { type:"button", className:"text-action", onClick:()=>onGo("evaluationsLog") }, "سجل الدورة")),
          h("input", { className:"modern-search", value:query, onChange:e=>setQuery(e.target.value), placeholder:"بحث اختياري بالاسم أو الرقم", "aria-label":"بحث اختياري عن موظف" }),
          filtered.length ? h("div", { className:"quick-evaluation-grid" }, filtered.map(e => h("div", { key:e.id, className:"quick-evaluation-item" },
            h("button", { type:"button", className:"quick-evaluation-pick", onClick:()=>onOpen(e) },
              h("span", { className:"person-avatar", style:{background:avatarColor(e.name).bg,color:avatarColor(e.name).fg} }, e.name.trim().slice(0,1)),
              h("span", null, h("strong", null, e.name), h("small", null, e.profession || "موظف")),
              h(Icon, { svg:ICONS.plus, size:17 })),
            h("button", { type:"button", className:"quick-evaluation-profile", onClick:()=>onProfile(e), "aria-label":`فتح ملف ${e.name}` }, "الملف")))) : h("p", null, "لا يوجد موظف بهذا الاسم."))) : h(EmptyState, { icon:h(Icon,{svg:ICONS.clock,size:28}), title:"لا توجد دورة نشطة", body:"افتح دورة تقييم من مركز التحكم." }));
  }
  function EvaluationsLog({ employees, evaluations, activeCycle, initialEvaluationId }) {
    const h=React.createElement;
    const [selectedId,setSelectedId]=useState(initialEvaluationId || null);
    const [visibleCount,setVisibleCount]=useState(20);
    const [query,setQuery]=useState("");
    useEffect(()=>setSelectedId(initialEvaluationId || null),[initialEvaluationId]);
    const all=activeCycle?evaluations.filter(e=>e.cycle_id===activeCycle.id&&e.status==="active").slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)):[];
    const filtered=all.filter(e=>!query || (e.category_name||"").includes(query) || (employees.find(emp=>emp.id===e.employee_id)?.name||"").includes(query));
    const selected=all.find(e=>e.id===selectedId);
    return h("div",{className:"evaluation-log-screen"},
      h("header",{className:"evaluation-log-heading"},h("span",{className:"eyebrow"},activeCycle?.name||"الدورة الحالية"),h("h1",null,"سجل التقييمات"),h("p",null,"كل التقييمات المسجلة في الدورة، الأحدث أولًا.")),
      h("input",{className:"modern-search",value:query,onChange:e=>{setQuery(e.target.value);setVisibleCount(20);},placeholder:"بحث باسم الموظف أو بند التقييم","aria-label":"بحث في سجل التقييمات"}),
      filtered.length?h("div",{className:"evaluation-activity-list"},filtered.slice(0,visibleCount).map(e=>h("button",{key:e.id,type:"button",className:"evaluation-activity-item",onClick:()=>setSelectedId(e.id)},
        h("span",{className:e.type==="positive"?"evaluation-sign positive":"evaluation-sign negative"},e.type==="positive"?`+${e.category_points}`:`−${e.category_points}`),
        h("span",{className:"evaluation-activity-main"},h("strong",null,employees.find(emp=>emp.id===e.employee_id)?.name||"موظف"),h("small",null,e.category_name||"تقييم"," · ",e.evaluator_name||"مقيم")),
        h("span",{className:"evaluation-activity-date"},relTime(e.created_at)))),filtered.length>visibleCount&&h("button",{type:"button",className:"profile-primary-action",onClick:()=>setVisibleCount(n=>n+20)},"عرض المزيد")):
        h("div",{className:"dash-empty"},"لا توجد تقييمات مطابقة."),
      selected&&h(EvaluationDetailModal,{evaluation:selected,employees,onClose:()=>setSelectedId(null)}));
  }
  function EvaluationDetailModal({ evaluation, employees, onClose }) {
    const h=React.createElement;
    const employeeName=employees.find(emp=>emp.id===evaluation.employee_id)?.name||"موظف";
    return h(Modal,{title:"تفاصيل التقييم",compact:true,onClose,footer:h(Btn,{onClick:onClose},"إغلاق")},
      h("div",{className:"evaluation-detail"},
        h("strong",null,employeeName),
        h("p",null,evaluation.type==="positive"?"إيجابي":"سلبي"," · ",evaluation.category_name," · ",evaluation.type==="positive"?"+":"−",evaluation.category_points," نقاط"),
        h("p",null,"المقيم: ",evaluation.evaluator_name||"—"),
        h("p",null,"التاريخ: ",fmtDateTime(evaluation.created_at)),
        evaluation.is_violation&&h("p",null,"تنبيه مخالفة"),
        h("div",{className:"evaluation-detail-note"},h("small",null,"سبب التقييم"),h("p",null,evaluation.note||"لم يُسجل وصف إضافي."))));
  }
  function EmployeeDetail({ employee, activeCycle, cycles = [], evaluations, computeScore, ratingFor, onNewEval, onHistory, onOpenRewards=()=>{}, canManageRewards=false, rewardsReady=false, rewardEarnings=[], rewardRedemptions=[], managerName="إدارة الكافيه" }) {
    const h = React.createElement;
    const [certificateOpen,setCertificateOpen]=useState(false);
    const [certificateCycleId,setCertificateCycleId]=useState("");
    if (!employee) return h(EmptyState, { icon: h(Icon, { svg: ICONS.users, size: 28 }), title: "الموظف غير موجود", body: "" });
    const all = evaluations.filter(e => e.employee_id === employee.id && cycles.some(c => c.id === e.cycle_id));
    const evs = activeCycle ? all.filter(e => e.cycle_id === activeCycle.id && e.status === "active") : [];
    const score = evs.length ? computeScore(employee.id, activeCycle.id) : null;
    const positive = evs.filter(e => e.type === "positive").length;
    const negative = evs.filter(e => e.type === "negative").length;
    const positivePoints = evs.filter(e=>e.type==="positive").reduce((sum,e)=>sum+(Number(e.category_points)||0),0);
    const negativePoints = evs.filter(e=>e.type==="negative").reduce((sum,e)=>sum+(Number(e.category_points)||0),0);
    const rawScore = 100 + positivePoints - negativePoints;
    const evaluatorCount = new Set(evs.map(e => e.evaluator_id || e.evaluator_name)).size;
    const recent = all.slice().sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 2);
    const cycleRows = cycles.map(c => {
      const records = all.filter(e => e.cycle_id === c.id && e.status === "active");
      return { cycle:c, count:records.length, score:records.length ? computeScore(employee.id,c.id) : null };
    }).filter(row => row.count).slice(0, 4);
    const employeeEarned = rewardEarnings.filter(r=>r.employee_id===employee.id&&r.active).reduce((sum,r)=>sum+(Number(r.points)||0),0);
    const employeeSpent = rewardRedemptions.filter(r=>r.employee_id===employee.id).reduce((sum,r)=>sum+(Number(r.points_spent)||0),0);
    const rewardBalance = Math.max(0,employeeEarned-employeeSpent);
    const rewardDebt = Math.max(0,employeeSpent-employeeEarned);
    const certificateCycles = cycles.filter(c=>c.status==="closed"&&evaluations.some(e=>e.employee_id===employee.id&&e.cycle_id===c.id&&e.status==="active"&&e.type==="positive"));
    const chosenCertificateCycle = certificateCycles.find(c=>c.id===certificateCycleId)||certificateCycles[0]||null;
    const certificateEvals = chosenCertificateCycle ? evaluations.filter(e=>e.employee_id===employee.id&&e.cycle_id===chosenCertificateCycle.id&&e.status==="active") : [];
    const certificatePositive = certificateEvals.filter(e=>e.type==="positive");
    const certificatePoints = certificatePositive.reduce((sum,e)=>sum+(Number(e.category_points)||0),0);
    const byCategory = Object.values(evs.reduce((acc, e) => {
      const key = e.category_id || `${e.type}:${e.category_name}`;
      if (!acc[key]) acc[key] = { name:e.category_name, type:e.type, count:0 };
      acc[key].count++;
      return acc;
    }, {})).sort((a,b) => b.count - a.count).slice(0, 5);
    return h("div", { className:"employee-profile" },
      h("section", { className:"profile-hero" },
        h("span", { className:"person-avatar", style:{ background:avatarColor(employee.name).bg, color:avatarColor(employee.name).fg } }, employee.name.trim().slice(0,1)),
        h("span", { className:"eyebrow" }, "لوحة الموظف"), h("h1", null, employee.name),
        h("p", null, employee.profession || "موظف", " · رقم ", employee.employee_code),
        h("div", { className:"profile-score" }, h("strong", null, score === null ? "—" : Math.round(score)), h("span", null, score === null ? "لم يُقيّم في الدورة الحالية" : `${ratingFor(score)} · من 100`)),
        h("small", { className:"profile-cycle-label" }, activeCycle ? activeCycle.name : "لا توجد دورة نشطة")),
      h("button", { type:"button", className:"profile-primary-action", onClick:onNewEval, disabled:!activeCycle || !!employee.archived || !!employee.deleted_at }, h(Icon,{svg:ICONS.plus,size:19}), employee.archived || employee.deleted_at ? "الموظف غير متاح للتقييم" : "تقييم جديد لهذا الموظف"),
      h("div", { className:"report-stats profile-stats" }, [["تقييمات",evs.length],["مقيمون",evaluatorCount],["إيجابي",positive],["سلبي",negative]].map(([label,value]) => h("div", { key:label }, h("strong", null,value), h("small",null,label)))),
      canManageRewards && rewardsReady && h("section",{className:"employee-reward-balance"},h("div",null,h("span",{className:"eyebrow"},"رصيد المكافآت"),h("strong",null,rewardBalance," نقطة"),h("small",null,rewardDebt?"مطلوب استعادة "+rewardDebt+" نقطة بعد تعديل تقييم مُلغى":employeeEarned+" إيجابي مكتسب · "+employeeSpent+" نقطة مصروفة")),h("button",{type:"button",onClick:onOpenRewards},"إدارة المكافآت")),
      canManageRewards && h("section",{className:"certificate-launch"},h("div",null,h("span",{className:"eyebrow"},"تقدير الأداء"),h("strong",null,"شهادة شهرية"),h("small",null,certificateCycles.length?"جاهزة للدورات المغلقة التي تحتوي نقاطًا إيجابية.":"تظهر بعد إغلاق دورة بها نقاط إيجابية.")),h("button",{type:"button",disabled:!certificateCycles.length,onClick:()=>{setCertificateCycleId(certificateCycles[0]?.id||"");setCertificateOpen(true);}},"إنشاء شهادة PDF")),
      activeCycle && h("section",{className:"score-breakdown"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"شفافية النقاط"),h("h2",null,"طريقة حساب النتيجة"))),
        h("div",{className:"score-formula"},h("span",null,"الرصيد الأساسي"),h("strong",null,"100"),h("span",{className:"positive-text"},"+ ",positivePoints," إيجابي"),h("span",{className:"negative-text"},"− ",negativePoints," سلبي"),h("b",null,"= ",score===null?"—":Math.round(score)," من 100")),
        h("small",{className:"score-cap-note"},rawScore>100?"تم إيقاف النتيجة عند الحد الأعلى 100.":rawScore<0?"تم إيقاف النتيجة عند الحد الأدنى 0.":"كل تقييم نشط يضيف أو يخصم نقاطه المحفوظة وقت التسجيل.")),
      h("div", { className:"profile-actions" }, h("button",{type:"button",onClick:onHistory},h(Icon,{svg:ICONS.clipboard,size:17}),"السجل الكامل")),
      h("section", { className:"dashboard-panel" }, h("div", { className:"section-heading" }, h("div",null,h("span",{className:"eyebrow"},"الدورة الحالية"),h("h2",null,"أكثر البنود تسجيلًا"))),
        byCategory.length ? h("div",{className:"profile-category-grid"},byCategory.map(row => h("div",{key:`${row.type}:${row.name}`,className:"profile-category"},h("span",{className:row.type === "positive" ? "category-dot positive" : "category-dot"}),h("strong",null,row.name),h("span",null,row.count," مرة")))) : h("div",{className:"dash-empty"},"ستظهر هنا البنود بعد تسجيل تقييمات هذه الدورة.")),
      h("section", { className:"dashboard-panel" }, h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"المقارنة"),h("h2",null,"الأداء عبر الدورات"))),
        cycleRows.length ? h("div",{className:"cycle-comparison"},cycleRows.map(row => h("div",{key:row.cycle.id,className:"cycle-comparison-row"},h("span",null,row.cycle.name),h("div",{className:"comparison-track"},h("span",{style:{width:`${Math.min(100,Math.max(0,row.score))}%`}})),h("strong",null,Math.round(row.score)),h("small",null,row.count," تقييم")))) : h("div",{className:"dash-empty"},"لا توجد دورات بها تقييمات لهذا الموظف.")),
      h("section", { className:"dashboard-panel" },h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"الخط الزمني"),h("h2",null,"آخر التقييمات")),h("button",{type:"button",className:"text-action",onClick:onHistory},"عرض الكل")),
        recent.length ? h("div",{className:"profile-history"},recent.map(e => h(EvalRow,{key:e.id,e}))) : h("div",{className:"dash-empty"},"لا توجد تقييمات مسجلة بعد.")),
      certificateOpen && chosenCertificateCycle && h("div",{className:"certificate-overlay"},h("section",{className:"certificate-print",dir:"rtl"},h("button",{type:"button",className:"certificate-close no-print",onClick:()=>setCertificateOpen(false),"aria-label":"إغلاق"},"×"),h("div",{className:"certificate-frame"},h("img",{src:LOGO_SRC,alt:"ELM CAFE",className:"certificate-logo"}),h("span",{className:"certificate-brand"},"ELM CAFE"),h("span",{className:"certificate-eyebrow"},"شهادة تقدير شهرية"),h("h1",null,"تُمنح هذه الشهادة إلى"),h("h2",null,employee.name),h("p",{className:"certificate-profession"},employee.profession||"موظف"," · رقم الموظف ",employee.employee_code||"—"),h("p",{className:"certificate-copy"},"تقديرًا لالتزامه ومساهمته الإيجابية خلال دورة التقييم، واعترافًا بجهده في دعم فريق العمل."),h("div",{className:"certificate-period"},h("span",null,chosenCertificateCycle.name),h("small",null,fmtDate(chosenCertificateCycle.start_date)," — ",fmtDate(chosenCertificateCycle.end_date))),h("div",{className:"certificate-stats"},h("div",null,h("strong",null,certificatePoints),h("small",null,"نقطة إيجابية")),h("div",null,h("strong",null,certificatePositive.length),h("small",null,"إنجازًا إيجابيًا")),h("div",null,h("strong",null,Math.round(computeScore(employee.id,chosenCertificateCycle.id))," / 100"),h("small",null,"النتيجة النهائية"))),h("footer",{className:"certificate-signature"},h("span",null,h("small",null,"تاريخ الإصدار"),h("strong",null,new Date().toLocaleDateString("ar-EG"))),h("span",null,h("i",null,managerName),h("small",null,"إدارة ELM CAFE"))),h("div",{className:"certificate-actions no-print"},h("button",{type:"button",onClick:()=>setTimeout(()=>window.print(),120)},"طباعة / حفظ PDF"),h("small",{className:"certificate-share-hint"},"احفظ الشهادة بصيغة PDF، ثم أرفقها من ملفات الجهاز في واتساب."),h("button",{type:"button",onClick:()=>setCertificateOpen(false)},"إغلاق"))))));
  }
  function EvalRow({ e }) {
    const isPos = e.type === "positive";
    return /* @__PURE__ */ React.createElement("div", { style: { ...s.rowCard, cursor: "default", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: e.status === "cancelled" ? "var(--ink-4)" : isPos ? "var(--green)" : "var(--red)", flexShrink: 0, marginTop: 6 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "right", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: e.status === "cancelled" ? "var(--ink-3)" : "var(--ink)", textDecoration: e.status === "cancelled" ? "line-through" : "none" } }, e.category_name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-3)" } }, e.evaluator_name, " \xB7 ", fmtDateTime(e.created_at)), e.note && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-2)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, e.note)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: isPos ? "var(--green)" : "var(--red)", flexShrink: 0 } }, isPos ? "+" : "-", e.category_points));
  }
  const AI_NOTE_AREAS = [
    ["service", "خدمة العملاء"], ["cleanliness", "النظافة والترتيب"],
    ["punctuality", "الالتزام بالمواعيد"], ["teamwork", "التعاون"],
    ["orders", "دقة الطلبات"], ["safety", "السلامة"],
    ["stock", "تنظيم المخزون"], ["initiative", "المبادرة"]
  ];
  function NewEvaluationScreen({ employee, categories, activeCycle, session, hasUnsavedRef, onDone }) {
    const draftKey = `elm_draft_${session.id}_${activeCycle?.id || "none"}_${employee?.id || "none"}`;
    const legacyDraftKey = `elm_draft_${session.id}_${employee?.id || "none"}`;
    const [category, setCategory] = useState(null);
    const [note, setNote] = useState("");
    const [isViolation, setIsViolation] = useState(false);
    const [aiArea, setAiArea] = useState("service");
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [aiError, setAiError] = useState("");
    const [aiBusy, setAiBusy] = useState(false);
    const aiRequestId = useRef(0);
    const [saving, setSaving] = useState(false);
    const savingLock = useRef(false);
    const [hasDraft, setHasDraft] = useState(false);
    const [restored, setRestored] = useState(false);
    const categoryPressRef = useRef(null);
    useEffect(() => {
      try {
        setHasDraft(!!(localStorage.getItem(draftKey) || localStorage.getItem(legacyDraftKey)));
      } catch (e) {
      }
    }, [draftKey, legacyDraftKey]);
    function restoreDraft() {
      try {
        const raw = localStorage.getItem(draftKey) || localStorage.getItem(legacyDraftKey);
        if (!raw) return;
        const d = JSON.parse(raw);
        const validCategory = categories.find(c => c.id === d.category?.id && c.active && !c.deleted_at);
        setCategory(validCategory || null);
        setNote(typeof d.note === "string" ? d.note : "");
        setIsViolation(!!d.isViolation && validCategory?.type === "negative");
        setRestored(true);
        setHasDraft(false);
        localStorage.removeItem(legacyDraftKey);
      } catch (e) { setHasDraft(false); }
    }
    useEffect(() => {
      hasUnsavedRef.current = !!category || !!note.trim();
      try {
        if (category || note.trim()) localStorage.setItem(draftKey, JSON.stringify({ category, note, isViolation }));
      } catch (e) {
      }
    }, [category, note, isViolation]);
    if (!employee) return /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.users, size: 28 }), title: "\u0627\u0644\u0645\u0648\u0638\u0641 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F", body: "" });
    if (!activeCycle) return /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.warn, size: 28 }), title: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062F\u0648\u0631\u0629 \u0646\u0634\u0637\u0629", body: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0636\u0627\u0641\u0629 \u062A\u0642\u064A\u064A\u0645 \u0628\u062F\u0648\u0646 \u062F\u0648\u0631\u0629 \u062A\u0642\u064A\u064A\u0645 \u0646\u0634\u0637\u0629." });
    const negatives = categories.filter((c) => c.type === "negative" && !c.deleted_at && c.active);
    const positives = categories.filter((c) => c.type === "positive" && !c.deleted_at && c.active);
    function noteTemplates() {
      const subject=AI_NOTE_AREAS.find(([value])=>value===aiArea)?.[1]||"الأداء";
      return category.type==="positive" ? [
        `تم رصد أداء إيجابي في ${subject}؛ [وصف الواقعة]. يُقدَّر هذا الالتزام ودوره في تحسين سير العمل.`,
        `أظهر الموظف تميزًا في ${subject}؛ [وصف الواقعة]. نثمن هذا الأداء ونتطلع إلى استمراره.`,
        `سُجلت مساهمة إيجابية تتعلق بـ${subject}؛ [وصف الواقعة]. شكرًا على الاهتمام بجودة العمل.`
      ] : [
        `لوحظت نقطة تحتاج إلى تحسين في ${subject}؛ [وصف الواقعة]. يُرجى معالجة السبب والالتزام بالإجراء المطلوب.`,
        `سُجلت ملاحظة بشأن ${subject}؛ [وصف الواقعة]. نوصي بمراجعة الخطوات المعتمدة لتجنب تكرارها.`,
        `تحتاج الممارسة المتعلقة بـ${subject} إلى متابعة؛ [وصف الواقعة]. يُرجى تصحيحها في العمل القادم.`
      ];
    }
    async function suggestNote() {
      if (!category || aiBusy) return;
      setAiSuggestions(noteTemplates());
      const requestId = ++aiRequestId.current;
      setAiBusy(true);
      setAiError("");
      let timeoutId;
      try {
        // Deliberately send neither employee, category name, nor the typed note.
        const { data, error } = await Promise.race([
          supabase.functions.invoke("elm-cafe-ai-note", { body: { area: aiArea, type: category.type } }),
          new Promise((_,reject)=>{ timeoutId=setTimeout(()=>reject(new Error("انتهت مهلة الانتظار")),6000); })
        ]);
        if (requestId !== aiRequestId.current) return;
        if (error) {
          let message="خدمة الصياغة غير متاحة الآن";
          try { const detail=await error.context?.json(); if(detail?.error) message=detail.error; } catch (_) {}
          throw new Error(message);
        }
        if (!data?.note) throw new Error(data?.error || "لم تصل صياغة مناسبة");
        setAiSuggestions(previous=>[String(data.note), ...previous.filter(item=>item!==String(data.note))].slice(0,4));
      } catch (err) {
        if (requestId === aiRequestId.current) setAiError(`الاقتراح الذكي غير متاح الآن: ${err?.message || "خطأ اتصال"}. الاختيارات الجاهزة ظاهرة ويمكن استخدامها.`);
      } finally {
        clearTimeout(timeoutId);
        if (requestId === aiRequestId.current) setAiBusy(false);
      }
    }
    function selectCategory(next) {
      aiRequestId.current++;
      setAiBusy(false);
      setAiSuggestions([]);
      setAiError("");
      setHasDraft(false);
      setRestored(false);
      try { localStorage.removeItem(legacyDraftKey); } catch (_) {}
      setCategory(next);
    }
    function categoryPressProps(next) {
      return {
        type: "button",
        onPointerDown: () => { categoryPressRef.current = next.id; },
        onTouchStart: () => { categoryPressRef.current = next.id; },
        onClick: (event) => {
          // Ignore clicks retargeted from the employee card during navigation.
          if (event.detail === 0 || categoryPressRef.current === next.id) selectCategory(next);
          categoryPressRef.current = null;
        }
      };
    }
    async function commit() {
      if (savingLock.current || !category) return;
      if (note.includes("[وصف الواقعة]")) {
        setAiError("استبدل [وصف الواقعة] بالتفاصيل الصحيحة قبل الحفظ.");
        return;
      }
      savingLock.current = true;
      setSaving(true);
      const rec = {
        employee_id: employee.id,
        category_id: category.id,
        category_name: category.name,
        type: category.type,
        category_points: category.points,
        note: note.trim(),
        evaluator_id: session.id,
        evaluator_name: session.name,
        cycle_id: activeCycle.id,
        status: "active",
        is_violation: category.type === "negative" ? isViolation : false
      };
      try {
        const saved = await onDone(rec);
        if (saved === true) {
          try { localStorage.removeItem(draftKey); } catch (_) {}
          hasUnsavedRef.current = false;
        }
      } catch (_) { /* The draft remains available for retry. */ }
      finally { setSaving(false); savingLock.current = false; }
    }
    return /* @__PURE__ */ React.createElement("div", { className: "evaluation-screen" }, hasDraft && React.createElement("div", { className:"draft-restore", role:"status" }, "توجد مسودة محفوظة لهذا الموظف. ", React.createElement("button", {type:"button",onClick:restoreDraft}, "استكمال المسودة")), restored && React.createElement("div", { style:s.infoBanner }, "تم استرجاع المسودة."), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-3)", marginBottom: 12 } }, "\u0627\u0644\u0645\u0648\u0638\u0641: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink)" } }, employee.name)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 } }, "\u062A\u0642\u064A\u064A\u0645 \u0633\u0644\u0628\u064A"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 8, marginBottom: 16 } }, negatives.map((c) => /* @__PURE__ */ React.createElement("button", { key: c.id, ...categoryPressProps(c), style: { ...s.catCard, ...(category == null ? void 0 : category.id) === c.id ? s.catCardActiveNeg : {} } }, /* @__PURE__ */ React.createElement("span", null, c.name), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--red)", fontWeight: 700 } }, "-", c.points)))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 } }, "\u062A\u0642\u064A\u064A\u0645 \u0625\u064A\u062C\u0627\u0628\u064A"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 8, marginBottom: 16 } }, positives.map((c) => /* @__PURE__ */ React.createElement("button", { key: c.id, ...categoryPressProps(c), style: { ...s.catCard, ...(category == null ? void 0 : category.id) === c.id ? s.catCardActivePos : {} } }, /* @__PURE__ */ React.createElement("span", null, c.name), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--green)", fontWeight: 700 } }, "+", c.points)))), category && /* @__PURE__ */ React.createElement(Field, { label: category.type === "negative" ? "\u0633\u0628\u0628 \u0627\u0644\u062A\u0642\u064A\u064A\u0645 (\u064A\u064F\u0641\u0636\u0651\u0644 \u062A\u0648\u0636\u064A\u062D\u0647)" : "\u0645\u0644\u0627\u062D\u0638\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }, /* @__PURE__ */ React.createElement("textarea", { style: { ...s.input, minHeight: 90, resize: "vertical" }, value: note, onChange: (e) => setNote(e.target.value), placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0647\u0646\u0627\u2026" })), category && /* @__PURE__ */ React.createElement("div", { style: { ...s.card, maxWidth: "100%", padding: 14, marginBottom: 14, border: "1px solid var(--border)", background: "var(--surface)" } },
      /* @__PURE__ */ React.createElement("strong", { style: { fontSize: 13 } }, "مساعد الصياغة"),
      /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "var(--ink-3)", margin: "6px 0 10px" } }, "اختر موضوعًا عامًا. لن يُرسل اسم الموظف أو ملاحظتك المكتوبة. راجع الاقتراح قبل استخدامه."),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
        /* @__PURE__ */ React.createElement("select", { value: aiArea, onChange: (e) => { aiRequestId.current++; setAiBusy(false); setAiArea(e.target.value); setAiSuggestions([]); setAiError(""); }, "aria-label": "موضوع الصياغة", style: { ...s.input, flex: "1 1 160px", fontSize: 16 } }, AI_NOTE_AREAS.map(([value, label]) => /* @__PURE__ */ React.createElement("option", { key: value, value }, label))),
        /* @__PURE__ */ React.createElement(Btn, { onClick: suggestNote, disabled: aiBusy || saving, style: { minHeight: 44 } }, aiBusy ? "جاري اقتراح الصياغة…" : "اقترح صياغة")),
      aiError && /* @__PURE__ */ React.createElement("p", { role: "status", style: { fontSize: 12, color: "var(--red)", margin: "10px 0 0" } }, aiError),
      aiSuggestions.length>0 && /* @__PURE__ */ React.createElement("div", { className:"ai-options", "aria-label":"اقتراحات الصياغة" },
        aiSuggestions.map((candidate,index)=>React.createElement("button",{key:index,type:"button",className:"ai-option",disabled:saving,onClick:()=>{setNote(candidate);setAiError("");}},candidate)))), category && category.type === "negative" && /* @__PURE__ */ React.createElement("div", { style: { ...s.card, maxWidth: "100%", marginBottom: 16, padding: "6px 16px" } }, /* @__PURE__ */ React.createElement(Switch, { checked: isViolation, onChange: setIsViolation, label: "\u0625\u0634\u0639\u0627\u0631 \u0628\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629", description: "\u064A\u0633\u062A\u0648\u062C\u0628 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0623\u0639\u0644\u0649 (\u0645\u062B\u0644\u064B\u0627: \u062E\u0635\u0645 \u0645\u0646 \u0627\u0644\u0631\u0627\u062A\u0628)" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 6 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", style: { flex: 1 }, disabled: !category || saving, onClick: commit }, saving ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638 \u0627\u0644\u062A\u0642\u064A\u064A\u0645")));
  }
  function HistoryScreen({ employee, evaluations, cycles = [], activeCycle, session, onCancel }) {
    const h = React.createElement;
    const [filter,setFilter] = useState("all");
    const [cycleId,setCycleId] = useState(activeCycle?.id || "all");
    const [cancelTarget,setCancelTarget] = useState(null);
    const [reason,setReason] = useState("");
    const visible = evaluations.filter(e => cycles.some(c => c.id === e.cycle_id));
    const filtered = visible.filter(e => (cycleId === "all" || e.cycle_id === cycleId) && (filter === "all" || (filter === "cancelled" ? e.status === "cancelled" : e.type === filter && e.status === "active"))).slice().sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    const current = visible.filter(e => cycleId === "all" || e.cycle_id === cycleId);
    const active = current.filter(e => e.status === "active");
    const canManage = e => session?.role === "super_admin" || session?.canManageAllEvaluations || e.evaluator_id === session?.id;
    return h("div",{className:"history-screen"},
      h("section",{className:"history-hero"},h("span",{className:"eyebrow"},"سجل التقييمات"),h("h1",null,employee?.name || "الموظف"),h("p",null,"كل تقييم باسم المقيم ووقته، موزع حسب الدورة."),
        h("div",{className:"history-stats"},[["الإجمالي",active.length],["إيجابي",active.filter(e=>e.type==="positive").length],["سلبي",active.filter(e=>e.type==="negative").length],["ملغى",current.filter(e=>e.status==="cancelled").length]].map(([label,value])=>h("div",{key:label},h("strong",null,value),h("small",null,label))))),
      h("label",{className:"history-cycle"},"الدورة",h("select",{value:cycleId,onChange:e=>setCycleId(e.target.value)},h("option",{value:"all"},"كل الدورات"),cycles.map(c=>h("option",{key:c.id,value:c.id},c.name)))),
      h("div",{className:"segmented"},[["all","الكل"],["positive","إيجابي"],["negative","سلبي"],["cancelled","ملغى"]].map(([key,label])=>h("button",{key,type:"button",className:filter===key?"selected":"",onClick:()=>setFilter(key)},label))),
      filtered.length ? h("div",{className:"history-list"},filtered.map(e=>h("article",{key:e.id,className:`history-card ${e.status==="cancelled"?"cancelled":""}`},
        h("div",{className:"history-card-top"},h("span",{className:e.type==="positive"?"history-type positive":"history-type"},e.status==="cancelled"?"ملغى":e.type==="positive"?"إيجابي":"سلبي"),h("strong",null,e.category_name),h("b",null,(e.type==="positive"?"+":"−"),e.category_points)),
        h("div",{className:"history-meta"},h("span",null,cycles.find(c=>c.id===e.cycle_id)?.name || "الدورة"),h("span",null,fmtDateTime(e.created_at))),
        h("div",{className:"history-evaluator"},"سجّله ",e.evaluator_name),
        e.note && h("p",{className:"history-note"},e.note),
        e.status==="cancelled" ? h("small",{className:"history-cancelled"},"ألغاه ",e.edited_by," · ",fmtDateTime(e.edited_at),e.cancel_reason?` · ${e.cancel_reason}`:"") : canManage(e) && h("button",{type:"button",className:"history-cancel",onClick:()=>{setCancelTarget(e);setReason("");}},"إلغاء التقييم")))) : h("div",{className:"dash-empty"},"لا توجد تقييمات بهذه التصفية."),
      cancelTarget && h(Modal,{title:"إلغاء التقييم",onClose:()=>setCancelTarget(null),footer:h(React.Fragment,null,h(Btn,{variant:"danger",onClick:()=>{onCancel(cancelTarget.id,reason);setCancelTarget(null);}},"تأكيد الإلغاء"),h(Btn,{variant:"ghost",onClick:()=>setCancelTarget(null)},"تراجع"))},
        h("p",null,"سيبقى التقييم في السجل كملغى ولن يُحتسب ضمن النقاط."),h(Field,{label:"سبب الإلغاء (اختياري)"},h("input",{style:s.input,value:reason,onChange:e=>setReason(e.target.value)}))));
  }
  function RewardsHub({employees,categories=[],catalog,earnings,redemptions,cycleAwards=[],ready,onOpenEmployee,onSaveReward,onUpdateReward,onRedeem}) {
    const h=React.createElement;
    const [query,setQuery]=useState("");
    const [modal,setModal]=useState(null);
    const [redeemEmployee,setRedeemEmployee]=useState(null);
    const [selectedReward,setSelectedReward]=useState("");
    const [busy,setBusy]=useState(false);
    const [form,setForm]=useState({name:"",description:"",reward_type:"paid_leave",points_cost:"",cash_amount:"",leave_days:"1"});
    const positivePointValues=[...new Set(categories.filter(c=>c.type==="positive"&&Number(c.points)>0).map(c=>Number(c.points)))].sort((a,b)=>a-b);
    const activeRewards=catalog.filter(r=>r.active);
    const balances=employees.map(emp=>{
      const earned=earnings.filter(r=>r.employee_id===emp.id&&r.active).reduce((n,r)=>n+(Number(r.points)||0),0);
      const spent=redemptions.filter(r=>r.employee_id===emp.id).reduce((n,r)=>n+(Number(r.points_spent)||0),0);
      return{emp,earned,spent,balance:Math.max(0,earned-spent),debt:Math.max(0,spent-earned)};
    }).sort((a,b)=>b.balance-a.balance||a.emp.name.localeCompare(b.emp.name,"ar"));
    const visible=balances.filter(r=>`${r.emp.name} ${r.emp.employee_code||""}`.includes(query));
    function openNew(){setForm({name:"",description:"",reward_type:"paid_leave",points_cost:"",cash_amount:"",leave_days:"1"});setModal({editing:null});}
    function openEdit(r){setForm({name:r.name,description:r.description||"",reward_type:r.reward_type,points_cost:String(r.points_cost),cash_amount:String(r.cash_amount||""),leave_days:String(r.leave_days||"")});setModal({editing:r});}
    async function save(){
      const cost=Number(form.points_cost),cash=Number(form.cash_amount||0),days=Number(form.leave_days||0);
      if(!form.name.trim()||!Number.isInteger(cost)||cost<=0||(form.reward_type==="cash"&&cash<=0)||(form.reward_type==="paid_leave"&&days<=0)){return;}
      setBusy(true);try{const payload={name:form.name.trim(),description:form.description.trim(),reward_type:form.reward_type,points_cost:cost,cash_amount:cash,leave_days:days,active:true};const ok=modal.editing?await onUpdateReward(modal.editing.id,payload):await onSaveReward(payload);if(ok)setModal(null);}finally{setBusy(false);}
    }
    async function redeem(){if(!redeemEmployee||!selectedReward||busy)return;setBusy(true);try{const ok=await onRedeem(redeemEmployee.emp.id,selectedReward);if(ok){setRedeemEmployee(null);setSelectedReward("");}}finally{setBusy(false);}}
    return h("div",{className:"rewards-screen"},
      h("header",{className:"rewards-hero"},h("span",{className:"eyebrow"},"ELM CAFE · REWARDS"),h("h1",null,"المكافآت والجوائز"),h("p",null,"كل نقطة هنا من تقييم إيجابي نشط. النقاط السلبية تؤثر على نتيجة الأداء فقط ولا تخصم من رصيد المكافآت."),h("p",{className:"reward-threshold-note"},"تكلفة المكافأة يحددها المدير حسب قيم الفئات الإيجابية",positivePointValues.length?" الحالية (+"+positivePointValues.join("، +")+").":"."," الـ500 نقطة في مكافأة الإجازة مثال مبدئي قابل للتعديل."),h("button",{type:"button",onClick:openNew},"إضافة مكافأة")),
      !ready&&h("div",{className:"rewards-setup"},h("strong",null,"يلزم إعداد سجل المكافآت مرة واحدة"),h("span",null,"شغّل ملف SQL المرفق في Supabase. الصفحة الحالية والبيانات الموجودة ستظل كما هي.")),
      h("div",{className:"rewards-stats"},h("article",null,h("strong",null,employees.length),h("small",null,"موظفًا")),h("article",null,h("strong",null,activeRewards.length),h("small",null,"مكافأة متاحة")),h("article",null,h("strong",null,balances.reduce((n,r)=>n+r.balance,0)),h("small",null,"إجمالي النقاط المتاحة"))),
      h("section",{className:"rewards-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"كتالوج الإدارة"),h("h2",null,"خيارات الاستبدال"))),
        catalog.length?h("div",{className:"reward-catalog-grid"},catalog.map(r=>h("article",{key:r.id,className:"reward-option "+(!r.active?"inactive":"")},h("div",{className:"reward-option-top"},h("strong",null,r.name),h("div",{className:"reward-option-controls"},h("button",{type:"button",onClick:()=>openEdit(r)},"تعديل"),h("button",{type:"button",onClick:()=>onUpdateReward(r.id,{active:!r.active})},r.active?"إيقاف":"تفعيل"))),h("span",{className:"reward-cost"},r.points_cost," نقطة"),h("small",null,r.reward_type==="cash"?`مبلغ ${Number(r.cash_amount).toFixed(2)}`:r.reward_type==="paid_leave"?`${r.leave_days} يوم إجازة مدفوع`:r.reward_type==="shift_choice"?"أولوية اختيار الشيفت":r.reward_type==="voucher"?"قسيمة شراء / وجبة":"مكافأة إدارية"),r.description&&h("p",null,r.description)))):h("div",{className:"dash-empty"},"أضف المكافآت وقيمة النقاط من إعدادات الإدارة.")),
      h("section",{className:"rewards-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"الرصيد التراكمي"),h("h2",null,"أرصدة الموظفين"))),h("input",{className:"modern-search",value:query,onChange:e=>setQuery(e.target.value),placeholder:"ابحث عن موظف أو رقمه"}),visible.length?h("div",{className:"reward-employees"},visible.map(r=>h("article",{key:r.emp.id,className:"reward-employee"},h("button",{type:"button",className:"reward-employee-main",onClick:()=>onOpenEmployee(r.emp.id)},h("span",{className:"person-avatar",style:{background:avatarColor(r.emp.name).bg,color:avatarColor(r.emp.name).fg}},r.emp.name.slice(0,1)),h("span",null,h("strong",null,r.emp.name),h("small",null,r.emp.profession||"موظف"," · ",r.emp.employee_code||"—"))),h("div",{className:"reward-balance"},h("strong",null,r.balance),h("small",null,"متاح للاستبدال"),h("span",null,r.debt?"مطلوب "+r.debt+" نقطة لاستعادة الرصيد":r.earned+" مكتسب − "+r.spent+" مصروف")),h("button",{type:"button",className:"reward-redeem",disabled:!ready||!activeRewards.some(x=>r.balance>=x.points_cost),onClick:()=>{setRedeemEmployee(r);setSelectedReward(activeRewards.find(x=>r.balance>=x.points_cost)?.id||"");}},"تسجيل صرف")))):h("div",{className:"dash-empty"},"لا توجد نتائج مطابقة.")),
      h("section",{className:"rewards-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"سجل الصرف"),h("h2",null,"آخر المكافآت المسجلة"))),redemptions.length?h("div",{className:"reward-redemption-list"},redemptions.slice(0,30).map(x=>h("article",{key:x.id},h("span",null,h("strong",null,x.employee_name),h("small",null,x.reward_name," · ",fmtDateTime(x.redeemed_at))),h("b",null,"−",x.points_spent," نقطة"),h("small",null,"سجّلتها ",x.redeemed_by_name)))):h("div",{className:"dash-empty"},"لا يوجد صرف مسجل.")),
      h("section",{className:"rewards-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"نتائج الدورات المغلقة"),h("h2",null,"الفائزون المعتمدون"))),cycleAwards.length?h("div",{className:"reward-redemption-list"},cycleAwards.slice(0,30).map(x=>h("article",{key:x.cycle_id},h("span",null,h("strong",null,x.employee_name),h("small",null,x.cycle_name," · ",fmtDateTime(x.created_at))),h("b",null,Math.round(x.score)," / 100"),h("small",null,"اعتمدها ",x.chosen_by_name)))):h("div",{className:"dash-empty"},"لم يُعتمد فائز لدورة حتى الآن.")),
      modal&&h(Modal,{title:modal.editing?"تعديل مكافأة":"إضافة مكافأة",onClose:()=>!busy&&setModal(null),footer:h(React.Fragment,null,h(Btn,{variant:"primary",disabled:busy||!form.name.trim()||!(Number(form.points_cost)>0)||(form.reward_type==="cash"&&Number(form.cash_amount)<=0)||(form.reward_type==="paid_leave"&&Number(form.leave_days)<=0),onClick:save},busy?"جارِ الحفظ…":modal.editing?"حفظ التعديل":"حفظ المكافأة"),h(Btn,{variant:"ghost",onClick:()=>setModal(null)},"إلغاء"))},h(Field,{label:"اسم المكافأة"},h("input",{style:s.input,value:form.name,onChange:e=>setForm({...form,name:e.target.value}),placeholder:"مثال: قسيمة وجبة"})),h(Field,{label:"نوع المكافأة"},h("select",{style:s.input,value:form.reward_type,onChange:e=>setForm({...form,reward_type:e.target.value})},[["cash","مكافأة مالية"],["paid_leave","إجازة مدفوعة"],["shift_choice","أولوية اختيار الشيفت"],["voucher","قسيمة شراء أو وجبة"],["other","أخرى"]].map(([v,l])=>h("option",{key:v,value:v},l)))),h(Field,{label:"النقاط المطلوبة"},h("input",{type:"number",min:"1",step:"1",style:s.input,value:form.points_cost,onChange:e=>setForm({...form,points_cost:e.target.value})})),h("small",{className:"reward-threshold-note"},"500 نقطة ليست جزءًا من درجة الـ100؛ غيّر تكلفة المكافأة حسب عدد التقييمات الإيجابية الذي تراه مناسبًا."),form.reward_type==="cash"&&h(Field,{label:"المبلغ المالي"},h("input",{type:"number",min:"0.01",step:"0.01",style:s.input,value:form.cash_amount,onChange:e=>setForm({...form,cash_amount:e.target.value})})),form.reward_type==="paid_leave"&&h(Field,{label:"عدد أيام الإجازة"},h("input",{type:"number",min:"0.5",step:"0.5",style:s.input,value:form.leave_days,onChange:e=>setForm({...form,leave_days:e.target.value})})),h(Field,{label:"تفاصيل أو شروط المكافأة"},h("input",{style:s.input,value:form.description,onChange:e=>setForm({...form,description:e.target.value})}))),
      redeemEmployee&&h(Modal,{title:"تأكيد صرف المكافأة",onClose:()=>!busy&&setRedeemEmployee(null),footer:h(React.Fragment,null,h(Btn,{variant:"danger",disabled:busy||!selectedReward,onClick:redeem},busy?"جارِ التسجيل…":"تأكيد تسجيل الصرف"),h(Btn,{variant:"ghost",onClick:()=>setRedeemEmployee(null)},"رجوع"))},h("p",null,"الموظف: ",h("strong",null,redeemEmployee.emp.name)," · رصيده المتاح ",redeemEmployee.balance," نقطة."),h(Field,{label:"اختر المكافأة"},h("select",{style:s.input,value:selectedReward,onChange:e=>setSelectedReward(e.target.value)},h("option",{value:""},"اختر مكافأة"),activeRewards.map(r=>h("option",{key:r.id,value:r.id,disabled:redeemEmployee.balance<r.points_cost},r.name," — ",r.points_cost," نقطة")))),h("small",{className:"reward-confirm-note"},"سجّل الصرف بعد اعتماد وتسليم المكافأة فعليًا. سيُخصم الرصيد مرة واحدة ولا يمكن حذف سجل الصرف.")));
  }

  function AdminDashboard({ employees, evaluations, notifications, notificationsReady, activeCycle, computeScore, audit, displayTarget, onGo, onOpenEmployee, onNewEval, onOpenNotifications }) {
    const h = React.createElement;
    const [selectedRecentId,setSelectedRecentId]=useState(null);
    const selectedRecent=evaluations.find(e=>e.id===selectedRecentId&&e.status==="active")||null;
    const activeEmployees = employees.filter(e => !e.archived && !e.deleted_at);
    const cycleEvals = activeCycle ? evaluations.filter(e => e.cycle_id === activeCycle.id && e.status === "active") : [];
    const evaluated = new Set(cycleEvals.map(e=>e.employee_id));
    const coverage = activeEmployees.length ? Math.round(evaluated.size / activeEmployees.length * 100) : 0;
    const rated = activeEmployees.filter(e=>evaluated.has(e.id)).map(e=>({emp:e,score:computeScore(e.id,activeCycle.id)})).sort((a,b)=>b.score-a.score);
    const best = rated[0];
    const liveLeaders = best ? rated.filter(row=>row.score===best.score) : [];
    // Show the live leader after a meaningful sample; scoring itself remains unchanged.
    const evaluationDays = new Set(cycleEvals.map(e=>new Date(e.created_at).toLocaleDateString("en-CA",{timeZone:"Asia/Riyadh"})));
    const showLiveLeader = evaluated.size >= Math.min(activeEmployees.length,3) && evaluationDays.size >= 2;
    const pending = notifications.filter(e=>!e.violation_reviewed).length;
    const recentEvaluations = cycleEvals.slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,3);
    const notRated = activeEmployees.filter(e=>!evaluated.has(e.id));
    return h("div",{className:"executive-dashboard"},
      h("section",{className:"executive-hero"},h("span",{className:"eyebrow"},"ELM CAFE · أداء الدورة"),h("h1",null,"لوحة التحكم"),h("p",null,activeCycle?activeCycle.name:"لا توجد دورة تقييم نشطة"),
        h("div",{className:"hero-progress-label"},h("span",null,"موظفون لديهم تقييم في الدورة"),h("strong",null,evaluated.size," / ",activeEmployees.length)),h("div",{className:"hero-progress",role:"progressbar","aria-valuenow":coverage,"aria-valuemin":0,"aria-valuemax":100,"aria-label":"نسبة الموظفين الذين لديهم تقييم"},h("span",{style:{width:`${coverage}%`}})),
        h("div",{className:"hero-actions"},activeCycle&&notRated.length?h("button",{type:"button",onClick:()=>onNewEval(notRated[0].id)},"قيّم ",notRated[0].name,h(Icon,{svg:ICONS.back,size:16})):h("button",{type:"button",onClick:()=>onGo(activeCycle?"reportsOverall":"adminCycles")},activeCycle?"افتح تقرير الدورة":"افتح دورة تقييم"),h("button",{type:"button",onClick:()=>onGo("reportsOverall")},"نتائج الفريق"))),
      h("div",{className:"executive-stats"},[
        ["الفريق",activeEmployees.length,"home",ICONS.users],
        ["تم تقييمهم",evaluated.size,"reportsOverall",ICONS.check],
        ["بلا تقييم",notRated.length,"home",ICONS.clock],
        [notificationsReady?"مخالفات للمراجعة":"الإشعارات غير مفعلة",notificationsReady?pending:"—","notifications",ICONS.bell]
      ].map(([label,value,dest,icon])=>h("button",{key:label,type:"button",disabled:dest==="notifications"&&!notificationsReady,onClick:dest==="notifications"?onOpenNotifications:()=>onGo(dest),className:"executive-stat"},h(Icon,{svg:icon,size:19}),h("strong",null,value),h("small",null,label)))),
      h("section",{className:"dashboard-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"أعلى أداء"),h("h2",null,"MVP الدورة")),h("button",{className:"text-action",onClick:()=>onGo("reportsOverall")},"التقرير")),
        best&&showLiveLeader?h("button",{type:"button",className:"mvp-card",onClick:()=>liveLeaders.length===1?onOpenEmployee(best.emp.id):onGo("reportsOverall")},h("span",{className:"mvp-medal"},"★"),h("span",{className:"mvp-copy"},h("small",null,"أفضل نتيجة حتى الآن · تتغير مع التقييمات"),h("strong",null,liveLeaders.length===1?best.emp.name:`${liveLeaders.length} موظفين متعادلون`),h("small",null,liveLeaders.length===1?(best.emp.profession||"موظف"):"افتح التقرير لعرضهم")),h("span",{className:"mvp-score"},Math.round(best.score),h("small",null,"من 100"))):h("div",{className:"dash-empty"},"سيظهر المتصدر بعد تقييم ثلاثة موظفين على الأقل خلال يومين مختلفين. يمكن متابعة النتائج الحالية من التقرير.")),
      notRated.length>0 && activeCycle && h("section",{className:"dashboard-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"الخطوة التالية"),h("h2",null,"لم يُقيّموا بعد")),h("button",{className:"text-action",onClick:()=>onGo("home")},"عرض الجميع")),
        h("div",{className:"pending-list"},notRated.slice(0,3).map(e=>h("button",{key:e.id,type:"button",onClick:()=>onNewEval(e.id)},h("span",{className:"person-avatar",style:{background:avatarColor(e.name).bg,color:avatarColor(e.name).fg}},e.name.trim().slice(0,1)),h("span",null,h("strong",null,e.name),h("small",null,e.profession||"موظف")),h(Icon,{svg:ICONS.back,size:16}))))),
      h("section",{className:"dashboard-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"المتابعة"),h("h2",null,"آخر التقييمات")),h("button",{className:"text-action",onClick:()=>onGo("evaluationsLog")},"عرض الكل")),
        recentEvaluations.length?h("div",{className:"activity-feed"},recentEvaluations.map(e=>h("button",{key:e.id,type:"button",className:"evaluation-activity-item",onClick:()=>setSelectedRecentId(e.id)},h("span",{className:e.type==="positive"?"evaluation-sign positive":"evaluation-sign negative"},e.type==="positive"?`+${e.category_points}`:`−${e.category_points}`),h("span",{className:"evaluation-activity-main"},h("strong",null,e.category_name),h("small",null,employees.find(emp=>emp.id===e.employee_id)?.name||"موظف"," · ",relTime(e.created_at)))))):h("div",{className:"dash-empty"},"لا توجد تقييمات بعد.")),
      selectedRecent&&h(EvaluationDetailModal,{evaluation:selectedRecent,employees,onClose:()=>setSelectedRecentId(null)}));
  }
  function MoreMenuScreen({ onGo, isOwner }) {
    return /* @__PURE__ */ React.createElement("div", { className: "more-screen" }, React.createElement("div",{className:"more-screen-grid",style:{display:"grid",gap:9}}, isOwner && /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.shield, label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", onClick: () => onGo("adminUsers") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.settings, label: "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0648\u0646\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", onClick: () => onGo("adminCategories") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.clock, label: "\u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", onClick: () => onGo("adminCycles") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.grid, label: "المكافآت والجوائز", onClick: () => onGo("rewardsHub") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.chart, label: "\u0646\u0634\u0627\u0637 \u0627\u0644\u0645\u0642\u064A\u0651\u0645\u064A\u0646", onClick: () => onGo("evaluatorActivity") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.clipboard, label: "\u0633\u062C\u0644 \u0627\u0644\u062A\u062F\u0642\u064A\u0642", onClick: () => onGo("auditLog") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.trash, label: "\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A", onClick: () => onGo("trash") })));
  }
  function NavRow({ icon, label, onClick }) {
    return /* @__PURE__ */ React.createElement("button", { onClick, className:"more-row" + (label === "سلة المهملات" ? " more-row-danger" : ""), style: { ...s.rowCard, color:"var(--ink)", font:"inherit" } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--forest)" } }, /* @__PURE__ */ React.createElement(Icon, { svg: icon, size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "right", fontWeight: 600, fontSize: 14 } }, label), /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.back, size: 18, color: "var(--ink-3)" }));
  }
  function AdminEmployees({ employees, onAdd, onArchive, onDelete }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [empId, setEmpId] = useState("");
    const [profession, setProfession] = useState("");
    const [err, setErr] = useState("");
    const [archiveTarget, setArchiveTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [confirmText, setConfirmText] = useState("");
    const [saving, setSaving] = useState(false);
    async function submit(e) {
      e.preventDefault();
      if (saving) return;
      if (!name.trim() || !empId.trim() || !profession.trim()) {
        setErr("\u0627\u0645\u0644\u0623 \u0643\u0644 \u0627\u0644\u062D\u0642\u0648\u0644");
        return;
      }
      setSaving(true);
      const ok = await onAdd({ employee_code: empId.trim(), name: name.trim(), profession: profession.trim(), archived: false });
      setSaving(false);
      if (ok !== false) {
        setOpen(false);
        setName("");
        setEmpId("");
        setProfession("");
        setErr("");
      }
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", style: { width: "100%", marginBottom: 14 }, onClick: () => setOpen(true) }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.plus, size: 16 }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0638\u0641"), !employees.length ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.users, size: 28 }), title: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0638\u0641\u0648\u0646", body: "\u0627\u0628\u062F\u0623 \u0628\u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0644 \u0645\u0648\u0638\u0641." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, employees.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.id, style: { ...s.rowCard, cursor: "default" } }, /* @__PURE__ */ React.createElement("div", { style: { ...s.avatarCircle, background: avatarColor(e.name).bg, color: avatarColor(e.name).fg } }, e.name.slice(0, 1)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, e.name, " ", e.archived && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-3)", fontWeight: 400, fontSize: 12 } }, "(\u0645\u0624\u0631\u0634\u0641)")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)" } }, e.profession, " \xB7 \u0631\u0642\u0645 ", e.employee_code)), /* @__PURE__ */ React.createElement("button", { onClick: () => setArchiveTarget(e), style: s.iconBtn, "aria-label": "\u0623\u0631\u0634\u0641\u0629" }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.archive, size: 16, color: e.archived ? "var(--forest)" : "var(--ink-3)" })), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setDeleteTarget(e);
      setConfirmText("");
    }, style: s.iconBtn, "aria-label": "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A" }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.trash, size: 16, color: "var(--red)" }))))), open && /* @__PURE__ */ React.createElement(Modal, { title: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0638\u0641", onClose: () => setOpen(false), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: submit, disabled: saving }, saving ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setOpen(false) }, "\u0625\u0644\u063A\u0627\u0621")) }, /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0638\u0641" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0648\u0638\u064A\u0641\u064A" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: empId, onChange: (e) => setEmpId(e.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u0648\u0638\u064A\u0641\u064A" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: profession, onChange: (e) => setProfession(e.target.value) })), err && /* @__PURE__ */ React.createElement("div", { style: s.errText }, err)), archiveTarget && /* @__PURE__ */ React.createElement(Modal, { title: archiveTarget.archived ? "\u0625\u0639\u0627\u062F\u0629 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u0648\u0638\u0641" : "\u0623\u0631\u0634\u0641\u0629 \u0627\u0644\u0645\u0648\u0638\u0641", onClose: () => setArchiveTarget(null), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: archiveTarget.archived ? "primary" : "danger", onClick: () => {
      onArchive(archiveTarget.id, !archiveTarget.archived);
      setArchiveTarget(null);
    } }, archiveTarget.archived ? "\u062A\u0623\u0643\u064A\u062F \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0639\u064A\u0644" : "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0623\u0631\u0634\u0641\u0629"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setArchiveTarget(null) }, "\u062A\u0631\u0627\u062C\u0639")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)" } }, archiveTarget.archived ? `\u0633\u064A\u0638\u0647\u0631 "${archiveTarget.name}" \u0645\u0631\u0629 \u0623\u062E\u0631\u0649 \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646 \u0627\u0644\u0646\u0634\u0637\u064A\u0646.` : `\u0644\u0646 \u064A\u0638\u0647\u0631 "${archiveTarget.name}" \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646\u060C \u0644\u0643\u0646 \u0633\u062C\u0644 \u062A\u0642\u064A\u064A\u0645\u0627\u062A\u0647 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u064A\u0628\u0642\u0649 \u0645\u062D\u0641\u0648\u0638\u064B\u0627 \u0628\u0627\u0644\u0643\u0627\u0645\u0644.`)), deleteTarget && /* @__PURE__ */ React.createElement(Modal, { title: "\u062D\u0630\u0641 \u0627\u0644\u0645\u0648\u0638\u0641 \u0646\u0647\u0627\u0626\u064A\u064B\u0627", onClose: () => setDeleteTarget(null), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", disabled: confirmText.trim() !== deleteTarget.name.trim(), onClick: () => {
      onDelete(deleteTarget.id, deleteTarget.name);
      setDeleteTarget(null);
    } }, "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A \u2014 \u0644\u0627 \u0631\u062C\u0648\u0639"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setDeleteTarget(null) }, "\u062A\u0631\u0627\u062C\u0639")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--red)", marginBottom: 12, fontWeight: 600 } }, '\u0647\u0630\u0627 \u0633\u064A\u062D\u0630\u0641 "', deleteTarget.name, '" \u0648\u0643\u0644 \u062A\u0642\u064A\u064A\u0645\u0627\u062A\u0647 \u0644\u0644\u0623\u0628\u062F. \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621. \u0644\u0648 \u062A\u0642\u0635\u062F \u0625\u0628\u0639\u0627\u062F\u0647 \u0641\u0642\u0637\u060C \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0623\u0631\u0634\u0641\u0629 \u0628\u062F\u0644\u064B\u0627 \u0645\u0646 \u0630\u0644\u0643.'), /* @__PURE__ */ React.createElement(Field, { label: `\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0638\u0641 "${deleteTarget.name}" \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0644\u0644\u062A\u0623\u0643\u064A\u062F` }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: confirmText, onChange: (e) => setConfirmText(e.target.value) }))));
  }
  const PERMISSION_DEFS = [
    { key: "canManageEmployees", label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646", description: "\u0625\u0636\u0627\u0641\u0629\u060C \u0623\u0631\u0634\u0641\u0629\u060C \u0648\u062D\u0630\u0641 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646" },
    { key: "canCreateCycle", label: "\u0625\u062F\u0627\u0631\u0629 \u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", description: "\u0625\u0646\u0634\u0627\u0621 \u0648\u0625\u063A\u0644\u0627\u0642 \u0648\u0625\u0639\u0627\u062F\u0629 \u0641\u062A\u062D \u0627\u0644\u062F\u0648\u0631\u0627\u062A" },
    { key: "canEditCategories", label: "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0648\u0646\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", description: "\u062A\u0639\u062F\u064A\u0644 \u0646\u0642\u0627\u0637 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0648\u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641\u0627\u062A \u062C\u062F\u064A\u062F\u0629" },
    { key: "canManageAllEvaluations", label: "\u0625\u062F\u0627\u0631\u0629 \u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u062C\u0645\u064A\u0639", description: "\u0625\u0644\u063A\u0627\u0621 \u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0633\u062C\u0651\u0644\u0647\u0627 \u0645\u0642\u064A\u0651\u0645\u0648\u0646 \u0622\u062E\u0631\u0648\u0646" }
  ];
  function emptyPerms() {
    return { canManageEmployees: false, canCreateCycle: false, canEditCategories: false, canManageAllEvaluations: false };
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
        h("button",{type:"button",onClick:()=>setInfoId(u.id),style:{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,background:"none",border:0,padding:0,cursor:"pointer",textAlign:"right",color:"var(--ink)"}},h("div",{style:{...s.avatarCircle,background:avatarColor(u.name).bg,color:avatarColor(u.name).fg,flex:"none"}},u.name.slice(0,1)),h("span",{style:{display:"grid",gap:3,minWidth:0}},h("strong",{style:{fontSize:14}},u.name),h("small",{style:{fontSize:11,color:"var(--ink-3)"}},u.role==="super_admin"?"مدير أعلى":"مقيّم",u.active?" · نشط":" · معطّل"))),
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
      deleteTarget&&h(Modal,{title:"حذف وصول المستخدم للتطبيق",account:true,onClose:()=>setDeleteTarget(null),footer:h(React.Fragment,null,h(Btn,{variant:"danger",disabled:confirmText.trim()!==deleteTarget.name.trim()||!!busyId,onClick:async()=>{if(busyId)return;setBusyId(deleteTarget.id);try{const ok=await onDelete(deleteTarget.id,deleteTarget.name);if(ok!==false)setDeleteTarget(null);}finally{setBusyId(null);}}},busyId===deleteTarget.id?"جارِ الحذف…":"تأكيد حذف الوصول"),h(Btn,{variant:"ghost",onClick:()=>setDeleteTarget(null)},"تراجع"))},h("p",{style:{fontSize:13,lineHeight:1.7,color:"var(--red)"}},"الحذف يمنع الوصول للتطبيق. لو لدى المستخدم تقييمات سابقة، استخدم إيقاف الحساب للحفاظ على السجل. حساب Supabase Auth منفصل."),h(Field,{label:`اكتب اسم "${deleteTarget.name}" كاملًا للتأكيد`},h("input",{style:s.input,value:confirmText,onChange:e=>setConfirmText(e.target.value)}))));
  }
  function AdminCategories({ categories, ratingBands, onAddCategory, onUpdateCategory, onUpdateBands, onArchiveCategory, onArchiveBand }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
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
      try { ok = await onAddCategory({ name: name.trim(), type, points: Number(points), active: true }); }
      finally { setSaving(false); }
      if (ok === false) return;
      setOpen(false);
      setName("");
      setType("negative");
      setPoints(2);
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 } }, "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)", marginBottom: 10 } }, "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0646\u0642\u0627\u0637 \u064A\u0624\u062B\u0631 \u0639\u0644\u0649 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0641\u0642\u0637."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 } }, categories.map((c) => {
      var _a;
      return /* @__PURE__ */ React.createElement("div", { key: c.id, style: s.card }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, c.name, " ", !c.active && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-3)", fontWeight: 400, fontSize: 12 } }, "(\u0645\u0639\u0637\u0651\u0644)")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: c.type === "positive" ? "var(--green)" : "var(--red)" } }, c.type === "positive" ? "\u0625\u064A\u062C\u0627\u0628\u064A" : "\u0633\u0644\u0628\u064A")), /* @__PURE__ */ React.createElement("button", { onClick: () => onUpdateCategory(c.id, { active: !c.active }), style: s.iconBtn }, /* @__PURE__ */ React.createElement(Icon, { svg: c.active ? ICONS.lock : ICONS.unlock, size: 15, color: c.active ? "var(--ink-3)" : "var(--forest)" })), /* @__PURE__ */ React.createElement("button", {onClick:()=>setPendingArchive({type:"category",id:c.id,label:c.name}),style:s.iconBtn,"aria-label":"نقل التصنيف للسلة"}, /* @__PURE__ */ React.createElement(Icon,{svg:ICONS.trash,size:15,color:"var(--red)"}))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10, alignItems: "center" } }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", style: { ...s.input, width: 80 }, value: (_a = editPoints[c.id]) != null ? _a : c.points, onChange: (e) => setEditPoints({ ...editPoints, [c.id]: e.target.value }) }), /* @__PURE__ */ React.createElement(Btn, { onClick: () => {
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
    } }), /* @__PURE__ */ React.createElement("button", {onClick:()=>{const midpoint=Math.floor((b.min+b.max)/2);if(midpoint>=b.max)return;const next=[...bands];next.splice(i,1,{...b,max:midpoint},{id:null,min:midpoint+1,max:b.max,label:"نطاق جديد"});setBands(next);},disabled:b.max-b.min<1,style:s.iconBtn,"aria-label":"تقسيم النطاق وإضافة نطاق جديد"}, /* @__PURE__ */ React.createElement(Icon,{svg:ICONS.plus,size:15,color:"var(--forest)"})), /* @__PURE__ */ React.createElement("button", {onClick:()=>setPendingArchive({type:"band",id:b.id,label:b.label}),disabled:bands.length<2 || !b.id,style:s.iconBtn,"aria-label":"نقل النطاق للسلة"}, /* @__PURE__ */ React.createElement(Icon,{svg:ICONS.trash,size:15,color:"var(--red)"}))))), /* @__PURE__ */ React.createElement(Btn, { onClick: async () => { if(saving)return;setSaving(true);try{await onUpdateBands(bands);}finally{setSaving(false);} }, disabled:saving, style: { width: "100%" } }, saving ? "جارِ الحفظ…" : "\u062D\u0641\u0638 \u0627\u0644\u0646\u0637\u0627\u0642\u0627\u062A"), open && /* @__PURE__ */ React.createElement(Modal, { title: "\u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641", onClose: () => setOpen(false), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", onClick: submit, disabled: saving }, saving ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setOpen(false) }, "\u0625\u0644\u063A\u0627\u0621")) }, /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0627\u0633\u0645" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: name, onChange: (e) => setName(e.target.value) })), /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0644\u0646\u0648\u0639" }, /* @__PURE__ */ React.createElement("select", { style: s.input, value: type, onChange: (e) => setType(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "negative" }, "\u0633\u0644\u0628\u064A"), /* @__PURE__ */ React.createElement("option", { value: "positive" }, "\u0625\u064A\u062C\u0627\u0628\u064A"))), /* @__PURE__ */ React.createElement(Field, { label: "\u0639\u062F\u062F \u0627\u0644\u0646\u0642\u0627\u0637" }, /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", style: s.input, value: points, onChange: (e) => setPoints(e.target.value) }))), pendingArchive && /* @__PURE__ */ React.createElement(Modal,{title:"نقل إلى سلة المهملات",onClose:()=>setPendingArchive(null),footer: /* @__PURE__ */ React.createElement(React.Fragment,null, /* @__PURE__ */ React.createElement(Btn,{variant:"danger",disabled:saving,onClick:async()=>{if(saving)return;setSaving(true);const ok=await(pendingArchive.type==="band"?onArchiveBand:onArchiveCategory)(pendingArchive.id);setSaving(false);if(ok)setPendingArchive(null);}},saving?"جارِ النقل…":"نقل للسلة"), /* @__PURE__ */ React.createElement(Btn,{variant:"ghost",onClick:()=>setPendingArchive(null)},"تراجع"))},"سيختفي «",pendingArchive.label,"» من خيارات التقييم الجديدة. التقييمات السابقة محفوظة. حذف النطاق يضم درجاته للنطاق المجاور حتى لا تترك فجوة."));
  }
  function addOneMonth(dateStr) {
    const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
    const day = d.getDate();
    d.setMonth(d.getMonth() + 1);
    if (d.getDate() !== day) d.setDate(0);
    return d.toISOString().slice(0, 10);
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
    const filtered=rows.filter(r=>(filter==="all"||(filter==="rated"?r.total>0:r.total===0))&&(r.emp.name.includes(query)||String(r.emp.employee_code||"").includes(query)));
    function exportCsv(){
      if(!cycle)return;
      const quote=value=>'"'+String(value??"").replace(/"/g,'""')+'"';
      const headers=["الترتيب","اسم الموظف","المسمى الوظيفي","الرقم الوظيفي","النتيجة من 100","عدد التقييمات","إيجابي","سلبي","التقدير"];
      const data=rows.map((r,i)=>{const evs=evaluations.filter(e=>e.employee_id===r.emp.id&&e.cycle_id===cycle.id&&e.status==="active");return[i+1,r.emp.name,r.emp.profession||"",r.emp.employee_code||"",r.score===null?"":Math.round(r.score),r.total,evs.filter(e=>e.type==="positive").length,evs.filter(e=>e.type==="negative").length,r.rating];});
      const delim=";";
      const csvRow=row=>row.map(value=>quote(value).replace(/^"([=+@-])/,'"\t$1')).join(delim);
      const summary=["تقرير نتائج الموظفين - ELM CAFE"];
      const reportRows=[summary,["الدورة",cycle.name],["من",fmtDate(cycle.start_date),"إلى",fmtDate(cycle.end_date)],["تاريخ التصدير",new Date().toLocaleDateString("ar-EG")],["عدد الموظفين",rows.length,"تم تقييمهم",rated.length,"متوسط النقاط",average??"—"],[],headers,...data];
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
          h("header",{className:"print-report-head"},h("div",null,h("small",null,"ELM CAFE · تقرير تقييم الموظفين"),h("h1",null,cycle.name),h("p",null,"الفترة: ",fmtDate(cycle.start_date)," — ",fmtDate(cycle.end_date))),h("div",{className:"print-report-stamp"},"تاريخ الطباعة",h("strong",null,new Date().toLocaleDateString("ar-SA")))),
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
  function QuickEmployeeSearch({ employees, onClose, onOpen }) {
    const h=React.createElement;
    const [query,setQuery]=useState("");
    const results=employees.filter(e=>`${e.name} ${e.employee_code||""} ${e.profession||""}`.toLocaleLowerCase("ar").includes(query.trim().toLocaleLowerCase("ar"))).slice(0,30);
    return h("div",{className:"quick-search-scrim",onClick:onClose},h("section",{className:"quick-search-panel",role:"dialog","aria-label":"البحث عن موظف",onClick:e=>e.stopPropagation()},
      h("div",{className:"quick-search-head"},h("strong",null,"بحث عن موظف"),h("button",{type:"button",onClick:onClose,"aria-label":"إغلاق"},"×")),
      h("input",{className:"modern-search",autoFocus:true,value:query,onChange:e=>setQuery(e.target.value),placeholder:"الاسم أو الرقم الوظيفي", "aria-label":"ابحث عن موظف"}),
      h("div",{className:"quick-search-results"},results.length?results.map(e=>h("button",{key:e.id,type:"button",onClick:()=>onOpen(e.id)},h("span",{className:"person-avatar",style:{background:avatarColor(e.name).bg,color:avatarColor(e.name).fg}},e.name.slice(0,1)),h("span",null,h("strong",null,e.name),h("small",null,e.profession||"موظف"," · ",e.employee_code)),h(Icon,{svg:ICONS.back,size:15}))):h("div",{className:"dash-empty"},query?"لا توجد نتائج مطابقة.":"اكتب اسم الموظف أو رقمه."))));
  }
  function NotificationsModal({ evaluations, employees, onClose, onReview, onEnablePush, onDisablePush }) {
    const h=React.createElement;
    const items=evaluations.filter(e=>e.is_violation&&e.status==="active")
      .slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    const unread=items.filter(e=>!e.violation_reviewed).length;
    const [expandedId,setExpandedId]=useState(()=>items.find(e=>!e.violation_reviewed)?.id||items[0]?.id||null);
    const [reviewingId,setReviewingId]=useState(null);
    const [pushState,setPushState]=useState('checking');
    const [pushBusy,setPushBusy]=useState(false);
    const [showPushSettings,setShowPushSettings]=useState(false);
    useEffect(()=>{
      let mounted=true;
      if(!pushSupported()){setPushState('unavailable');return;}
      Promise.all([
        navigator.serviceWorker.getRegistration('./').then(reg=>reg?.pushManager?.getSubscription()),
        supabase.from('push_runtime_status').select('vapid_public_key,last_run_at').eq('singleton',true).maybeSingle()
      ]).then(([sub,runtime])=>{
        if(!mounted)return;
        const lastRun=Date.parse(runtime.data?.last_run_at||'');
        const ready=!runtime.error && runtime.data?.vapid_public_key===VAPID_PUBLIC_KEY &&
          Number.isFinite(lastRun) && Date.now()-lastRun<180000;
        setPushState(ready?(sub?'enabled':'disabled'):'server-offline');
      })
        .catch(()=>{if(mounted)setPushState('unavailable');});
      return()=>{mounted=false;};
    },[]);
    async function toggleDevicePush(){
      if(pushBusy)return;
      setPushBusy(true);
      try{
        const active=pushState==='enabled';
        const ok=await (active?onDisablePush():onEnablePush());
        if(ok){setPushState(active?'disabled':'enabled');setShowPushSettings(false);}
      }finally{setPushBusy(false);}
    }
    async function review(id){
      if(reviewingId)return;
      setReviewingId(id);
      try{await onReview(id);}finally{setReviewingId(null);}
    }
    return h(React.Fragment,null,
      h("div",{className:"notification-dismiss",onClick:onClose,"aria-hidden":"true"}),
      h("aside",{className:"notification-popover",role:"dialog","aria-label":"إشعارات المخالفات"},
        h("div",{className:"notification-heading"},
          h("div",null,h("strong",null,"إشعارات المخالفات"),h("small",null,unread?`${unread} بحاجة للمراجعة`:"كل الإشعارات تمت مراجعتها")),
          h("div",{className:"notification-heading-actions"},
            pushState==='enabled'&&h("button",{type:"button",onClick:()=>setShowPushSettings(value=>!value),"aria-label":"إعدادات إشعارات الجهاز","aria-expanded":showPushSettings},h(Icon,{svg:ICONS.settings,size:18})),
            h("button",{type:"button",onClick:onClose,"aria-label":"إغلاق الإشعارات"},h(Icon,{svg:ICONS.x,size:18})))),
        (pushState==='disabled'||pushState==='server-offline'||pushState==='unavailable'||showPushSettings)&&h("div",{className:"notification-device-push"},
          h("span",null,pushState==='enabled'?'إشعارات الجهاز مفعلة':pushState==='server-offline'?'خادم إشعارات الجهاز لم يجهز بعد':pushState==='unavailable'?'إشعارات الجهاز غير متاحة هنا':'إشعارات الجهاز خارج التطبيق'),
          ['enabled','disabled'].includes(pushState)&&h("button",{type:"button",disabled:pushBusy,onClick:toggleDevicePush},pushBusy?'جارٍ الحفظ…':pushState==='enabled'?'إيقاف':'تشغيل')),
        h("div",{className:"notification-list"},items.length?items.map(e=>{
          const empName=employees.find(emp=>emp.id===e.employee_id)?.name||"موظف";
          const open=expandedId===e.id;
          return h("article",{key:e.id,className:`notification-item ${e.violation_reviewed?"reviewed":"unread"}`},
            h("button",{type:"button",className:"notification-summary",onClick:()=>setExpandedId(open?null:e.id),"aria-expanded":open,"aria-controls":`notification-detail-${e.id}`},
              h("span",{className:"notification-item-top"},h("strong",null,empName),h("time",null,relTime(e.created_at))),
              h("span",{className:"notification-category"},h("b",null,e.category_name||"مخالفة"),h("small",null,e.violation_reviewed?"تمت المراجعة":"تحتاج مراجعة"))),
            open&&h("div",{className:"notification-detail",id:`notification-detail-${e.id}`},
              h("span",{className:"notification-detail-label"},"سبب تسجيل المخالفة"),
              h("p",null,e.note?.trim()||"لم يكتب المقيم وصفًا لهذه المخالفة."),
              h("div",{className:"notification-meta"},h("span",null,"المقيم: ",e.evaluator_name||"—"),h("time",null,fmtDateTime(e.created_at))),
              !e.violation_reviewed&&h("button",{type:"button",className:"notification-review",disabled:reviewingId===e.id,onClick:()=>review(e.id)},reviewingId===e.id?"جارٍ الحفظ…":"تحديد كمراجَعة")));
        }):h("div",{className:"notification-empty"},"لا توجد مخالفات تحتاج إلى متابعة."))));
  }
  function AuditLogScreen({ audit, displayTarget, onTrash, onTrashAll }) {
    const [selected, setSelected] = useState(null);
    const [confirmClear, setConfirmClear] = useState(false);
    const [visibleCount,setVisibleCount]=useState(20);
    const [moving,setMoving]=useState(false);
    return /* @__PURE__ */ React.createElement("div", { className:"audit-screen" }, audit.length > 0 && /* @__PURE__ */ React.createElement(Btn, { variant: "danger", style: { width: "100%", marginBottom: 12 }, onClick: () => setConfirmClear(true) }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.trash, size: 14 }), " \u0646\u0642\u0644 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u0644\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A"), !audit.length ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.clipboard, size: 28 }), title: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0633\u062C\u0644 \u0628\u0639\u062F", body: "" }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, audit.slice(0,visibleCount).map((a) => /* @__PURE__ */ React.createElement("div", { key: a.id, style: { ...s.rowCard, flexDirection: "column", alignItems: "stretch" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setSelected(a), style: { background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "right", width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13 } }, /* @__PURE__ */ React.createElement("b", null, a.actor), " \u2014 ", a.action), a.target && a.target !== "-" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)" } }, displayTarget(a.target)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-3)", marginTop: 2 } }, fmtDateTime(a.created_at))), /* @__PURE__ */ React.createElement("button", { onClick: () => onTrash(a.id), style: { ...s.linkDanger, marginTop: 6, alignSelf: "flex-start" } }, "\u0646\u0642\u0644 \u0644\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A")))), audit.length>visibleCount && React.createElement("button",{type:"button",className:"audit-load-more",onClick:()=>setVisibleCount(n=>n+20)},"عرض المزيد"), selected && /* @__PURE__ */ React.createElement(Modal, { title: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062D\u062F\u062B", onClose: () => setSelected(null), footer: /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setSelected(null) }, "\u0625\u063A\u0644\u0627\u0642") }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-3)", fontSize: 11 } }, "\u0627\u0644\u0642\u0627\u0626\u0645 \u0628\u0627\u0644\u0625\u062C\u0631\u0627\u0621"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700 } }, selected.actor)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-3)", fontSize: 11 } }, "\u0627\u0644\u0625\u062C\u0631\u0627\u0621"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700 } }, selected.action)), selected.target && selected.target !== "-" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-3)", fontSize: 11 } }, "\u0627\u0644\u0639\u0646\u0635\u0631 \u0627\u0644\u0645\u062A\u0623\u062B\u0631"), /* @__PURE__ */ React.createElement("div", null, displayTarget(selected.target))), selected.details && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-3)", fontSize: 11 } }, "\u062A\u0641\u0627\u0635\u064A\u0644 \u0625\u0636\u0627\u0641\u064A\u0629"), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--bg-2)", padding: "8px 10px", borderRadius: 8, wordBreak: "break-word" } }, selected.details)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--ink-3)", fontSize: 11 } }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0648\u0627\u0644\u0648\u0642\u062A"), /* @__PURE__ */ React.createElement("div", null, fmtDateTime(selected.created_at))))), confirmClear && /* @__PURE__ */ React.createElement(Modal, { title: "\u0646\u0642\u0644 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u0644\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A", onClose: () => setConfirmClear(false), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: async () => {
      if(moving)return;
      setMoving(true);
      try { if(await onTrashAll()===true) setConfirmClear(false); } finally { setMoving(false); }
    } }, "\u0646\u0642\u0644 \u0627\u0644\u0643\u0644 \u0644\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setConfirmClear(false) }, "\u062A\u0631\u0627\u062C\u0639")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-2)" } }, "\u0633\u064A\u062A\u0645 \u0646\u0642\u0644 \u0643\u0644 \u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0638\u0627\u0647\u0631\u0629 \u062D\u0627\u0644\u064A\u064B\u0627 \u0625\u0644\u0649 \u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A. \u062A\u0642\u062F\u0631 \u062A\u0633\u062A\u0631\u062C\u0639\u0647\u0627 \u0645\u0646 \u0647\u0646\u0627\u0643 \u0641\u064A \u0623\u064A \u0648\u0642\u062A.")));
  }
  function TrashScreen({ cycles, audit, archivedCategories=[], archivedBands=[], onRestoreCategory, onRestoreBand, onRestoreCycle, onDeleteCycleForever, onRestoreAudit, onDeleteAuditForever, onEmptyTrash }) {
    const [confirmEmpty, setConfirmEmpty] = useState(false);
    const [confirmItem, setConfirmItem] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const isEmpty = !cycles.length && !audit.length && !archivedCategories.length && !archivedBands.length;
    const h=React.createElement;
    const configTrash=(archivedCategories.length||archivedBands.length)?h("section",{style:{marginBottom:20}},h("h3",null,"تصنيفات ونطاقات محفوظة في السلة"),h("p",{style:{fontSize:12,color:"var(--ink-3)"}},"يمكن استرجاعها هنا. لا يشمل زر إفراغ الدورات وسجل التدقيق هذه العناصر."),
      [...archivedCategories.map(c=>({type:"category",id:c.id,label:c.name})),...archivedBands.map(b=>({type:"band",id:b.id,label:`${b.label} (${b.min}–${b.max})`}))].map(item=>h("div",{key:item.id,style:{...s.rowCard,marginBottom:8}},h("span",{style:{flex:1}},item.label),h(Btn,{onClick:()=>item.type==="category"?onRestoreCategory(item.id):onRestoreBand(item.id)},"استرجاع")))):null;
    return /* @__PURE__ */ React.createElement("div", null, configTrash, (cycles.length>0||audit.length>0) && /* @__PURE__ */ React.createElement(Btn, { variant: "danger", style: { width: "100%", marginBottom: 16 }, onClick: () => setConfirmEmpty(true) }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.trash, size: 14 }), " إفراغ الدورات وسجل التدقيق نهائيًا"), isEmpty ? /* @__PURE__ */ React.createElement(EmptyState, { icon: /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.trash, size: 28 }), title: "\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A \u0641\u0627\u0631\u063A\u0629", body: "\u0623\u064A \u062F\u0648\u0631\u0629 \u0623\u0648 \u062D\u062F\u062B \u062A\u062D\u0630\u0641\u0647 \u0647\u064A\u0638\u0647\u0631 \u0647\u0646\u0627." }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } }, cycles.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 } }, "\u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0645\u062D\u0630\u0648\u0641\u0629"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, cycles.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, style: s.card }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, c.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)", margin: "4px 0 10px" } }, fmtDate(c.start_date), " \u2014 ", fmtDate(c.end_date)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { onClick: () => onRestoreCycle(c.id) }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.rotate, size: 14 }), " \u0627\u0633\u062A\u0631\u062C\u0627\u0639"), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: () => setConfirmItem({ type: "cycle", id: c.id, label: c.name }) }, "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A")))))), audit.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 } }, "\u0623\u062D\u062F\u0627\u062B \u0633\u062C\u0644 \u0627\u0644\u062A\u062F\u0642\u064A\u0642 \u0627\u0644\u0645\u062D\u0630\u0648\u0641\u0629"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, audit.map((a) => /* @__PURE__ */ React.createElement("div", { key: a.id, style: s.card }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13 } }, /* @__PURE__ */ React.createElement("b", null, a.actor), " \u2014 ", a.action), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-3)", margin: "4px 0 10px" } }, fmtDateTime(a.created_at)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(Btn, { onClick: () => onRestoreAudit(a.id) }, /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.rotate, size: 14 }), " \u0627\u0633\u062A\u0631\u062C\u0627\u0639"), /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: () => setConfirmItem({ type: "audit", id: a.id, label: `${a.actor} \u2014 ${a.action}` }) }, "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A"))))))), confirmItem && /* @__PURE__ */ React.createElement(Modal, { title: "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A", onClose: () => setConfirmItem(null), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: async () => {
      if (deleteBusy) return;
      setDeleteBusy(true);
      try {
        const ok = await (confirmItem.type === "cycle" ? onDeleteCycleForever : onDeleteAuditForever)(confirmItem.id);
        if (ok === true) setConfirmItem(null);
      } finally { setDeleteBusy(false); }
    } }, "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A \u2014 \u0644\u0627 \u0631\u062C\u0648\u0639"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setConfirmItem(null) }, "\u062A\u0631\u0627\u062C\u0639")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--red)", fontWeight: 600 } }, '\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 "', confirmItem.label, '" \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0648\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0623\u0628\u062F\u064B\u0627.')), confirmEmpty && /* @__PURE__ */ React.createElement(Modal, { title: "\u0625\u0641\u0631\u0627\u063A \u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A", onClose: () => setConfirmEmpty(false), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: async () => {
      if (deleteBusy) return;
      setDeleteBusy(true);
      try { if (await onEmptyTrash() === true) setConfirmEmpty(false); }
      finally { setDeleteBusy(false); }
    } }, "\u0625\u0641\u0631\u0627\u063A \u0646\u0647\u0627\u0626\u064A\u064B\u0627"), /* @__PURE__ */ React.createElement(Btn, { variant: "ghost", onClick: () => setConfirmEmpty(false) }, "\u062A\u0631\u0627\u062C\u0639")) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--red)", fontWeight: 600 } }, "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 \u0643\u0644 \u0645\u0627 \u0641\u064A \u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A (", cycles.length, " \u062F\u0648\u0631\u0629\u060C ", audit.length, " \u062D\u062F\u062B). \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639.")));
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
  const s = {
    topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "6px 8px 6px 14px", background: "var(--glass)", backdropFilter: "blur(22px) saturate(165%)", WebkitBackdropFilter: "blur(22px) saturate(165%)", position: "fixed", top: "calc(14px + env(safe-area-inset-top, 0px))", left: 10, right: 10, maxWidth: 460, margin: "0 auto", zIndex: 9, border: "1px solid var(--glass-border)", borderRadius: 22, boxShadow: "0 10px 30px rgba(33,30,24,.1), inset 0 1px rgba(255,255,255,.85)" },
    body: { padding: "18px 16px 44px", paddingTop: "calc(88px + env(safe-area-inset-top, 0px))" },
    bottomNav: { position: "fixed", bottom: "calc(8px + env(safe-area-inset-bottom, 0px))", left: 16, right: 16, maxWidth: 452, margin: "0 auto", display: "flex", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", border: "1px solid var(--glass-border)", borderRadius: 20, boxShadow: "0 8px 28px rgba(33,30,24,0.16), 0 2px 8px rgba(33,30,24,0.08)", zIndex: 8, padding: "2px 2px" },
    bottomNavBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6px 4px 5px", minHeight: 48, background: "none", border: "none", cursor: "pointer" },
    iconBtn: { background: "transparent", border: "none", cursor: "pointer", padding: 10, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)", minWidth: 44, minHeight: 44 },
    centerScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 16px", minHeight: "100vh" },
    card: { background: "var(--glass-strong)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "18px 18px", width: "100%", maxWidth: 340, boxSizing: "border-box", boxShadow: "0 1px 2px rgba(33,30,24,0.03), 0 4px 14px rgba(33,30,24,0.035)" },
    input: { width: "100%", boxSizing: "border-box", padding: "11px 14px", borderRadius: 10, border: "0.5px solid var(--border-strong)", fontSize: 16, background: "var(--glass-strong)", color: "var(--ink)" },
    errText: { color: "var(--red)", fontSize: 13, marginBottom: 10 },
    btn: { padding: "11px 18px", borderRadius: 10, border: "0.5px solid var(--border-strong)", background: "var(--glass-strong)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--ink)", minHeight: 44 },
    btnPrimary: { background: "var(--forest)", color: "#fff", border: "0.5px solid var(--forest)", boxShadow: "0 2px 8px rgba(46,70,53,0.25)" },
    btnDanger: { background: "var(--red)", color: "#fff", border: "0.5px solid var(--red)", boxShadow: "0 2px 8px rgba(166,56,44,0.22)" },
    btnGhost: { background: "transparent" },
    rowCard: { display: "flex", alignItems: "center", gap: 12, width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 14, border: "1px solid var(--glass-border)", background: "var(--glass)", cursor: "pointer", boxShadow: "0 1px 2px rgba(33,30,24,0.025)", minHeight: 44 },
    avatarCircle: { width: 38, height: 38, borderRadius: "50%", background: "var(--forest-10)", color: "var(--forest)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
    rankBadge: { width: 28, height: 28, borderRadius: "50%", background: "var(--gold-10)", color: "var(--gold-dark)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 },
    metricCard: { background: "var(--glass)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "14px 16px", boxShadow: "0 1px 2px rgba(33,30,24,0.03), 0 4px 14px rgba(33,30,24,0.035)" },
    catCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 14, border: "1px solid var(--glass-border)", background: "var(--glass)", cursor: "pointer", fontSize: 14, color: "var(--ink)", minHeight: 44, boxShadow: "0 1px 2px rgba(33,30,24,0.025)" },
    catCardActiveNeg: { border: "1.5px solid var(--red)", background: "var(--red-10)", boxShadow: "0 2px 8px rgba(166,56,44,0.1)" },
    catCardActivePos: { border: "1.5px solid var(--green)", background: "var(--green-10)", boxShadow: "0 2px 8px rgba(59,109,36,0.1)" },
    chip: { padding: "8px 14px", borderRadius: 999, border: "0.5px solid var(--border-strong)", background: "var(--glass-strong)", fontSize: 13, cursor: "pointer", color: "var(--ink-2)", minHeight: 36 },
    chipActive: { background: "var(--forest)", color: "#fff", border: "0.5px solid var(--forest)" },
    linkDanger: { background: "none", border: "none", color: "var(--red)", fontSize: 12, cursor: "pointer", padding: 0 },
    warnBanner: { display: "flex", alignItems: "center", gap: 8, background: "var(--gold-10)", color: "var(--gold-dark)", padding: "12px 14px", borderRadius: 12, fontSize: 13, marginBottom: 14 },
    infoBanner: { background: "var(--forest-10)", color: "var(--forest)", padding: "12px 14px", borderRadius: 12, fontSize: 13, marginBottom: 14 },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(20,18,14,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16, backdropFilter: "blur(2px)" },
    modalCard: { background: "var(--glass-strong)", borderRadius: 18, padding: 22, width: "100%", maxWidth: 360, boxSizing: "border-box", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 12px 40px rgba(20,18,14,0.22)" },
    toast: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "var(--forest)", color: "#fff", padding: "12px 20px", borderRadius: 18, fontSize: 13, fontWeight: 600, zIndex: 60, boxShadow: "0 6px 20px rgba(0,0,0,0.2)", maxWidth: "calc(100% - 32px)", textAlign: "center" }
  };
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(AppErrorBoundary, null, React.createElement(App, null)));
});

(function boot(attemptsLeft) {
  if (window.React && window.ReactDOM && window.supabase) {
    __startElmCafeApp__();
  } else if (attemptsLeft > 0) {
    setTimeout(function () { boot(attemptsLeft - 1); }, 150);
  } else {
    var root = document.getElementById('root');
    if (root) {
      root.innerHTML = '<div style="padding:24px;font-family:sans-serif;direction:rtl;text-align:right;color:#A6382C;font-size:14px;line-height:1.6;"><b>تعذر تحميل مكتبات التطبيق</b><br><br>تأكد من الاتصال بالإنترنت وأعد فتح الصفحة.</div>';
    }
  }
})(200);
