import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const spreadsheetId = searchParams.get('spreadsheetId');
  const range = searchParams.get('range');

  if (!spreadsheetId) {
    // List spreadsheets via Drive metadata filter
    const res = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&pageSize=10&fields=files(id,name,modifiedTime,webViewLink)",
      { headers: { Authorization: token } }
    );
    return NextResponse.json(await res.json(), { status: res.status });
  }

  if (!range) {
    const metaRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties.title`,
      { headers: { Authorization: token } }
    );
    return NextResponse.json(await metaRes.json(), { status: metaRes.status });
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`,
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
  const title = String(body?.title || 'EgvoX Dataset Manifest Tracker');
  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [{ properties: { title: 'Dataset_Manifest' } }],
    }),
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
