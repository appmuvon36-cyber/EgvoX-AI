function csrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|; )egvox_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
async function refreshSession(): Promise<boolean> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST', credentials: 'same-origin',
    headers: { 'content-type': 'application/json' }, body: '{}',
  });
  return response.ok;
}
export async function egvoxApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set('content-type', 'application/json');
  if (!['GET','HEAD','OPTIONS'].includes(method)) headers.set('x-egvox-csrf', csrfToken());
  const send = () => fetch('/api/v1/' + path.replace(/^\//, ''), {
    ...init, method, headers, credentials: 'same-origin', cache: 'no-store',
  });
  let response = await send();
  if (response.status === 401 && await refreshSession()) {
    if (!['GET','HEAD','OPTIONS'].includes(method)) headers.set('x-egvox-csrf', csrfToken());
    response = await send();
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || payload?.detail || 'Request failed';
    throw new Error(message);
  }
  return payload as T;
}
export async function egvoxAuth(action: string, body?: Record<string, unknown>) {
  const response = await fetch('/api/auth/' + action, {
    method: 'POST', credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...(csrfToken() ? { 'x-egvox-csrf': csrfToken() } : {}) },
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || 'Authentication failed');
  return data;
}
