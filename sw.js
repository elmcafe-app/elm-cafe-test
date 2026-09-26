// Push only. The app still requires a network connection to load its code and data.
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
