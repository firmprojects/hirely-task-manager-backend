import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to create user');
    const body = await request.json();
    console.log('Request body:', body);

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid auth token provided');
      return NextResponse.json({ error: 'No valid auth token provided' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log('Verifying Firebase token...');
    
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      console.log('Token verified, decoded:', decodedToken);
    } catch (error: any) {
      console.error('Error verifying Firebase token:', error);
      return NextResponse.json({ 
        error: 'Failed to verify Firebase token',
        details: error.message || error
      }, { status: 401 });
    }

    const { id, email, name } = body;
    console.log('Creating user with data:', { id, email, name });

    if (!id || !email) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'ID and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists in database
    console.log('Checking if user exists in database...');
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists in the database:', existingUser);
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Create user in database
    console.log('Creating new user in database...');
    try {
      const user = await prisma.user.create({
        data: {
          id,
          email,
          name
        }
      });
      console.log('User created successfully:', user);
      return NextResponse.json(user);
    } catch (error: any) {
      console.error('Error creating user in database:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        meta: error.meta
      });
      return NextResponse.json({ 
        error: 'Failed to create user in database',
        details: error.message || error
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message || error
    }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({});
}
