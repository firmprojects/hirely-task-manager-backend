import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/api/:path*',
}

export async function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  // Allow public access to Swagger documentation
  if (request.url.includes('/api/swagger')) {
    return NextResponse.next();
  }

  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing authorization token' }),
      { status: 401, headers: corsHeaders }
    );
  }

  // Pass the token to the API route for verification
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-Auth-Token', token);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
