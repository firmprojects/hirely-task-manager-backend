import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/firebase';

export async function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    
    return response;
  }

  // Skip auth for non-API routes
  if (!request.url.includes('/api/')) {
    return NextResponse.next();
  }
  
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decodedToken = await auth.verifyIdToken(token);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Id', decodedToken.uid);
    requestHeaders.set('X-User-Email', decodedToken.email || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
