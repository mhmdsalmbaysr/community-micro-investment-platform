import { NextResponse } from 'next/server';
export async function POST(req) {
  const { email } = await req.json().catch(() => ({}));
  return NextResponse.json({ data: { token: 'demo-token', email }, message: 'تم الدخول (محاكاة)' });
}
