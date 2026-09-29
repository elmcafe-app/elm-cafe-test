// ELM CAFE 1.2.2. Cache static assets only; never Auth/API responses or employee data.
const CACHE_PREFIX='elm-assets-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE_NAME=CACHE_PREFIX+'1.2.2';
const ASSETS=["./","./index.html","./app.js","./app.css","./i18n.js","./public-config.js","./manifest.json","./elm-cafe-logo.png","./apple-touch-icon.png","./pwa-icon-192.png","./pwa-icon-512.png","./elm-arabic-1.ttf","./elm-arabic-2.ttf","./react.js","./react-dom.js","./supabase.js","./management.js","./reports.js","./records.js"];
const ALLOWED=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).pathname));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));});
// No skipWaiting: an open session/form must not receive mixed release files.
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!ALLOWED.has(url.pathname))return;
 // Query strings carry release hints only; cache is already isolated by release and project scope.
 const key=event.request.mode==='navigate'?new URL('./index.html',self.registration.scope).href:url.origin+url.pathname;
 event.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);const cached=await cache.match(key);if(cached)return cached;const response=await fetch(event.request);if(response.ok&&response.type!=='opaque')await cache.put(key,response.clone());return response;})());
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  event.waitUntil(self.registration.showNotification('ELM CAFE', {
    body: data.body || 'لديك مخالفة تحتاج مراجعة داخل التطبيق.',
    icon: './pwa-icon-192.png', badge: './pwa-icon-192.png',
    tag: data.tag || 'elm-violation', data: { url: './' }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const url = new URL('./?notifications=1', self.registration.scope).href;
    const clientsList = await self.clients.matchAll({ type:'window', includeUncontrolled:true });
    const opened = clientsList.find(client => client.url.startsWith(self.registration.scope));
    if (opened) { await opened.focus(); opened.postMessage({ type:'OPEN_VIOLATIONS' }); return; }
    await self.clients.openWindow(url);
  })());
});
