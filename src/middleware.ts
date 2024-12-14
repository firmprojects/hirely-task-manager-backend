import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/api/:path*',
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Allow public access to Swagger documentation and user registration
  if (request.url.includes('/api/swagger') || 
      (request.url.includes('/api/users') && request.method === 'POST')) {
    return response;
  }

  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing authorization token' }),
      { status: 401, headers: corsHeaders }
    );
  }

  return response;
}
