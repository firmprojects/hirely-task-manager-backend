import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase';

export const runtime = 'nodejs';

// GET /api/auth/token
export async function GET(request: NextRequest) {
  try {
    // For testing purposes, we'll create a token for a test user
    const uid = 'test-user-123';
    const customToken = await auth.createCustomToken(uid);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }
}
