import { NextResponse } from 'next/server';
import { listProjects, usingDatabase } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await listProjects();
  return NextResponse.json({ data, source: usingDatabase() ? 'database' : 'demo' });
}
