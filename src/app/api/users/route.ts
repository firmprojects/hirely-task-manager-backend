import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
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

    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        name,
      },
      create: {
        id,
        email,
        name,
      },
    });

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
