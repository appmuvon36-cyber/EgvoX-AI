import { NextRequest, NextResponse } from 'next/server';

const ACCESS = 'egvox_access';
const REFRESH = 'egvox_refresh';
const CSRF = 'egvox_csrf';

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase public URL/key are not configured');
  return { url: url.replace(/\/$/, ''), key };
}
function sameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === request.nextUrl.origin);
}
function validCsrf(request: NextRequest) {
  return sameOrigin(request) && request.cookies.get(CSRF)?.value &&
    request.cookies.get(CSRF)?.value === request.headers.get('x-egvox-csrf');
}
function setSession(response: NextResponse, session: any) {
  const secure = process.env.NODE_ENV === 'production';
  if (session?.access_token) response.cookies.set(ACCESS, session.access_token, {
    httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: Math.max(60, Number(session.expires_in || 3600)),
  });
  if (session?.refresh_token) response.cookies.set(REFRESH, session.refresh_token, {
    httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(CSRF, crypto.randomUUID(), {
    httpOnly: false, secure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
}
function clearSession(response: NextResponse) {
  for (const name of [ACCESS, REFRESH, CSRF]) response.cookies.set(name, '', {
    httpOnly: name !== CSRF, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 0,
  });
}
async function supabase(path: string, method: string, body?: unknown, access?: string) {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}
function failure(status: number, message: string) {
  return NextResponse.json({ error: { message } }, { status });
}

export async function GET(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  if (action === 'session') {
    const access = request.cookies.get(ACCESS)?.value;
    if (!access) return NextResponse.json({ authenticated: false });
    const { response, data } = await supabase('user', 'GET', undefined, access);
    if (!response.ok) return NextResponse.json({ authenticated: false }, { status: 200 });
    return NextResponse.json({ authenticated: true, user: { id: data.id, email: data.email }, aal: data.aal || 'aal1' });
  }
  if (action === 'mfa-list') {
    const access = request.cookies.get(ACCESS)?.value;
    if (!access) return failure(401, 'Authentication required');
    const { response, data } = await supabase('factors', 'GET', undefined, access);
    return NextResponse.json(data, { status: response.status });
  }
  return failure(404, 'Unknown auth action');
}

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
  const { action } = await context.params;
  if (!sameOrigin(request)) return failure(403, 'Cross-origin request rejected');
  if (['signout', 'update-password', 'mfa-enroll', 'mfa-challenge', 'mfa-verify', 'mfa-unenroll'].includes(action) && !validCsrf(request)) {
    return failure(403, 'CSRF validation failed');
  }
  let body: any = {};
  if (!['signout'].includes(action)) {
    try { body = await request.json(); } catch { return failure(400, 'Invalid request body'); }
  }
  const access = request.cookies.get(ACCESS)?.value;
  let result: { response: Response; data: any };
  switch (action) {
    case 'signup':
      if (typeof body.email !== 'string' || body.email.length > 254 || typeof body.password !== 'string' || body.password.length < 12 || body.password.length > 256 || body.password.length > 256 || typeof body.full_name !== 'string' || body.full_name.trim().length < 2 || body.full_name.trim().length > 120) return failure(422, 'Valid name, email and 12–256 character password are required');
      const persona = ['freelancer','vendor','enterprise'].includes(body.requested_persona) ? body.requested_persona : 'freelancer';
      result = await supabase('signup?redirect_to=' + encodeURIComponent(request.nextUrl.origin + '/verify-email?persona=' + persona), 'POST', { email: body.email, password: body.password, data: { full_name: body.full_name } });
      break;
    case 'signin':
      if (typeof body.email !== 'string' || body.email.length > 254 || typeof body.password !== 'string' || body.password.length > 256) return failure(422, 'Valid email and password are required');
      result = await supabase('token?grant_type=password', 'POST', { email: body.email, password: body.password });
      break;
    case 'refresh': {
      const refresh = request.cookies.get(REFRESH)?.value;
      if (!refresh) return failure(401, 'Refresh session is unavailable');
      result = await supabase('token?grant_type=refresh_token', 'POST', { refresh_token: refresh });
      break;
    }
    case 'signout':
      if (access) await supabase('logout?scope=global', 'POST', undefined, access);
      { const response = NextResponse.json({ ok: true }); clearSession(response); return response; }
    case 'recover':
      if (typeof body.email !== 'string' || body.email.length > 254) return failure(422, 'Valid email is required');
      result = await supabase('recover?redirect_to=' + encodeURIComponent(request.nextUrl.origin + '/verify-email'), 'POST', { email: body.email });
      break;
    case 'verify':
      if (typeof body.token_hash !== 'string' || body.token_hash.length < 20 || body.token_hash.length > 256 || !['signup', 'email', 'recovery', 'invite', 'magiclink'].includes(body.type)) return failure(422, 'Verification token and valid type are required');
      result = await supabase('verify', 'POST', { token_hash: body.token_hash, type: body.type });
      break;
    case 'update-password':
      if (!access || typeof body.password !== 'string' || body.password.length < 12) return failure(422, 'Authenticated session and 12-character password are required');
      result = await supabase('user', 'PUT', { password: body.password }, access);
      break;
    case 'mfa-enroll':
      if (!access) return failure(401, 'Authentication required');
      result = await supabase('factors', 'POST', { factor_type: 'totp', friendly_name: String(body.friendly_name || 'EgvoX authenticator').slice(0, 80) }, access);
      break;
    case 'mfa-challenge':
      if (!access || !body.factor_id) return failure(422, 'Factor ID is required');
      result = await supabase(`factors/${encodeURIComponent(body.factor_id)}/challenge`, 'POST', {}, access);
      break;
    case 'mfa-verify':
      if (!access || typeof body.factor_id !== 'string' || typeof body.challenge_id !== 'string' || typeof body.code !== 'string' || !/^\d{6}$/.test(body.code)) return failure(422, 'A factor, challenge and six-digit authenticator code are required');
      result = await supabase(`factors/${encodeURIComponent(body.factor_id)}/verify`, 'POST', { challenge_id: body.challenge_id, code: body.code }, access);
      break;
    case 'mfa-unenroll':
      if (!access || !body.factor_id) return failure(422, 'Factor ID is required');
      result = await supabase(`factors/${encodeURIComponent(body.factor_id)}`, 'DELETE', undefined, access);
      break;
    default:
      return failure(404, 'Unknown auth action');
  }
  if (!result.response.ok) {
    if (action === 'refresh' && [400, 401].includes(result.response.status)) {
      const response = failure(401, 'Session expired. Sign in again.');
      clearSession(response);
      return response;
    }
    const message = typeof result.data?.msg === 'string' ? result.data.msg :
      typeof result.data?.message === 'string' ? result.data.message : 'Authentication request failed';
    return failure(result.response.status, message);
  }
  const response = NextResponse.json({
    ok: true,
    needs_email_verification: action === 'signup' && !result.data?.access_token,
    user: result.data?.user ? { id: result.data.user.id, email: result.data.user.email } : undefined,
    factor: action === 'mfa-enroll' ? result.data : undefined,
    challenge: action === 'mfa-challenge' ? result.data : undefined,
  });
  if (result.data?.access_token) setSession(response, result.data);
  if (action === 'verify' && result.data?.access_token) setSession(response, result.data);
  return response;
}
