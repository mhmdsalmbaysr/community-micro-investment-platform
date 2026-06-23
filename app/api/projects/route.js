import { NextResponse } from 'next/server';
import { projects } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ data: projects });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const project = {
    id: 'p_' + Date.now(),
    title: body.title || 'مشروع جديد',
    targetAmount: Number(body.targetAmount) || 0,
    fundedAmount: 0,
    totalShares: Number(body.totalShares) || 100,
    status: 'pending',
  };
  // Demo only — not persisted.
  return NextResponse.json({ data: project, message: 'تم إنشاء المشروع (محاكاة) وأُرسل للمراجعة' }, { status: 201 });
}
