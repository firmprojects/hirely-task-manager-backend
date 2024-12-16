import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'https://hirely-taskmanager-frontend.netlify.app',
  'https://kelly-task-manager.vercel.app',
  'http://localhost:5173', // Keep this for local development
  'http://localhost:3000'  // Added for local frontend
];

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '';
  
  console.log('Received request from origin:', origin); // Add logging
  
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
      console.log('CORS headers set for origin:', origin); // Add logging
    } else {
      console.log('Origin not allowed:', origin); // Add logging
    }
    
    return response;
  }
  
  // Handle actual requests
  const response = NextResponse.next();
  
  // Only allow specific origins
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    console.log('CORS headers set for non-OPTIONS request from origin:', origin); // Add logging
  } else {
    console.log('Origin not allowed for non-OPTIONS request:', origin); // Add logging
  }
  
  return response;
}
