import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = await fetch(
    'https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?maxResults=12',
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
  const title = String(body?.title || 'Upload Batch Video Egocentric');
  const notes = String(body?.notes || 'Dibuat dari EgvoX Workspace');
  const res = await fetch(
    'https://tasks.googleapis.com/tasks/v1/lists/@default/tasks',
    {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, notes }),
    }
  );
  return NextResponse.json(await res.json(), { status: res.status });
}
