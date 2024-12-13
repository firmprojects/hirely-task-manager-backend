import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createUser } from '@/lib/firebase';
import { cors } from '@/lib/cors';

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, name } = body;

    if (!id || !email) {
      return cors(
        NextResponse.json(
          { error: 'ID and email are required' },
          { status: 400 }
        )
      );
    }

    // Use the createUser function from firebase.ts
    const user = await createUser(id, email, name);

    return cors(
      NextResponse.json(user, { status: 201 })
    );
  } catch (error) {
    console.error('Create user error:', error);
    if ((error as any).code === 'P2002') {
      return cors(
        NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        )
      );
    }
    return cors(
      NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return cors(
    new NextResponse(null, {
      status: 200,
    })
  );
}
