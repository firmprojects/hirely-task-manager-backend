import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { cors } from '@/lib/cors';
import { auth } from '@/lib/firebase';

export const runtime = 'nodejs';

async function verifyAuth(request: NextRequest) {
  const token = request.headers.get('X-Auth-Token');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// GET /api/tasks
export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if (!decodedToken) {
      return cors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: decodedToken.uid },
      orderBy: { createdAt: 'desc' },
    });
    
    return cors(
      NextResponse.json(tasks)
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return cors(
      NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if (!decodedToken) {
      return cors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    const body = await request.json();
    const { title, description, dueDate } = body;

    if (!title) {
      return cors(
        NextResponse.json({ error: 'Title is required' }, { status: 400 })
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: decodedToken.uid,
      },
    });

    return cors(
      NextResponse.json(task)
    );
  } catch (error) {
    console.error('Error creating task:', error);
    return cors(
      NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    );
  }
}
