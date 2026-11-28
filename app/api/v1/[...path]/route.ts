import { NextRequest, NextResponse } from 'next/server';

const ACCESS = 'egvox_access';
const CSRF = 'egvox_csrf';
function validCsrf(request: NextRequest) {
  const origin = request.headers.get('origin');
  const cookie = request.cookies.get(CSRF)?.value;
  return Boolean(origin && origin === request.nextUrl.origin && cookie && cookie === request.headers.get('x-egvox-csrf'));
}
async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const access = request.cookies.get(ACCESS)?.value;
  if (!access) return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } }, { status: 401 });
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && !validCsrf(request)) {
    return NextResponse.json({ error: { code: 'CSRF_FAILED', message: 'CSRF validation failed' } }, { status: 403 });
  }
  const base = process.env.EGVOX_API_URL?.replace(/\/$/, '');
  if (!base) return NextResponse.json({ error: { code: 'API_NOT_CONFIGURED', message: 'EgvoX API URL is not configured' } }, { status: 503 });
  const target = `${base}/api/v1/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  headers.set('authorization', `Bearer ${access}`);
  headers.set('x-request-id', request.headers.get('x-request-id') || crypto.randomUUID());
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer();
  try {
    const upstream = await fetch(target, { method: request.method, headers, body, cache: 'no-store' });
    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get('content-type');
    if (upstreamType) responseHeaders.set('content-type', upstreamType);
    const requestId = upstream.headers.get('x-request-id');
    if (requestId) responseHeaders.set('x-request-id', requestId);
    return new NextResponse(await upstream.arrayBuffer(), { status: upstream.status, headers: responseHeaders });
  } catch {
    return NextResponse.json({ error: { code: 'API_UNAVAILABLE', message: 'EgvoX API is unavailable' } }, { status: 502 });
  }
}
export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
