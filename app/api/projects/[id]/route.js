import { NextResponse } from 'next/server';
import { getProject } from '@/lib/data';

export async function GET(_req, { params }) {
  const p = getProject(params.id);
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: p });
}
