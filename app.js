var __startElmCafeApp__ = (() => {
  window.ELM_CAFE_VERSION = "1.2.2";
  const { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } = React;
  const SUPABASE_URL = "https://izfimghzcasnbmdsftps.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_FnhXzXCDLHTwvGGkZBBrkA_UPrm-tZ3";
  const VAPID_PUBLIC_KEY = "BEwpC6fDUNsyVsIZBJZFeuRfTEeH3kyslmsWvBN47CXSaIPDP5nbxJD7QoJdOKQTumM8xAj815BBoJfIiZvIHeQ";
  const EMAIL_DOMAIN = "elmcafe.app";
  // Retry only read requests. Mutations and Auth must never be replayed here.
  function createReadRetryFetch(baseFetch, { sleep = abortableRetryDelay, random = Math.random } = {}) {
    return async function readRetryFetch(input, init = {}) {
      const request = typeof Request !== "undefined" && input instanceof Request ? input : null;
      const url = new URL(request ? request.url : String(input), SUPABASE_URL);
      const method = String(init.method || request?.method || "GET").toUpperCase();
      const signal = init.signal || request?.signal;
      const mayRetry = url.origin === new URL(SUPABASE_URL).origin &&
        url.pathname.startsWith("/rest/v1/") && ["GET", "HEAD"].includes(method);
      for (let attempt = 0; ; attempt++) {
        if (signal?.aborted) throw signal.reason || new DOMException("Aborted", "AbortError");
        let response;
        try {
          response = await baseFetch(request && mayRetry ? request.clone() : input, init);
        } catch (error) {
          if (!mayRetry || attempt >= 2 || signal?.aborted || error?.name !== "TypeError") throw error;
          await sleep(500 * 2 ** attempt + Math.floor(random() * 200), signal);
          continue;
        }
        if (!mayRetry || attempt >= 2 || ![408, 429, 502, 503, 504].includes(response.status)) return response;
        const retryAfter = response.headers.get("Retry-After");
        let requestedDelay = 0;
        if (retryAfter) {
          requestedDelay = /^\d+(\.\d+)?$/.test(retryAfter.trim())
            ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now();
          if (!Number.isFinite(requestedDelay)) requestedDelay = 0;
        }
        // Respect long server limits by returning the error, not retrying early.
        if (requestedDelay > 10000) return response;
        const delay = Math.max(requestedDelay, 500 * 2 ** attempt + Math.floor(random() * 200));
        try { await response.body?.cancel(); } catch (_) {}
        await sleep(delay, signal);
      }
    };
  }
  function abortableRetryDelay(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) return reject(signal.reason || new DOMException("Aborted", "AbortError"));
      const onAbort = () => {
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
        reject(signal.reason || new DOMException("Aborted", "AbortError"));
      };
      const timer = setTimeout(() => { signal?.removeEventListener("abort", onAbort); resolve(); }, ms);
      signal?.addEventListener("abort", onAbort, { once:true });
    });
  }
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { fetch:createReadRetryFetch(window.fetch.bind(window)) }
  });
  const tr=value=>window.ElmI18n?.translate(value)??value;
  const locale=()=>window.ElmI18n?.getLanguage()==="en"?"en-GB":"ar-EG-u-nu-latn";
  const matches=(value,query)=>[String(value??""),String(tr(value??""))].some(v=>v.toLowerCase().includes(query.trim().toLowerCase()));
  let currentScreen="startup", telemetryBusy=false;
  const telemetrySent=new Map();
  async function reportClientError(code) {
    const key=code+":"+currentScreen;
    if(telemetryBusy||Date.now()-(telemetrySent.get(key)||0)<60000||!navigator.onLine)return;
    telemetryBusy=true;telemetrySent.set(key,Date.now());
    try { const {data}=await supabase.auth.getSession(); if(data?.session) await supabase.rpc("report_client_error",{p_release:window.ELM_CAFE_VERSION,p_code:code,p_screen:currentScreen}); } catch(_) {} finally {telemetryBusy=false;}
  }
  window.addEventListener("error",()=>reportClientError("runtime_error"));
  window.addEventListener("unhandledrejection",()=>reportClientError("unhandled_rejection"));
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
      return new Date(iso).toLocaleString(locale(), {
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
      return new Date(iso).toLocaleDateString(locale(), { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit" });
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
          session && h("div", { className:`connection-status ${connectionState || "checking"}`, role:"status", title:lastSyncAt ? `آخر تحديث ناجح: ${new Date(lastSyncAt).toLocaleString(locale())}` : "لم يكتمل تحديث البيانات بعد" },
            h("span", { className:"connection-dot" }),
            h("span", null, connectionState === "connected" ? "متصل" : connectionState === "offline" ? "لا يوجد إنترنت" : connectionState === "error" ? "تعذّر التحديث" : "جارٍ التحقق"),
            h("span", { className:"connection-separator" }, "·"),
            h("span", null, lastSyncAt ? `آخر تحديث ${new Date(lastSyncAt).toLocaleTimeString(locale(),{hour:"2-digit",minute:"2-digit"})}` : "لم يتم التحديث")))),
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
    if (["adminUsers", "adminCategories", "adminCycles", "evaluatorActivity", "auditLog", "moreMenu", "trash", "securityMonitor", "rewardsHub"].includes(screen)) return "moreMenu";
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
    const closeRef=useRef(onClose),dialogRef=useRef(null);closeRef.current=onClose;
    useEffect(()=>{
      const previousFocus=document.activeElement,body=document.body,y=window.scrollY;
      const previous={position:body.style.position,top:body.style.top,left:body.style.left,right:body.style.right,width:body.style.width};
      Object.assign(body.style,{position:"fixed",top:`-${y}px`,left:"0",right:"0",width:"100%"});
      const focusables=()=>[...(dialogRef.current?.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')||[])].filter(el=>el.getClientRects().length);
      const keydown=e=>{if(e.key==="Escape"){e.preventDefault();closeRef.current?.();}if(e.key==="Tab"){const nodes=focusables(),first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};
      document.addEventListener("keydown",keydown);focusables()[0]?.focus({preventScroll:true});
      return()=>{document.removeEventListener("keydown",keydown);Object.assign(body.style,previous);window.scrollTo(0,y);if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});};
    },[]);
    const panel = React.createElement("div", { className: "app-modal-overlay" + (compact ? " compact" : "") + (account ? " account-modal" : ""), style: s.modalOverlay, role: "dialog", "aria-modal": true, "aria-label": title, onClick: onClose },
      React.createElement("div", { ref:dialogRef, className: "app-modal-card" + (compact ? " compact" : ""), style: s.modalCard, onClick: (e) => e.stopPropagation() },
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
    componentDidCatch(error) { document.getElementById("initial-splash")?.remove(); document.documentElement.classList.remove("elm-booting"); console.error("Elm Cafe render error", error); reportClientError("render_error"); }
    retryRender() { this.setState({ failed:false, errorText:"" }); }
    async recoverSession() { try { await supabase.auth.signOut({scope:"local"}); } catch (_) {} location.replace(location.pathname + "?reload=" + Date.now()); }
    render() {
      if (!this.state.failed) return this.props.children;
      return React.createElement("div",{className:"app-fallback",role:"alert",style:{background:"var(--glass-strong)",border:"1px solid var(--glass-border)",borderRadius:20,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",padding:24}},
        React.createElement("strong",null,"تعذّر عرض هذه الشاشة"),
        React.createElement("p",null,"يمكنك إعادة تحميل التطبيق. لو كنت بتكتب تقييم، راجع السجل قبل إعادة المحاولة حتى لا يتكرر."),
        React.createElement("button",{type:"button",onClick:()=>this.retryRender()},"إعادة المحاولة"),
        React.createElement("button",{type:"button",onClick:()=>location.replace(location.pathname + "?reload=" + Date.now())},"إعادة تحميل التطبيق"),
        React.createElement("button",{type:"button",className:"fallback-secondary",onClick:this.recoverSession},"تسجيل الدخول من جديد على هذا المتصفح"),
        this.state.errorText && React.createElement("details",null,React.createElement("summary",null,"تفاصيل الخطأ لإرسالها للدعم"),React.createElement("pre",null,this.state.errorText)));
    }
  }
  function Field({ label, children }) {
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, color: "var(--ink-2)", marginBottom: 6 } }, label), children);
  }
  function Switch({ checked, onChange, label, description }) {
    return /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => onChange(!checked), style: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", padding: "10px 0", cursor: "pointer", textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, marginLeft: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "var(--ink)" } }, label), description && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-3)", marginTop: 1 } }, description)), /* @__PURE__ */ React.createElement("div", { style: { width: 46, height: 28, borderRadius: 999, background: checked ? "var(--forest)" : "var(--border-strong)", position: "relative", transition: "background .18s ease", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, right: checked ? 21 : 3, transition: "right .18s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" } })));
  }
  function Btn({ children, onClick, variant = "secondary", disabled, style, type = "button" }) {
    const lock=useRef(false),[pending,setPending]=useState(false),[failed,setFailed]=useState(false);
    const handle=async(event)=>{if(disabled||lock.current)return;lock.current=true;setFailed(false);try{const result=onClick?.(event);if(result&&typeof result.then==="function"){setPending(true);await result;}}catch(_){setFailed(true);reportClientError("network_error");}finally{lock.current=false;setPending(false);}};
    const blocked=disabled||pending;
    const base = { ...s.btn, ...variant === "primary" ? s.btnPrimary : variant === "danger" ? s.btnDanger : variant === "ghost" ? s.btnGhost : {} };
    return React.createElement(React.Fragment,null,React.createElement("button", { type, onClick:onClick?handle:undefined, disabled:blocked,"aria-busy":pending||undefined, style: { ...base, ...blocked ? { opacity: 0.5, cursor: "not-allowed" } : {}, ...style } },pending&&React.createElement("span",{className:"button-spinner","aria-hidden":true}), children),failed&&React.createElement("span",{role:"alert",style:{color:"var(--red)",fontSize:12}},"تعذّر إتمام العملية. تحقق من الاتصال وحاول مجددًا."));
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
    const {data,error}=await supabase.from('push_subscriptions').delete().eq('endpoint',subscription.endpoint).select('endpoint');
    if(error||!data?.some(row=>row.endpoint===subscription.endpoint))throw error||new Error('Unable to confirm subscription deletion');
    await subscription.unsubscribe();
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
  function OfflineBanner(){const [online,setOnline]=useState(navigator.onLine);useEffect(()=>{const update=()=>setOnline(navigator.onLine);window.addEventListener("online",update);window.addEventListener("offline",update);return()=>{window.removeEventListener("online",update);window.removeEventListener("offline",update);};},[]);return !online&&React.createElement("aside",{className:"offline-banner",role:"status"},"لا يوجد اتصال. الحفظ وتحديث البيانات يحتاجان الإنترنت.");}
  function App() {
    const [language, setLanguage] = useState(() => window.ElmI18n?.getLanguage() || 'ar');
    useEffect(() => {
      const sync = () => setLanguage(window.ElmI18n?.getLanguage() || 'ar');
      window.addEventListener('elm-language-change', sync);
      return () => window.removeEventListener('elm-language-change', sync);
    }, []);
    const [booting, setBooting] = useState(true);
    useLayoutEffect(() => { if (!booting) { document.getElementById("initial-splash")?.remove(); document.documentElement.classList.remove("elm-booting"); } }, [booting]);
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
    currentScreen=screen;
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
    useMemo(() => {
      // Feed English names into the interface translator during render, so the very same render already shows them.
      const pairs = {};
      [...employees, ...categories].forEach(item => { if (item?.name && item?.name_en) pairs[item.name] = item.name_en; });
      window.ElmI18n?.registerNames?.(pairs);
    }, [employees, categories]);
    useEffect(() => {
      if (!session) return;
      let timer = null;
      const changed = new Set();
      const scheduleRefresh = table => {
        changed.add(table);
        if (timer) clearTimeout(timer);
        // Violation notifications must feel instant; other tables keep a short debounce to batch bursts.
        const delay = changed.has("violation_inbox") ? 80 : 350;
        timer = setTimeout(() => {
          const tables=[...changed]; changed.clear();
          tables.forEach(name => refreshChangedTable(name));
        }, delay);
      };
      let channelWasDown = false;
      let hiddenAt = 0;
      const onVisibility = () => {
        if (document.visibilityState === "hidden") { hiddenAt = Date.now(); return; }
        // iOS suspends websockets for home-screen apps: on return, re-sync anything missed while away.
        if (hiddenAt && Date.now() - hiddenAt > 20000) refetch();
        else scheduleRefresh("violation_inbox");
        hiddenAt = 0;
      };
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pageshow", onVisibility);
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
        .subscribe(status => {
          if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) channelWasDown = true;
          else if (status === "SUBSCRIBED" && channelWasDown) { channelWasDown = false; refetch(); }
        });
      return () => {
        if (timer) clearTimeout(timer);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pageshow", onVisibility);
        supabase.removeChannel(channel);
      };
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
        if((document.scrollingElement?.scrollTop||window.scrollY)>1 || (surface()?.scrollTop||0)>1)return;
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
    async function addAudit(action,target,details=""){
      try{const {data,error}=await supabase.from("audit_log").insert({actor:session?.name||"النظام",action,target,details}).select().single();if(error||!data){reportClientError("network_error");return false;}setAudit(prev=>[data,...prev]);return true;}catch(_){reportClientError("network_error");return false;}
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
    useLayoutEffect(() => {
      if (!session || booting) return;
      const header = document.querySelector(".app-topbar");
      if (!header) return;
      const applyTopbarSpace = () => {
        const gap = header.getBoundingClientRect().bottom + 12;
        document.documentElement.style.setProperty("--topbar-space", `${Math.round(gap)}px`);
      };
      applyTopbarSpace();
      const observer = new ResizeObserver(applyTopbarSpace);
      observer.observe(header);
      window.addEventListener("resize", applyTopbarSpace);
      window.addEventListener("orientationchange", applyTopbarSpace);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", applyTopbarSpace);
        window.removeEventListener("orientationchange", applyTopbarSpace);
      };
    }, [session, booting]);
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
    if (booting) return null;
    return /* @__PURE__ */ React.createElement("div", { dir: language === "en" ? "ltr" : "rtl" }, !session && screen !== "resetPassword" && /* @__PURE__ */ React.createElement(
      LoginScreen,
      {
        onLogin: async (username, password, captchaToken) => {
          const uname = username.trim().toLowerCase();
          const { data: lookup } = await supabase.from("user_lookup").select("email").eq("username", uname).maybeSingle();
          const email = lookup ? lookup.email : `${uname}@${EMAIL_DOMAIN}`;
          const { data, error } = await supabase.auth.signInWithPassword({ email, password, options:{captchaToken} });
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
        onReset: async (username, captchaToken) => {
          const uname = username.trim().toLowerCase();
          const { data: lookup } = await supabase.from("user_lookup").select("email").eq("username", uname).maybeSingle();
          const email = lookup ? lookup.email : `${uname}@${EMAIL_DOMAIN}`;
          const { error } = await supabase.auth.resetPasswordForEmail(email,{captchaToken});
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
    ), /* @__PURE__ */ React.createElement("main", { className: "app-main-content", key: screen + "-" + (ctx.employeeId || ""), style: { ...session?.role === "super_admin" ? { ...s.body, paddingBottom: "calc(128px + env(safe-area-inset-bottom, 0px))" } : s.body, animation: "fadeIn .28s cubic-bezier(.2,.75,.25,1)" } }, screen === "home" && /* @__PURE__ */ React.createElement(
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
          const { data, error } = await supabase.from("evaluations").update(patch).eq("id", evId).select("id,status");
          if (error || !data?.some(row => row.id === evId && row.status === "cancelled")) {
            showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u0625\u0644\u063A\u0627\u0621: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setEvaluations((prev) => prev.map((e) => e.id === evId ? { ...e, ...patch } : e));
          const cancelled = evaluations.find(e => e.id === evId);
          const employeeName = employees.find(e => e.id === cancelled?.employee_id)?.name || "موظف";
          await addAudit("إلغاء تقييم", `${employeeName} — ${cancelled?.category_name || "تقييم"}`, reason || "");
          showToast("\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u0642\u064A\u064A\u0645");
          return true;
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
        employees:employees.filter(e=>!e.deleted_at),
        canEdit:session?.role==="super_admin",
        onUpdate:async(id,patch)=>{
          if(session?.role!=="super_admin")return false;
          const {data,error}=await supabase.rpc("admin_update_employee",{p_id:id,p_name:patch.name,p_name_en:patch.name_en||"",p_employee_code:patch.employee_code,p_profession:patch.profession});
          const row=Array.isArray(data)?data[0]:data;
          if(error||row?.id!==id||row.name!==patch.name||String(row.employee_code)!==patch.employee_code||(row.name_en||"")!==(patch.name_en||"")||row.profession!==patch.profession){showToast("تعذّر تعديل الموظف. راجع البيانات والصلاحيات وإعداد التحديث.","error");return false;}
          setEmployees(prev=>prev.map(e=>e.id===id?row:e));
          try{await addAudit("تعديل بيانات موظف",id);}catch(_){}
          showToast("تم تعديل بيانات الموظف");return true;
        },
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
          const { data, error } = await supabase.from("employees").update({ archived }).eq("id", id).select("id,archived");
          if (error || !data?.some(row => row.id === id && row.archived === archived)) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, archived } : e));
          await addAudit(archived ? "\u0623\u0631\u0634\u0641\u0629 \u0645\u0648\u0638\u0641" : "\u0625\u0639\u0627\u062F\u0629 \u062A\u0641\u0639\u064A\u0644 \u0645\u0648\u0638\u0641", id);
          showToast(archived ? "\u062A\u0645\u062A \u0627\u0644\u0623\u0631\u0634\u0641\u0629" : "\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0639\u064A\u0644");
          return true;
        },
        onDelete: async (id, name) => {
          const { data, error } = await supabase.from("employees").delete().eq("id", id).select("id");
          if (error || !data?.some(row => row.id === id)) {
            showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062D\u0630\u0641: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setEmployees((prev) => prev.filter((e) => e.id !== id));
          setEvaluations((prev) => prev.filter((e) => e.employee_id !== id));
          await addAudit("\u062D\u0630\u0641 \u0645\u0648\u0638\u0641 \u0646\u0647\u0627\u0626\u064A\u064B\u0627", name);
          showToast("\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0648\u0638\u0641 \u0648\u0643\u0644 \u062A\u0642\u064A\u064A\u0645\u0627\u062A\u0647 \u0646\u0647\u0627\u0626\u064A\u064B\u0627");
          return true;
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
        canEditNames:session?.role==="super_admin",
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
          const { data, error } = await supabase.from("categories").update(patch).eq("id", id).select(["id",...Object.keys(patch)].join(","));
          if (error || !data?.some(row => row.id === id && Object.entries(patch).every(([key,value])=>row[key]===value))) {
            showToast(`\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u062A\u062D\u062F\u064A\u062B: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
            return false;
          }
          setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
          await addAudit("\u062A\u0639\u062F\u064A\u0644 \u062A\u0635\u0646\u064A\u0641 \u062A\u0642\u064A\u064A\u0645", id, JSON.stringify(patch));
          showToast("\u062A\u0645 \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u2014 \u0644\u0646 \u064A\u0624\u062B\u0631 \u0639\u0644\u0649 \u0627\u0644\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629");
          return true;
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
      onRedeem:async(employeeId,rewardId,requestId)=>{
        if(!rewardsReady){showToast("شغّل ملف SQL الخاص بالمكافآت أولًا","error");return false;}
        const {data,error}=await supabase.rpc("redeem_employee_reward_once",{p_employee_id:employeeId,p_reward_id:rewardId,p_request_id:requestId});
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
    }), screen === "evaluatorActivity" && /* @__PURE__ */ React.createElement(EvaluatorActivityScreen, { evaluations, activeCycle, cycles: cycles.filter((c) => !c.deleted_at) }), screen === "auditLog" && /* @__PURE__ */ React.createElement(
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
          const { data, error } = await supabase.from("cycles").update({ deleted_at: null }).eq("id", id).select("id,deleted_at");
          if (error || !data?.some(row => row.id === id && !row.deleted_at)) {
            showToast(`\u062A\u0639\u0630\u0651\u0631\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${error?.message || "راجع صلاحيات قاعدة البيانات"}`, "error");
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
    ), screen === "securityMonitor" && isOwner && React.createElement(SecurityMonitor), screen === "moreMenu" && /* @__PURE__ */ React.createElement(MoreMenuScreen, { onGo: (scr) => goto(scr), isOwner }))), session?.role === "super_admin" && /* @__PURE__ */ React.createElement(BottomNav, { activeScreen: screen, onSelect: gotoTab }), /* @__PURE__ */ React.createElement(Toast, { toast }), (pullState || refreshing) && React.createElement("div", { className:"pull-status", role:"status" }, refreshing ? "جارٍ تحديث البيانات…" : pullState === "ready" ? "اترك الشاشة للتحديث" : "اسحب للتحديث"), confirmLogout && React.createElement(Modal, { title:"تسجيل الخروج", onClose:()=>setConfirmLogout(false), footer:React.createElement(React.Fragment,null,React.createElement(Btn,{variant:"primary",onClick:()=>{setConfirmLogout(false);logout();}},"تأكيد الخروج"),React.createElement(Btn,{variant:"ghost",onClick:()=>setConfirmLogout(false)},"البقاء")) }, "سيتم إغلاق جلسة حسابك على هذا الجهاز."), pendingNav && /* @__PURE__ */ React.createElement(Modal, { compact:true, title: "\u0644\u062F\u064A\u0643 \u062A\u063A\u064A\u064A\u0631\u0627\u062A \u063A\u064A\u0631 \u0645\u062D\u0641\u0648\u0638\u0629", onClose: () => setPendingNav(null), footer: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Btn, { variant: "danger", onClick: () => {
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
      case "securityMonitor": return "مراقبة النظام";
      case "trash":
        return "\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A";
      default:
        return "ELM CAFE";
    }
  }
  function LoginScreen({ onLogin, onReset, theme, onToggleTheme }) {
    const captchaKey=window.ELM_PUBLIC_CONFIG?.turnstileSiteKey||"";
    const [captchaToken,setCaptchaToken]=useState("");
    const captchaRef=useRef(null),captchaId=useRef(null),attempts=useRef([]);
    useEffect(()=>{
      if(!captchaKey)return;
      let cancelled=false;
      const render=()=>{if(cancelled||!captchaRef.current)return;captchaId.current=window.turnstile.render(captchaRef.current,{sitekey:captchaKey,callback:setCaptchaToken,"expired-callback":()=>setCaptchaToken(""),"error-callback":()=>{setCaptchaToken("");setErr("تعذّر التحقق الأمني. أعد المحاولة.");}});};
      let script=document.querySelector('script[data-elm-captcha]');
      if(window.turnstile)render();else{if(!script){script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.dataset.elmCaptcha="1";script.async=true;document.head.appendChild(script);}script.addEventListener("load",render);}
      return()=>{cancelled=true;script?.removeEventListener("load",render);if(captchaId.current!=null)window.turnstile?.remove(captchaId.current);};
    },[captchaKey]);
    function resetCaptcha(){if(captchaKey){setCaptchaToken("");if(captchaId.current!=null)window.turnstile?.reset(captchaId.current);}}
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
      attempts.current=attempts.current.filter(t=>Date.now()-t<60000);
      if(attempts.current.length>=5){setErr("محاولات كثيرة. انتظر دقيقة ثم حاول مجددًا.");return;}
      if(captchaKey&&!captchaToken){setErr("أكمل التحقق الأمني أولًا.");return;}
      submitLock.current = true;
      setErr("");
      setBusy(true);
      try {
        const errMsg = await onLogin(username, password, captchaToken);
        if (errMsg) {attempts.current.push(Date.now());setErr(errMsg);}else attempts.current=[];
      } catch (_) {
        setErr(navigator.onLine ? "تعذّر التحقق من الحساب. حاول مرة أخرى." : "لا يوجد اتصال بالإنترنت.");
      } finally { setBusy(false); submitLock.current = false; resetCaptcha(); }
    }
    async function reset() {
      if (!username.trim()) {
        setErr("\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0623\u0648\u0644\u064B\u0627");
        return;
      }
      if(submitLock.current)return;
      if(captchaKey&&!captchaToken){setErr("أكمل التحقق الأمني أولًا.");return;}
      submitLock.current=true;setBusy(true);
      try { await onReset(username,captchaToken); }
      catch (_) { setErr("تعذّر طلب رابط الاستعادة. تحقق من الإنترنت وحاول مرة أخرى."); return; } finally {submitLock.current=false;setBusy(false);resetCaptcha();}
      setResetMsg("\u0644\u0648 \u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0648\u062C\u0648\u062F\u060C \u0647\u064A\u0648\u0635\u0644\u0643 \u0631\u0627\u0628\u0637 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0645\u0633\u062C\u0644.");
    }
    return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", background: "radial-gradient(ellipse 70% 50% at 50% 0%, var(--forest-10), transparent)", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "login-theme-button", onClick: onToggleTheme, "aria-label": theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي" }, /* @__PURE__ */ React.createElement(Icon, { svg: theme === "dark" ? ICONS.sun : ICONS.moon, size: 18 })), /* @__PURE__ */ React.createElement("button", { type:"button", className:"login-language-button", onClick:()=>window.ElmI18n?.setLanguage(window.ElmI18n.getLanguage()==="ar"?"en":"ar"), "aria-label":"Switch language" }, window.ElmI18n?.getLanguage()==="ar"?"EN":"ع"), /* @__PURE__ */ React.createElement("img", { src: LOGO_SRC, alt: "", "aria-hidden": "true", style: { position: "absolute", width: 520, height: "auto", opacity: 0.05, top: "-8%", right: "-18%", transform: "rotate(8deg)", pointerEvents: "none", filter: "grayscale(1)" } }), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Logo, { size: 108 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em", textAlign: "center" } }, "ELM CAFE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-3)", marginTop: 5, marginBottom: 30, textAlign: "center" } }, "\u0646\u0638\u0627\u0645 \u062A\u0642\u064A\u064A\u0645 \u0623\u062F\u0627\u0621 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646"), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { ...s.card, maxWidth: "100%" } }, /* @__PURE__ */ React.createElement(Field, { label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645" }, /* @__PURE__ */ React.createElement("input", { style: s.input, value: username, onChange: (e) => setUsername(e.target.value), autoCapitalize: "none", autoCorrect: "off", autoFocus: true })), /* @__PURE__ */ React.createElement(Field, { label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showPw ? "text" : "password", style: { ...s.input, paddingLeft: 42 }, value: password, onChange: (e) => setPassword(e.target.value) }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowPw((v) => !v), style: { position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--ink-3)", display: "flex" }, "aria-label": "\u0625\u0638\u0647\u0627\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }, /* @__PURE__ */ React.createElement(Icon, { svg: showPw ? ICONS.eyeOff : ICONS.eye, size: 17 })))), captchaKey && React.createElement("div",{ref:captchaRef,style:{marginBlock:12}}), err && /* @__PURE__ */ React.createElement("div", { style: s.errText }, err), resetMsg && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--forest)", marginBottom: 10 } }, resetMsg), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", type: "submit", disabled: busy, style: { width: "100%", marginTop: 8 } }, busy ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062F\u062E\u0648\u0644\u2026" : "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: reset, style: { background: "none", border: "none", color: "var(--ink-3)", fontSize: 12, marginTop: 16, cursor: "pointer", width: "100%" } }, "\u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061F"))));
  }
  function ResetPasswordScreen({ onSubmit }) {
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const resetLock=useRef(false);
    async function submit(e) {
      e.preventDefault();
      if(resetLock.current)return;
      setErr("");
      if (pw.length < 6) {
        setErr("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644");
        return;
      }
      if (pw !== pw2) {
        setErr("\u0643\u0644\u0645\u062A\u0627 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u062A\u0637\u0627\u0628\u0642\u062A\u064A\u0646");
        return;
      }
      resetLock.current=true;setBusy(true);
      try{const errMsg = await onSubmit(pw);if (errMsg) setErr(errMsg);}catch(_){setErr("تعذّر الاتصال. بياناتك لم تُمسح.");}finally{resetLock.current=false;setBusy(false);}
    }
    return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", background: "radial-gradient(ellipse 70% 50% at 50% 0%, var(--forest-10), transparent)" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 24 } }, /* @__PURE__ */ React.createElement(Logo, { size: 54 }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 800, marginTop: 14 } }, "\u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062C\u062F\u064A\u062F\u0629"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-3)", marginTop: 4 } }, "\u0627\u062E\u062A\u0631 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u062C\u062F\u064A\u062F\u0629 \u0644\u062D\u0633\u0627\u0628\u0643")), /* @__PURE__ */ React.createElement("form", { onSubmit: submit, style: { ...s.card, maxWidth: 340 } }, /* @__PURE__ */ React.createElement(Field, { label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629" }, /* @__PURE__ */ React.createElement("input", { type: "password", style: s.input, value: pw, onChange: (e) => setPw(e.target.value), autoFocus: true })), /* @__PURE__ */ React.createElement(Field, { label: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }, /* @__PURE__ */ React.createElement("input", { type: "password", style: s.input, value: pw2, onChange: (e) => setPw2(e.target.value) })), err && /* @__PURE__ */ React.createElement("div", { style: s.errText }, err), /* @__PURE__ */ React.createElement(Btn, { variant: "primary", type: "submit", disabled: busy, style: { width: "100%", marginTop: 8 } }, busy ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631")));
  }
  function EvaluatorHome({ employees, activeCycle, session, evaluations, onOpen, onProfile, onGo, initialEvaluationId }) {
    const h = React.createElement;
    const [query, setQuery] = useState("");
    const current = activeCycle ? evaluations.filter(e => e.cycle_id === activeCycle.id && e.status === "active") : [];
    const filtered = employees.filter(e => matches(e.name,query) || String(e.employee_code || "").includes(query));
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
              h("span", { className:"person-avatar", style:{background:avatarColor(e.name).bg,color:avatarColor(e.name).fg} }, tr(e.name).trim().slice(0,1)),
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
    const filtered=all.filter(e=>!query || (e.category_name||"").includes(query) || matches(employees.find(emp=>emp.id===e.employee_id)?.name,query));
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
        h("span", { className:"person-avatar", style:{ background:avatarColor(employee.name).bg, color:avatarColor(employee.name).fg } }, employetr(e.name).trim().slice(0,1)),
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
      certificateOpen && chosenCertificateCycle && h("div",{className:"certificate-overlay"},h("section",{className:"certificate-print",dir:window.ElmI18n?.getLanguage()==="en"?"ltr":"rtl"},h("button",{type:"button",className:"certificate-close no-print",onClick:()=>setCertificateOpen(false),"aria-label":"إغلاق"},"×"),h("div",{className:"certificate-frame"},h("img",{src:LOGO_SRC,alt:"ELM CAFE",className:"certificate-logo"}),h("span",{className:"certificate-brand"},"ELM CAFE"),h("span",{className:"certificate-eyebrow"},"شهادة تقدير شهرية"),h("h1",null,"تُمنح هذه الشهادة إلى"),h("h2",null,employee.name),h("p",{className:"certificate-profession"},employee.profession||"موظف"," · رقم الموظف ",employee.employee_code||"—"),h("p",{className:"certificate-copy"},"تقديرًا لالتزامه ومساهمته الإيجابية خلال دورة التقييم، واعترافًا بجهده في دعم فريق العمل."),h("div",{className:"certificate-period"},h("span",null,chosenCertificateCycle.name),h("small",null,fmtDate(chosenCertificateCycle.start_date)," — ",fmtDate(chosenCertificateCycle.end_date))),h("div",{className:"certificate-stats"},h("div",null,h("strong",null,certificatePoints),h("small",null,"نقطة إيجابية")),h("div",null,h("strong",null,certificatePositive.length),h("small",null,"إنجازًا إيجابيًا")),h("div",null,h("strong",null,Math.round(computeScore(employee.id,chosenCertificateCycle.id))," / 100"),h("small",null,"النتيجة النهائية"))),h("footer",{className:"certificate-signature"},h("span",null,h("small",null,"تاريخ الإصدار"),h("strong",null,new Date().toLocaleDateString(locale()))),h("span",null,h("i",null,managerName),h("small",null,"إدارة ELM CAFE"))),h("div",{className:"certificate-actions no-print"},h("button",{type:"button",onClick:()=>setTimeout(()=>window.print(),120)},"طباعة / حفظ PDF"),h("small",{className:"certificate-share-hint"},"احفظ الشهادة بصيغة PDF، ثم أرفقها من ملفات الجهاز في واتساب."),h("button",{type:"button",onClick:()=>setCertificateOpen(false)},"إغلاق"))))));
  }
  function EvalRow({ e }) {
    const isPos = e.type === "positive";
    return /* @__PURE__ */ React.createElement("div", { style: { ...s.rowCard, cursor: "default", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: e.status === "cancelled" ? "var(--ink-4)" : isPos ? "var(--green)" : "var(--red)", flexShrink: 0, marginTop: 6 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "start", minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: e.status === "cancelled" ? "var(--ink-3)" : "var(--ink)", textDecoration: e.status === "cancelled" ? "line-through" : "none" } }, e.category_name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-3)" } }, e.evaluator_name, " \xB7 ", fmtDateTime(e.created_at)), e.note && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-2)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, e.note)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: isPos ? "var(--green)" : "var(--red)", flexShrink: 0 } }, isPos ? "+" : "-", e.category_points));
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
      if (note.includes("[وصف الواقعة]") || note.includes("[describe the incident]")) {
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
        aiSuggestions.map((candidate,index)=>React.createElement("button",{key:index,type:"button",className:"ai-option",disabled:saving,onClick:()=>{setNote(tr(candidate));setAiError("");}},candidate)))), category && category.type === "negative" && /* @__PURE__ */ React.createElement("div", { style: { ...s.card, maxWidth: "100%", marginBottom: 16, padding: "6px 16px" } }, /* @__PURE__ */ React.createElement(Switch, { checked: isViolation, onChange: setIsViolation, label: "\u0625\u0634\u0639\u0627\u0631 \u0628\u0627\u0644\u0645\u062E\u0627\u0644\u0641\u0629", description: "\u064A\u0633\u062A\u0648\u062C\u0628 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0623\u0639\u0644\u0649 (\u0645\u062B\u0644\u064B\u0627: \u062E\u0635\u0645 \u0645\u0646 \u0627\u0644\u0631\u0627\u062A\u0628)" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 6 } }, /* @__PURE__ */ React.createElement(Btn, { variant: "primary", style: { flex: 1 }, disabled: !category || saving, onClick: commit }, saving ? "\u062C\u0627\u0631\u0650 \u0627\u0644\u062D\u0641\u0638\u2026" : "\u062D\u0641\u0638 \u0627\u0644\u062A\u0642\u064A\u064A\u0645")));
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
      cancelTarget && h(Modal,{title:"إلغاء التقييم",onClose:()=>setCancelTarget(null),footer:h(React.Fragment,null,h(Btn,{variant:"danger",onClick:async()=>{if(await onCancel(cancelTarget.id,reason)===true)setCancelTarget(null);}},"تأكيد الإلغاء"),h(Btn,{variant:"ghost",onClick:()=>setCancelTarget(null)},"تراجع"))},
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
    const redeemRequest=useRef(null),redeemLock=useRef(false);
    async function redeem(){if(!redeemEmployee||!selectedReward||busy||redeemLock.current)return;redeemLock.current=true;setBusy(true);try{const ok=await onRedeem(redeemEmployee.emp.id,selectedReward, (redeemRequest.current?.key===redeemEmployee.emp.id+":"+selectedReward ? redeemRequest.current.id : (redeemRequest.current={key:redeemEmployee.emp.id+":"+selectedReward,id:crypto.randomUUID()}).id));if(ok){redeemRequest.current=null;setRedeemEmployee(null);setSelectedReward("");}}finally{redeemLock.current=false;setBusy(false);}}
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
        h("div",{className:"pending-list"},notRated.slice(0,3).map(e=>h("button",{key:e.id,type:"button",onClick:()=>onNewEval(e.id)},h("span",{className:"person-avatar",style:{background:avatarColor(e.name).bg,color:avatarColor(e.name).fg}},tr(e.name).trim().slice(0,1)),h("span",null,h("strong",null,e.name),h("small",null,e.profession||"موظف")),h(Icon,{svg:ICONS.back,size:16}))))),
      h("section",{className:"dashboard-panel"},h("div",{className:"section-heading"},h("div",null,h("span",{className:"eyebrow"},"المتابعة"),h("h2",null,"آخر التقييمات")),h("button",{className:"text-action",onClick:()=>onGo("evaluationsLog")},"عرض الكل")),
        recentEvaluations.length?h("div",{className:"activity-feed"},recentEvaluations.map(e=>h("button",{key:e.id,type:"button",className:"evaluation-activity-item",onClick:()=>setSelectedRecentId(e.id)},h("span",{className:e.type==="positive"?"evaluation-sign positive":"evaluation-sign negative"},e.type==="positive"?`+${e.category_points}`:`−${e.category_points}`),h("span",{className:"evaluation-activity-main"},h("strong",null,e.category_name),h("small",null,employees.find(emp=>emp.id===e.employee_id)?.name||"موظف"," · ",relTime(e.created_at)))))):h("div",{className:"dash-empty"},"لا توجد تقييمات بعد.")),
      selectedRecent&&h(EvaluationDetailModal,{evaluation:selectedRecent,employees,onClose:()=>setSelectedRecentId(null)}));
  }

  const SecurityMonitor=lazyScreen("records","SecurityMonitor",()=>({Btn,EmptyState,ICONS,Icon,Modal,fmtDate,fmtDateTime,s,supabase,useEffect,useState}));

  const moduleLoads=new Map();
  function loadScreenModule(group){
    if(window.ELM_MODULES?.[group])return Promise.resolve(window.ELM_MODULES[group]);
    if(moduleLoads.has(group))return moduleLoads.get(group);
    const promise=new Promise((resolve,reject)=>{const script=document.createElement("script");script.src="./"+group+".js?v=1.2.2";const timer=setTimeout(()=>fail(),15000);function fail(){clearTimeout(timer);script.remove();moduleLoads.delete(group);reject(new Error("Screen module unavailable"));}script.onerror=fail;script.onload=()=>{clearTimeout(timer);if(window.ELM_MODULES?.[group])resolve(window.ELM_MODULES[group]);else fail();};document.head.appendChild(script);});moduleLoads.set(group,promise);return promise;
  }
  class ScreenBoundary extends React.Component{
    constructor(props){super(props);this.state={error:false};}
    static getDerivedStateFromError(){return {error:true};}
    componentDidCatch(){reportClientError("load_error");}
    render(){return this.state.error?React.createElement("section",{style:s.card,role:"alert"},React.createElement("p",null,"تعذّر تحميل الشاشة. تحقق من الاتصال ثم حاول مجددًا."),React.createElement(Btn,{onClick:this.props.onRetry},"إعادة المحاولة")):this.props.children;}
  }
  function lazyScreen(group,name,deps){return function DeferredScreen(props){const [attempt,setAttempt]=useState(0);const Component=useMemo(()=>React.lazy(()=>loadScreenModule(group).then(factory=>({default:factory(deps())[name]}))),[attempt]);return React.createElement(ScreenBoundary,{key:attempt,onRetry:()=>setAttempt(n=>n+1)},React.createElement(React.Suspense,{fallback:React.createElement("div",{className:"screen-skeleton",role:"status","aria-label":tr("جارِ التحميل…")},...Array.from({length:3},(_,i)=>React.createElement("div",{key:i})))},React.createElement(Component,props)));};}

  function MoreMenuScreen({ onGo, isOwner }) {
    return /* @__PURE__ */ React.createElement("div", { className: "more-screen" }, React.createElement("div",{className:"more-screen-grid",style:{display:"grid",gap:9}}, isOwner && React.createElement(NavRow,{icon:ICONS.shield,label:"مراقبة النظام",onClick:()=>onGo("securityMonitor")}), isOwner && /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.shield, label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", onClick: () => onGo("adminUsers") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.settings, label: "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0648\u0646\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", onClick: () => onGo("adminCategories") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.clock, label: "\u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", onClick: () => onGo("adminCycles") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.grid, label: "المكافآت والجوائز", onClick: () => onGo("rewardsHub") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.chart, label: "\u0646\u0634\u0627\u0637 \u0627\u0644\u0645\u0642\u064A\u0651\u0645\u064A\u0646", onClick: () => onGo("evaluatorActivity") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.clipboard, label: "\u0633\u062C\u0644 \u0627\u0644\u062A\u062F\u0642\u064A\u0642", onClick: () => onGo("auditLog") }), /* @__PURE__ */ React.createElement(NavRow, { icon: ICONS.trash, label: "\u0633\u0644\u0629 \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062A", onClick: () => onGo("trash") })));
  }
  function NavRow({ icon, label, onClick }) {
    return /* @__PURE__ */ React.createElement("button", { onClick, className:"more-row" + (icon === ICONS.trash ? " more-row-danger" : ""), style: { ...s.rowCard, color:"var(--ink)", font:"inherit" } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--forest)" } }, /* @__PURE__ */ React.createElement(Icon, { svg: icon, size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "start", fontWeight: 600, fontSize: 14 } }, label), /* @__PURE__ */ React.createElement(Icon, { svg: ICONS.back, size: 18, color: "var(--ink-3)" }));
  }
  const AdminEmployees=lazyScreen("management","AdminEmployees",()=>({Btn,EmptyState,Field,ICONS,Icon,Modal,PERMISSION_DEFS,Switch,avatarColor,emptyPerms,fmtDate,s,tr,useEffect,useRef,useState}));
  const PERMISSION_DEFS = [
    { key: "canManageEmployees", label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646", description: "\u0625\u0636\u0627\u0641\u0629\u060C \u0623\u0631\u0634\u0641\u0629\u060C \u0648\u062D\u0630\u0641 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646" },
    { key: "canCreateCycle", label: "\u0625\u062F\u0627\u0631\u0629 \u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", description: "\u0625\u0646\u0634\u0627\u0621 \u0648\u0625\u063A\u0644\u0627\u0642 \u0648\u0625\u0639\u0627\u062F\u0629 \u0641\u062A\u062D \u0627\u0644\u062F\u0648\u0631\u0627\u062A" },
    { key: "canEditCategories", label: "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0648\u0646\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u062A\u0642\u064A\u064A\u0645", description: "\u062A\u0639\u062F\u064A\u0644 \u0646\u0642\u0627\u0637 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0648\u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641\u0627\u062A \u062C\u062F\u064A\u062F\u0629" },
    { key: "canManageAllEvaluations", label: "\u0625\u062F\u0627\u0631\u0629 \u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0627\u0644\u062C\u0645\u064A\u0639", description: "\u0625\u0644\u063A\u0627\u0621 \u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0633\u062C\u0651\u0644\u0647\u0627 \u0645\u0642\u064A\u0651\u0645\u0648\u0646 \u0622\u062E\u0631\u0648\u0646" }
  ];
  function emptyPerms() {
    return { canManageEmployees: false, canCreateCycle: false, canEditCategories: false, canManageAllEvaluations: false };
  }
  const AdminUsers=lazyScreen("management","AdminUsers",()=>({Btn,EmptyState,Field,ICONS,Icon,Modal,PERMISSION_DEFS,Switch,avatarColor,emptyPerms,fmtDate,s,tr,useEffect,useRef,useState}));
  const AdminCategories=lazyScreen("management","AdminCategories",()=>({Btn,EmptyState,Field,ICONS,Icon,Modal,PERMISSION_DEFS,Switch,avatarColor,emptyPerms,fmtDate,s,tr,useEffect,useRef,useState}));
  
  const AdminCycles=lazyScreen("management","AdminCycles",()=>({Btn,EmptyState,Field,ICONS,Icon,Modal,PERMISSION_DEFS,Switch,avatarColor,emptyPerms,fmtDate,s,tr,useEffect,useRef,useState}));
  const ReportsOverall=lazyScreen("reports","ReportsOverall",()=>({Btn,EmptyState,Field,ICONS,Icon,Modal,fmtDate,fmtDateTime,locale,matches,s,tr,useEffect,useState}));
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
    const items=useMemo(()=>evaluations.filter(e=>e.is_violation&&e.status==="active")
      .sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)),[evaluations]);
    const employeeNames=useMemo(()=>new Map(employees.map(e=>[e.id,e.name])),[employees]);
    const unread=items.filter(e=>!e.violation_reviewed).length;
    const [expandedId,setExpandedId]=useState(()=>items.find(e=>!e.violation_reviewed)?.id||items[0]?.id||null);
    const [visibleCount,setVisibleCount]=useState(20);
    const [reviewingId,setReviewingId]=useState(null);
    const [pushState,setPushState]=useState('checking');
    const [pushBusy,setPushBusy]=useState(false);
    const [showPushSettings,setShowPushSettings]=useState(false);
    useEffect(()=>{
      // Keep the page in place while the inbox is open; only its list may scroll.
      const y=window.scrollY;
      const body=document.body;
      const previous={position:body.style.position,top:body.style.top,left:body.style.left,right:body.style.right,width:body.style.width};
      body.style.position='fixed';
      body.style.top=`-${y}px`;
      body.style.left='0';
      body.style.right='0';
      body.style.width='100%';
      const onKeyDown=event=>{if(event.key==='Escape')onClose();};
      document.addEventListener('keydown',onKeyDown);
      return()=>{
        document.removeEventListener('keydown',onKeyDown);
        Object.assign(body.style,previous);
        window.scrollTo(0,y);
      };
    },[]);
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
        h("div",{className:"notification-list"},items.length?items.slice(0,visibleCount).map(e=>{
          const empName=employeeNames.get(e.employee_id)||"موظف غير موجود";
          const open=expandedId===e.id;
          return h("article",{key:e.id,className:`notification-item ${e.violation_reviewed?"reviewed":"unread"}`},
            h("button",{type:"button",className:"notification-summary",onClick:()=>setExpandedId(open?null:e.id),"aria-expanded":open,"aria-controls":`notification-detail-${e.id}`},
              h("span",{className:"notification-item-top"},h("strong",null,empName),h("time",null,relTime(e.created_at))),
              h("span",{className:"notification-category"},h("b",null,e.category_name||"مخالفة غير مصنّفة"),h("small",null,e.violation_reviewed?"تمت المراجعة":"تحتاج مراجعة")),
              h("span",{className:"notification-preview"},e.note?.trim()||"لا يوجد وصف للمخالفة")),
            open&&h("div",{className:"notification-detail",id:`notification-detail-${e.id}`},
              h("span",{className:"notification-detail-label"},"سبب تسجيل المخالفة"),
              h("p",null,e.note?.trim()||"لم يكتب المقيم وصفًا لهذه المخالفة."),
              h("div",{className:"notification-meta"},h("span",null,"المقيم: ",e.evaluator_name||"—"),h("time",null,fmtDateTime(e.created_at))),
              !e.violation_reviewed&&h("button",{type:"button",className:"notification-review",disabled:reviewingId===e.id,onClick:()=>review(e.id)},reviewingId===e.id?"جارٍ الحفظ…":"تحديد كمراجَعة")));
        }):h("div",{className:"notification-empty"},"لا توجد مخالفات مسجلة."),items.length>visibleCount&&h("button",{type:"button",className:"notification-more",onClick:()=>setVisibleCount(count=>count+20)},`عرض المزيد (${items.length-visibleCount})`))));
  }
  const AuditLogScreen=lazyScreen("records","AuditLogScreen",()=>({Btn,EmptyState,ICONS,Icon,Modal,fmtDate,fmtDateTime,s,supabase,useEffect,useState}));
  const TrashScreen=lazyScreen("records","TrashScreen",()=>({Btn,EmptyState,ICONS,Icon,Modal,fmtDate,fmtDateTime,s,supabase,useEffect,useState}));
  const EvaluatorActivityScreen=lazyScreen("reports","EvaluatorActivityScreen",()=>({Btn,EmptyState,Field,ICONS,Icon,Modal,fmtDate,fmtDateTime,locale,matches,s,tr,useEffect,useState}));
  const s = {
    topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "6px 8px 6px 14px", background: "var(--glass)", backdropFilter: "blur(22px) saturate(165%)", WebkitBackdropFilter: "blur(22px) saturate(165%)", position: "fixed", top: "calc(14px + env(safe-area-inset-top, 0px))", left: 10, right: 10, maxWidth: 460, margin: "0 auto", zIndex: 9, border: "1px solid var(--glass-border)", borderRadius: 22, boxShadow: "0 10px 30px rgba(33,30,24,.1), inset 0 1px rgba(255,255,255,.85)" },
    body: { padding: "18px 16px 44px", paddingTop: "var(--topbar-space, 0px)" },
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
  window.__elmReactMounted=true;
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(AppErrorBoundary, null, React.createElement(React.Fragment,null,React.createElement(OfflineBanner),React.createElement(App, null))));
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