import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_EMAILS = [
  'aryanrutheswar1823@gmail.com',
  'aryanrutheswar@1823@gmail.com'
];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const cleanEmail = (email || '').trim().toLowerCase();

    const isAdmin = ADMIN_EMAILS.some(ae => ae.toLowerCase() === cleanEmail);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access denied: Email is not authorized for Admin access.' },
        { status: 403 }
      );
    }

    const code = await db.generateOtp(cleanEmail);
    return NextResponse.json({
      success: true,
      message: `Security code generated for ${cleanEmail}: ${code}`,
      code
    });
  } catch (e) {
    console.error('Request OTP error:', e);
    return NextResponse.json(
      { success: false, error: 'Failed to generate security code' },
      { status: 500 }
    );
  }
}
