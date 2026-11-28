import { NextRequest, NextResponse } from 'next/server';

const ACCESS = 'egvox_access';
const REFRESH = 'egvox_refresh';
const CSRF = 'egvox_csrf';
const MEMBER_ROLES = new Set([
  'freelancer_contributor','freelancer_annotator','freelancer_qa_specialist',
  'vendor_owner','vendor_admin','vendor_project_manager','enterprise_owner','enterprise_member',
]);
const OPS_ROLES = new Set(['data_operations','qa_reviewer','platform_project_manager','super_admin']);

function redirect(request: NextRequest, path: string) {
  const url = new URL(path, request.url);
  const response = NextResponse.redirect(url);
  return response;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const login = '/login?next=' + encodeURIComponent(path + request.nextUrl.search);
  const api = process.env.EGVOX_API_URL?.replace(/\/$/, '');
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!api || !supabase || !anon) return redirect(request, login);

  let access = request.cookies.get(ACCESS)?.value;
  const refresh = request.cookies.get(REFRESH)?.value;
  if (!access) return redirect(request, login);

  const callApi = async (endpoint: string) => fetch(api + '/api/v1/' + endpoint, {
    headers: { Authorization: 'Bearer ' + access, 'X-Request-ID': crypto.randomUUID() },
    cache: 'no-store',
  });

  let response = await callApi('me');
  let nextResponse = NextResponse.next();
  if (response.status === 401 && refresh) {
    const renewed = await fetch(supabase + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: anon, 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
      cache: 'no-store',
    });
    if (renewed.ok) {
      const session = await renewed.json();
      access = session.access_token;
      const secure = process.env.NODE_ENV === 'production';
      nextResponse.cookies.set(ACCESS, session.access_token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: Math.max(60, Number(session.expires_in || 3600)) });
      if (session.refresh_token) nextResponse.cookies.set(REFRESH, session.refresh_token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
      if (!request.cookies.get(CSRF)?.value) nextResponse.cookies.set(CSRF, crypto.randomUUID(), { httpOnly: false, secure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
      response = await callApi('me');
    }
  }
  if (!response.ok) return redirect(request, login);

  if (path.startsWith('/workspace')) {
    const rolesResponse = await callApi('me/roles');
    if (!rolesResponse.ok) return redirect(request, login);
    const roles = await rolesResponse.json();
    if (!roles.items?.some((role: {id:string}) => MEMBER_ROLES.has(role.id))) {
      return redirect(request, '/onboarding/freelancer');
    }
  }

  if (path.startsWith('/admin') || path.startsWith('/ops')) {
    const [rolesResponse, sessionResponse] = await Promise.all([callApi('me/roles'), callApi('sessions')]);
    if (!rolesResponse.ok || !sessionResponse.ok) return redirect(request, login);
    const roles = await rolesResponse.json();
    const session = await sessionResponse.json();
    const roleIds = (roles.items || []).map((role: {id:string}) => role.id);
    if (path.startsWith('/admin') && !roleIds.includes('super_admin')) return redirect(request, '/login?next=%2Fadmin');
    if (path.startsWith('/ops') && !roleIds.some((id:string) => OPS_ROLES.has(id))) return redirect(request, '/login?next=%2Fops');
    if (session.aal !== 'aal2') return redirect(request, '/account/security');
  }

  return nextResponse;
}

export const config = {
  matcher: ['/workspace/:path*', '/admin/:path*', '/ops/:path*', '/account/:path*', '/onboarding/:path*'],
};
