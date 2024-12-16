import { NextResponse } from 'next/server';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const allowedOrigins = [
  'https://kelly-task-manager.vercel.app',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
];

export function cors(response: NextResponse) {
  const corsOptions: CorsOptions = {
    origin: (origin: string, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('CORS: Allowing origin:', origin || 'no origin');
        callback(null, true);
      } else {
        console.log('CORS: Rejecting origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  const requestOrigin = response.headers.get('Origin') || '';
  if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin || '*');
  }
  response.headers.set('Access-Control-Allow-Credentials', corsOptions.credentials.toString());
  response.headers.set('Access-Control-Allow-Methods', Array.isArray(corsOptions.methods) ? corsOptions.methods.join(', ') : corsOptions.methods);
  response.headers.set('Access-Control-Allow-Headers', Array.isArray(corsOptions.allowedHeaders) ? corsOptions.allowedHeaders.join(', ') : corsOptions.allowedHeaders);
  response.headers.set('Content-Type', 'application/json');
  
  return response;
}
