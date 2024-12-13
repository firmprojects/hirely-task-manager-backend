import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cors } from '@/lib/cors';

// GET /api/tasks/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(params.id) },
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
