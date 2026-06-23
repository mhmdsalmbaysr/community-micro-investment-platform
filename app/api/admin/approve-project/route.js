import { NextResponse } from 'next/server';
export async function POST(req) {
  const { projectId } = await req.json().catch(() => ({}));
  return NextResponse.json({ data: { projectId, status: 'open' }, message: 'تم اعتماد المشروع ونشره (محاكاة)' });
}
