import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { cors } from '@/lib/cors';

// GET /api/tasks
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-Id');
    if (!userId) {
      return cors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return cors(
      NextResponse.json(tasks)
    );
  } catch (error) {
    return cors(
      NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('X-User-Id');
    if (!userId) {
      return cors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    const body = await request.json();
    const { title, description, dueDate, status } = body;

    if (!title) {
      return cors(
        NextResponse.json({ error: 'Title is required' }, { status: 400 })
      );
    }

    // Create user if they don't exist
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: request.headers.get('X-User-Email') || '',
      },
    });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'TODO',
        userId,
      },
    });

    return cors(
      NextResponse.json(task, { status: 201 })
    );
  } catch (error) {
    console.error('Create task error:', error);
    return cors(
      NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    );
  }
}
