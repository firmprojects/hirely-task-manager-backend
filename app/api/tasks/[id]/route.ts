import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
    console.log('Request body:', body);
    
    const { title, description, dueDate, status } = body;

    if (!title) {
      return cors(NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      ));
    }

    const taskId = parseInt(params.id);
    if (isNaN(taskId)) {
      return cors(NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      ));
    }

    // First check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: decodedToken.uid
      }
    });

    if (!existingTask) {
      return cors(NextResponse.json(
        { error: 'Task not found or unauthorized' },
        { status: 404 }
      ));
    }

    // Prepare update data
    const updateData: any = {
      title,
      description: description || null,
      status: status || existingTask.status,
      userId: decodedToken.uid
    };

    // Only update dueDate if it's provided
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    console.log('Updating task with data:', updateData);

    const task = await prisma.task.update({
      where: {
        id: taskId,
        userId: decodedToken.uid
      },
      data: updateData
    });

    console.log('Updated task:', task);
    return cors(NextResponse.json(task));

  } catch (error) {
    console.error('Error in PUT /api/tasks/[id]:', error);
    let errorMessage = 'Failed to update task';
    if (error instanceof PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        if (error.code === 'P2025') {
            errorMessage = 'Task not found';
        } else if (error.code === 'P2002') {
            errorMessage = 'Unique constraint failed';
        }
    }
    return cors(NextResponse.json({
        error: errorMessage,
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
    }, { status: 500 }));
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
