import { NextResponse } from 'next/server';
import { createInvestment, usingDatabase } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { projectId, investorId = 1, shares } = await req.json().catch(() => ({}));
  if (!projectId || !shares) return NextResponse.json({ error: 'projectId and shares required' }, { status: 400 });
  try {
    const result = await createInvestment({ projectId, investorId, shares: Number(shares) });
    return NextResponse.json({ data: result, source: usingDatabase() ? 'database' : 'demo',
      message: usingDatabase() ? 'تم تسجيل الاستثمار' : 'تم تسجيل الاستثمار (محاكاة)' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
