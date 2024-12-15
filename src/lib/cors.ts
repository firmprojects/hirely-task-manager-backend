import { NextResponse } from 'next/server';

const allowedOrigins = [
  'https://hirely-taskmanager-frontend.netlify.app',
  'https://kelly-task-manager.vercel.app'
];

export function cors(response: NextResponse) {
  const origin = allowedOrigins[0]; // Default to first origin for now
  
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
  response.headers.set('Content-Type', 'application/json');
  
  return response;
}
