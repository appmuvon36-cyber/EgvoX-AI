import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const listRes = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=6',
    { headers: { Authorization: token } }
  );
  const listData = await listRes.json();
  if (!listRes.ok || !Array.isArray(listData.messages)) {
    return NextResponse.json(listData, { status: listRes.status });
  }

  const details = await Promise.all(
    listData.messages.slice(0, 6).map(async (m: { id: string }) => {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
        { headers: { Authorization: token } }
      );
      const msgJson = await msgRes.json();
      const headers: Array<{ name: string; value: string }> =
        msgJson?.payload?.headers || [];
      const subject =
        headers.find((h) => h.name === 'Subject')?.value || '(Tanpa Subjek)';
      const from = headers.find((h) => h.name === 'From')?.value || 'Unknown';
      return {
        id: m.id,
        snippet: msgJson.snippet || '',
        subject,
        from,
      };
    })
  );

  return NextResponse.json({ messages: details });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const to = String(body?.to || '');
  const subject = String(body?.subject || 'EgvoX Update');
  const message = String(body?.message || '');

  const rawEmail = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    message,
  ].join('\r\n');

  const encoded = Buffer.from(rawEmail)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encoded }),
    }
  );
  return NextResponse.json(await res.json(), { status: res.status });
}
