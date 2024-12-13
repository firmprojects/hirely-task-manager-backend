import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cors } from '@/lib/cors';

// GET /api/tasks
export async function GET(request: Request) {
  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return cors(new NextResponse(null, { status: 200 }));
  }

  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const response = NextResponse.json(tasks);
    return cors(response);
  } catch (error) {
    const response = NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
    return cors(response);
  }
}

// POST /api/tasks
export async function POST(request: Request) {
  if (request.method === 'OPTIONS') {
    return cors(new NextResponse(null, { status: 200 }));
  }

  try {
    const body = await request.json();
    const { title, description, dueDate, status } = body;

    if (!title) {
      const response = NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
      return cors(response);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING',
      },
    });

    const response = NextResponse.json(task, { status: 201 });
    return cors(response);
  } catch (error) {
    const response = NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
    return cors(response);
  }
}

// OPTIONS /api/tasks
export async function OPTIONS(request: Request) {
  return cors(new NextResponse(null, { status: 200 }));
}
