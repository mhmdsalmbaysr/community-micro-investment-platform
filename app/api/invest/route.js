import { NextResponse } from 'next/server';
import { getProject } from '@/lib/data';
export async function POST(req) {
  const { projectId, shares } = await req.json().catch(() => ({}));
  const p = getProject(projectId);
  if (!p) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  const amount = (Number(shares) || 0) * p.sharePrice;
  return NextResponse.json({
    data: { projectId, shares: Number(shares), amount },
    message: 'تم تسجيل الاستثمار التجريبي (محاكاة — بدون دفع حقيقي)',
  }, { status: 201 });
}
