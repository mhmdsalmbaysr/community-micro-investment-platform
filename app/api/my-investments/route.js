import { NextResponse } from 'next/server';
// Demo: investments live in client localStorage; this returns an empty server list.
export async function GET() {
  return NextResponse.json({ data: [], note: 'الاستثمارات التجريبية تُخزَّن في المتصفح (localStorage)' });
}
