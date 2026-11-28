import { NextRequest, NextResponse } from 'next/server';

const ACCESS = 'egvox_access';
const REFRESH = 'egvox_refresh';
const CSRF = 'egvox_csrf';
const MEMBER_ROLES = new Set([
  'freelancer_contributor','freelancer_annotator','freelancer_qa_specialist',
  'vendor_owner','vendor_admin','vendor_project_manager','enterprise_owner','enterprise_member',
]);
const OPS_ROLES = new Set(['platform_sales_partnership','platform_project_manager','data_operations','qa_reviewer','finance_operator','trust_safety','compliance_officer']);

function redirect(request: NextRequest, path: string, source?: NextResponse) {
  const url = new URL(path, request.url);
  const response = NextResponse.redirect(url);
  if (source) for (const cookie of source.cookies.getAll()) response.cookies.set(cookie);
  return response;
}
function clearSession(response: NextResponse) {
  for (const name of [ACCESS, REFRESH, CSRF]) response.cookies.set(name, '', {
    httpOnly: name !== CSRF, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 0,
  });
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
    } else if ([400, 401].includes(renewed.status)) {
      clearSession(nextResponse);
    }
  }
  if (!response.ok) return redirect(request, login, nextResponse);
  const identity = await response.clone().json();

  if (path.startsWith('/workspace')) {
    const rolesResponse = await callApi('me/roles');
    if (!rolesResponse.ok) return redirect(request, login, nextResponse);
    const roles = await rolesResponse.json();
    const roleIds = (roles.items || []).map((role: {id:string}) => role.id);
    if (!roleIds.some((id:string) => MEMBER_ROLES.has(id))) {
      return redirect(request, '/onboarding/freelancer', nextResponse);
    }
    const hasFreelancer = roleIds.some((id:string) => ['freelancer_contributor','freelancer_annotator','freelancer_qa_specialist'].includes(id));
    const hasOrganization = roleIds.some((id:string) => ['vendor_owner','vendor_admin','vendor_project_manager','enterprise_owner','enterprise_member'].includes(id));
    if (hasOrganization && !hasFreelancer && !identity.profile?.active_organization_id) {
      return redirect(request, '/account/organizations', nextResponse);
    }
  }

  if (path.startsWith('/admin') || path.startsWith('/ops')) {
    const [rolesResponse, sessionResponse] = await Promise.all([callApi('me/roles'), callApi('sessions')]);
    if (!rolesResponse.ok || !sessionResponse.ok) return redirect(request, login, nextResponse);
    const roles = await rolesResponse.json();
    const session = await sessionResponse.json();
    const roleIds = (roles.items || []).map((role: {id:string}) => role.id);
    if (path.startsWith('/admin') && !roleIds.includes('super_admin')) return redirect(request, '/workspace', nextResponse);
    if (path.startsWith('/ops') && !roleIds.some((id:string) => OPS_ROLES.has(id))) return redirect(request, '/workspace', nextResponse);
    if (session.aal !== 'aal2' || session.recent_mfa !== true) return redirect(request, '/account/security', nextResponse);
  }

  return nextResponse;
}

export const config = {
  matcher: ['/workspace/:path*', '/admin/:path*', '/ops/:path*', '/account/:path*', '/onboarding/:path*'],
};
