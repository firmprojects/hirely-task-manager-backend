import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createUser } from '@/lib/firebase';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to create user');
    const body = await request.json();
    const { id, email, name } = body;
    console.log('Request body:', { id, email, name });

    if (!id || !email) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'ID and email are required' },
        { status: 400 }
      );
    }

    try {
      // Check if user already exists in Firebase
      try {
        await auth.getUser(id);
        console.log('User already exists in Firebase');
      } catch (error) {
        // If user doesn't exist, create them
        console.log('Creating user in Firebase...');
        const firebaseUser = await createUser(id, email, name);
        console.log('Firebase user created:', firebaseUser);
      }

      // Check if user already exists in database
      console.log('Checking if user exists in database...');
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        console.log('User already exists in database');
        return NextResponse.json(existingUser, { status: 200 });
      }

      // Create user in database
      console.log('Creating user in database...');
      console.log('Data to create:', { id, email, name });
      const user = await prisma.user.create({
        data: {
          id,
          email,
          name,
        },
      });
      console.log('Database user created:', user);

      return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
      console.error('Error creating user:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });

      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({});
}
