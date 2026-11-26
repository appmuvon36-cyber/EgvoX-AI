const CACHE_NAME = 'egvox-shell-v4';
const SHELL_URLS = ['/offline.html'];

function isDevEnvironment() {
  const host = self.location.hostname || '';
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('ais-dev-')
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    isDevEnvironment()
      ? Promise.resolve()
      : caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(SHELL_URLS).catch(() => Promise.resolve());
        })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => isDevEnvironment() || key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => {
        if (isDevEnvironment()) {
          return self.registration.unregister().catch(() => false);
        }
        return true;
      })
  );
  self.clients.claim();
});

// PRD 14.1 Compliance: Never cache private API responses, auth endpoints, raw video, or _next bundles
self.addEventListener('fetch', (event) => {
  if (isDevEnvironment()) return;

  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.hostname !== self.location.hostname ||
    request.headers.get('authorization')
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
});
