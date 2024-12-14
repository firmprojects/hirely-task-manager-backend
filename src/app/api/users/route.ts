import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
import { createUser } from '@/lib/firebase';
import prisma from '@/lib/prisma';

// POST /api/users
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, name } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: 'ID and email are required' },
        { status: 400 }
      );
    }

    try {
      // Create user in Firebase
      console.log('Creating user in Firebase...');
      const firebaseUser = await createUser(id, email, name);
      console.log('Firebase user created:', firebaseUser);

      // Create user in database
      console.log('Creating user in database...');
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
