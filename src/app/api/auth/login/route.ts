import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'aryanrutheswar1823@gmail.com';
const ADMIN_PASSWORD = 'voxityaryan';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin Authentication Check
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      if (password === ADMIN_PASSWORD) {
        return NextResponse.json({
          success: true,
          token: 'admin-session-token-voxity-2026',
          redirectUrl: '/admin',
          user: {
            email: ADMIN_EMAIL,
            name: 'Aryan Rutheswar (Admin)',
            role: 'ADMIN'
          }
        });
      } else {
        return NextResponse.json(
          { success: false, error: 'Incorrect password for admin account.' },
          { status: 401 }
        );
      }
    }

    // Standard Client User Authentication
    return NextResponse.json({
      success: true,
      token: 'client-session-token-2026',
      redirectUrl: '/dashboard',
      user: {
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'USER'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error authenticating user credentials.' },
      { status: 500 }
    );
  }
}
