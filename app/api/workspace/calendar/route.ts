import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const timeMin = new Date().toISOString();
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=8&singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}`,
    { headers: { Authorization: token } }
  );
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const summary = String(body?.summary || 'EgvoX Project Discovery & QA Review');
  const startIso = String(body?.startIso || new Date(Date.now() + 86400000).toISOString());
  const endIso = String(body?.endIso || new Date(Date.now() + 90000000).toISOString());

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary,
        description: 'Dijadwalkan melalui EgvoX Operations Workspace.',
        start: { dateTime: startIso },
        end: { dateTime: endIso },
      }),
    }
  );
  return NextResponse.json(await res.json(), { status: res.status });
}
