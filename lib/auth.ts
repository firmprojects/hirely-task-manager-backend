import { NextResponse } from 'next/server';
import { auth } from './firebase';

export type AuthResult = {
  userId?: string;
  error?: NextResponse;
};

export async function verifyAuth(request: Request): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        error: new NextResponse(
          JSON.stringify({ error: 'Missing or invalid authorization header' }),
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        ),
      };
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return { userId: decodedToken.uid };
    } catch (error) {
      console.error('Token verification failed:', error);
      return {
        error: new NextResponse(
          JSON.stringify({ 
            error: 'Invalid token',
            details: error instanceof Error ? error.message : 'Unknown error'
          }),
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        ),
      };
    }
  } catch (error) {
    console.error('Authentication failed:', error);
    return {
      error: new NextResponse(
        JSON.stringify({ 
          error: 'Authentication failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      ),
    };
  }
}
