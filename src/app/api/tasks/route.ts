import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase';

export const runtime = 'nodejs';

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized: No token provided', { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Auth error:', error);
    return new Response('Unauthorized: Invalid token', { status: 401 });
  }
}

// GET /api/tasks
export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if (decodedToken instanceof Response) {
      return decodedToken;
    }

    const tasks = await prisma.task.findMany({
      where: { userId: decodedToken.uid },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyAuth(request);
    if (decodedToken instanceof Response) {
      return decodedToken;
    }

    const body = await request.json();
    const { title, description, dueDate } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!decodedToken.uid) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400 }
      );
    }

    let parsedDueDate = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid due date format' },
          { status: 400 }
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: parsedDueDate,
        userId: decodedToken.uid,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS /api/tasks
export async function OPTIONS() {
  return NextResponse.json({});
}
