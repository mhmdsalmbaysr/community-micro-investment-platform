import { NextResponse } from 'next/server';
import { findProject, usingDatabase } from '@/lib/db';
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const p = await findProject(params.id);
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: p, source: usingDatabase() ? 'database' : 'demo' });
}
