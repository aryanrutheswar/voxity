import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body && body.email) {
      await db.addSubscriber(body.email);
    }
    return NextResponse.json({ success: true, message: 'Subscription successful', email: body.email });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
  }
}
