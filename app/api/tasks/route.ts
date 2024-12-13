import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cors } from '@/lib/cors';

// GET /api/tasks
export async function GET(request: Request) {
  try {
    // Check database connection
    await prisma.$connect();
    
    // Handle preflight request
    if (request.method === 'OPTIONS') {
      return cors(new NextResponse(null, { status: 200 }));
    }

    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const response = NextResponse.json(tasks);
    return cors(response);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch tasks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return cors(response);
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/tasks
export async function POST(request: Request) {
  try {
    await prisma.$connect();
    
    if (request.method === 'OPTIONS') {
      return cors(new NextResponse(null, { status: 200 }));
    }

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
    console.error('Error creating task:', error);
    const response = NextResponse.json(
      { error: 'Failed to create task', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
    return cors(response);
  } finally {
    await prisma.$disconnect();
  }
}

// OPTIONS /api/tasks
export async function OPTIONS(request: Request) {
  return cors(new NextResponse(null, { status: 200 }));
}
