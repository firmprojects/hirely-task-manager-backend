import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase';

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return null;
    }

    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
