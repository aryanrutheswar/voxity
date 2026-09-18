import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'aryanrutheswar1823@gmail.com';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Please provide full name, email, and password.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const role = isAdmin ? 'ADMIN' : 'USER';
    const redirectUrl = isAdmin ? '/admin' : '/dashboard';

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      token: `new-user-token-${Date.now()}`,
      redirectUrl,
      user: {
        email: cleanEmail,
        name: name.trim(),
        role
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error registering new account.' },
      { status: 500 }
    );
  }
}
