import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth, unauthorized } from '@/middleware/auth';
import { cors } from '@/lib/cors';

// GET /api/tasks
export async function GET(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!decodedToken) {
    return cors(unauthorized());
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: decodedToken.uid
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return cors(NextResponse.json(tasks));
  } catch (error) {
    return cors(
      NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const decodedToken = await verifyAuth(request);
  if (!decodedToken) {
    return cors(unauthorized());
  }

  try {
    const body = await request.json();
    const { title, description, dueDate, status } = body;

    if (!title) {
      return cors(NextResponse.json({ error: 'Title is required' }, { status: 400 }));
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING',
        userId: decodedToken.uid
      },
    });

    return cors(NextResponse.json(task, { status: 201 }));
  } catch (error) {
    return cors(
      NextResponse.json(
        { error: 'Failed to create task' },
        { status: 500 }
      )
    );
  }
}
