import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { cors } from '@/lib/cors';

// GET /api/tasks/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('X-User-Id');
    if (!userId) {
      return cors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    const task = await prisma.task.findFirst({
      where: { 
        id: parseInt(params.id),
        userId 
      },
    });

    if (!task) {
      return cors(
        NextResponse.json({ error: 'Task not found' }, { status: 404 })
      );
    }

    return cors(
      NextResponse.json(task)
    );
  } catch (error) {
    return cors(
      NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
    );
  }
}

// PUT /api/tasks/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('X-User-Id');
    if (!userId) {
      return cors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { 
        id: parseInt(params.id),
        userId 
      },
    });

    if (!existingTask) {
      return cors(
        NextResponse.json({ error: 'Task not found' }, { status: 404 })
      );
    }

    const body = await request.json();
    const { title, description, dueDate, status } = body;

    if (!title) {
      return cors(
        NextResponse.json({ error: 'Title is required' }, { status: 400 })
      );
    }

    const task = await prisma.task.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
      },
    });

    return cors(
      NextResponse.json(task)
    );
  } catch (error) {
    return cors(
      NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    );
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('X-User-Id');
    if (!userId) {
      return cors(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      );
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { 
        id: parseInt(params.id),
        userId 
      },
    });

    if (!existingTask) {
      return cors(
        NextResponse.json({ error: 'Task not found' }, { status: 404 })
      );
    }

    await prisma.task.delete({
      where: { id: parseInt(params.id) },
    });

    return cors(
      NextResponse.json({ message: 'Task deleted successfully' })
    );
  } catch (error) {
    return cors(
      NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
    );
  }
}
