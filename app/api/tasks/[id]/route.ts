import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { cors } from '@/lib/cors';
import { headers } from 'next/headers';
import { verifyAuthToken } from '@/lib/firebase';

// GET /api/tasks/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  try {
    if (!authHeader) {
      return cors(NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      ));
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return cors(NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      ));
    }

    const decodedToken = await verifyAuthToken(token);

    const task = await prisma.task.findUnique({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
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
    console.error('Error in GET /api/tasks/[id]:', error);
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
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  try {
    if (!authHeader) {
      return cors(NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      ));
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return cors(NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      ));
    }

    const decodedToken = await verifyAuthToken(token);
    const body = await request.json();
    const { title, description, dueDate, status } = body;

    if (!title) {
      return cors(
        NextResponse.json({ error: 'Title is required' }, { status: 400 })
      );
    }

    // First check if the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
      },
    });

    if (!existingTask) {
      return cors(
        NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 })
      );
    }

    const task = await prisma.task.update({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
      },
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
    console.error('Error in PUT /api/tasks/[id]:', error);
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return cors(
          NextResponse.json({ error: 'Task not found' }, { status: 404 })
        );
      }
    }
    return cors(
      NextResponse.json({ 
        error: 'Failed to update task',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    );
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  try {
    if (!authHeader) {
      return cors(NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      ));
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return cors(NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      ));
    }

    const decodedToken = await verifyAuthToken(token);

    // First check if the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
      },
    });

    if (!existingTask) {
      return cors(
        NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 })
      );
    }

    await prisma.task.delete({
      where: { 
        id: parseInt(params.id),
        userId: decodedToken.uid
      },
    });

    return cors(
      NextResponse.json({ message: 'Task deleted successfully' })
    );
  } catch (error) {
    console.error('Error in DELETE /api/tasks/[id]:', error);
    return cors(
      NextResponse.json({ 
        error: 'Failed to delete task',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    );
  }
}
