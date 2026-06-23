import { NextResponse } from 'next/server';
import { adminStats, usingDatabase } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await adminStats();
  return NextResponse.json({ data, source: usingDatabase() ? 'database' : 'demo' });
}
