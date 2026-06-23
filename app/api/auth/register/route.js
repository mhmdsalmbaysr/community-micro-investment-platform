import { NextResponse } from 'next/server';
export async function POST(req) {
  const { name, email, role } = await req.json().catch(() => ({}));
  return NextResponse.json({
    data: { id: 'u_' + Date.now(), name, email, role: role || 'investor' },
    message: 'تم التسجيل (محاكاة)',
  }, { status: 201 });
}
