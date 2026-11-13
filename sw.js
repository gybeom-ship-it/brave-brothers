// 애쉬게이트 사가 오프라인 실행 (버전 067d1cbbab)
const CACHE = "ashgate-067d1cbbab", FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // 게임 화면은 인터넷이 되면 새 버전, 안 되면 저장해 둔 것 / 글꼴·아이콘은 저장해 둔 것 먼저
  if (e.request.mode === "navigate") { e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("index.html", c)); return r; }).catch(() => caches.match("index.html"))); return; }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })));
});
