export type ApiError = { error?: { code?: string; message?: string; details?: Record<string, unknown> } };
function csrfToken() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|; )egvox_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}
async function refreshSession() {
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
  const send = () => fetch(`/api/v1/${path.replace(/^\//,'')}`, {
    ...init, method, headers, credentials: 'same-origin', cache: 'no-store',
  });
  let response = await send();
  if (response.status === 401 && await refreshSession()) {
    if (!['GET','HEAD','OPTIONS'].includes(method)) headers.set('x-egvox-csrf', csrfToken());
    response = await send();
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = (payload as ApiError).error?.message || (payload as {detail?:string}).detail || 'Request failed';
    throw new Error(error);
  }
  return payload as T;
}
export async function egvoxAuth(action: string, body?: Record<string, unknown>) {
  const response = await fetch(`/api/auth/${action}`, {
    method: 'POST', credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...(csrfToken() ? { 'x-egvox-csrf': csrfToken() } : {}) },
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || 'Authentication failed');
  return data;
}
