import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cors } from '@/lib/cors';

// GET /api/tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
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
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, status } = body;

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
        status: status || 'PENDING',
      },
    });

    return cors(
      NextResponse.json(task, { status: 201 })
    );
  } catch (error) {
    return cors(
      NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    );
  }
}
