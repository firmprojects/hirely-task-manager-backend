import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hireley.vercel.app'
];

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '';
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    // Only allow specific origins
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      );
    }
    
    return response;
  }
  
  // Handle actual requests
  const response = NextResponse.next();
  
  // Only allow specific origins
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}
