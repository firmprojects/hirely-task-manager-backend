import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/firebase';

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

// GET /api/tasks/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const decodedToken = await verifyAuth(request);
  if (!decodedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const task = await prisma.task.findFirst({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const decodedToken = await verifyAuth(request);
  if (!decodedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, description, status } = body;

    const task = await prisma.task.findFirst({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        description,
        status,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const decodedToken = await verifyAuth(request);
  if (!decodedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const task = await prisma.task.findFirst({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: 'Task deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

// OPTIONS /api/tasks/[id]
export async function OPTIONS() {
  return NextResponse.json({});
}
