import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ADMIN_EMAILS = [
  'aryanrutheswar1823@gmail.com',
  'aryanrutheswar@1823@gmail.com'
];

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    const cleanEmail = (email || '').trim().toLowerCase();

    const isAdmin = ADMIN_EMAILS.some(ae => ae.toLowerCase() === cleanEmail);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access denied: Email is not authorized for Admin access.' },
        { status: 403 }
      );
    }

    const isValid = await db.verifyOtp(cleanEmail, code);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired 6-digit security code' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification successful',
      token: 'admin-session-token-voxity-2026',
      user: {
        email: cleanEmail,
        name: 'Aryan Rutheswar (Admin)',
        role: 'ADMIN'
      }
    });
  } catch (e) {
    console.error('Verify OTP error:', e);
    return NextResponse.json(
      { success: false, error: 'Failed to verify security code' },
      { status: 500 }
    );
  }
}
