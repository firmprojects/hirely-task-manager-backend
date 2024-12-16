import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase';
import { prisma, withRetry } from '@/lib/prisma';
import { headers } from 'next/headers';
import { cors } from '@/lib/cors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// GET /api/tasks
export async function GET(request: Request) {
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  try {
    console.log('Processing GET /api/tasks request');
    
    if (!authHeader) {
      console.error('Authorization header missing');
      return cors(NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      ));
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.error('Invalid authorization header format');
      return cors(NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      ));
    }

    console.log('Verifying auth token...');
    const decodedToken = await verifyAuthToken(token);
    console.log('Token verified successfully for user:', decodedToken.uid);

    console.log('Fetching tasks from database...');
    const tasks = await withRetry(() => prisma.task.findMany({
      where: {
        userId: decodedToken.uid
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        status: true,
        userId: true,
        createdAt: true,
        updatedAt: true
      }
    }));
    console.log(`Successfully retrieved ${tasks.length} tasks`);

    // Format the date before sending it back
    const formattedTasks = tasks
      .filter(task => task !== null)
      .map(task => {
        const dueDate = task.dueDate 
          ? task.dueDate.toISOString().split('T')[0] 
          : null;
        
        return {
          ...task,
          dueDate,
          // Ensure status is always set
          status: task.status || 'PENDING'
        };
      });

    console.log('Formatted tasks:', formattedTasks);
    return cors(NextResponse.json({ tasks: formattedTasks }));

  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('auth')) {
        return cors(NextResponse.json(
          { error: 'Authentication failed', details: error.message },
          { status: 401 }
        ));
      }
      if (error.message.includes('prisma')) {
        return cors(NextResponse.json(
          { error: 'Database error', details: error.message },
          { status: 500 }
        ));
      }
      return cors(NextResponse.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      ));
    }
    
    return cors(NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    ));
  }
}

// POST /api/tasks
export async function POST(request: Request) {
  const headersList = headers();
  const authHeader = headersList.get('authorization');

  try {
    console.log('Processing POST /api/tasks request');
    
    if (!authHeader) {
      console.error('Authorization header missing');
      return cors(NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      ));
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.error('Invalid authorization header format');
      return cors(NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      ));
    }

    console.log('Verifying auth token...');
    const decodedToken = await verifyAuthToken(token);
    console.log('Token verified successfully for user:', decodedToken.uid);

    const body = await request.json();
    
    if (!body.title) {
      return cors(NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      ));
    }

    console.log('Creating new task in database...');
    const task = await withRetry(() => prisma.task.create({
      data: {
        title: body.title,
        description: body.description || '',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: body.status || 'PENDING',
        userId: decodedToken.uid,
      }
    }));

    // Format the date before sending it back
    const dueDate = task.dueDate 
      ? task.dueDate.toISOString().split('T')[0] 
      : null;
    
    const formattedTask = {
      ...task,
      dueDate
    };

    console.log('Task created successfully:', task.id);
    return cors(NextResponse.json({ task: formattedTask }));

  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('auth')) {
        return cors(NextResponse.json(
          { error: 'Authentication failed', details: error.message },
          { status: 401 }
        ));
      }
      if (error.message.includes('prisma')) {
        return cors(NextResponse.json(
          { error: 'Database error', details: error.message },
          { status: 500 }
        ));
      }
      return cors(NextResponse.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      ));
    }
    
    return cors(NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    ));
  }
}

// PUT /api/tasks/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const headersList = headers();
  const authHeader = headersList.get('authorization');
  let task;
  
  try {
    console.log('Processing PUT /api/tasks request');
    
    if (!authHeader) {
      console.error('Authorization header missing');
      return cors(NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      ));
    }
    
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.error('Invalid authorization header format');
      return cors(NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      ));
    }
    
    console.log('Verifying auth token...');
    const decodedToken = await verifyAuthToken(token);
    console.log('Token verified successfully for user:', decodedToken.uid);
    
    const body = await request.json();
    
    if (!body.title) {
      return cors(NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      ));
    }
    
    const updateData = {
      title: body.title,
      description: body.description || '',
      updatedAt: new Date().toISOString()
    };

    console.log('Updating task in database...');
    task = await withRetry(() => prisma.task.update({
      where: { 
        id: parseInt(params.id), 
        userId: decodedToken.uid 
      },
      data: updateData
    }));
    console.log('Updated task:', task);

    // Format the date before sending it back
    const dueDate = task.dueDate 
      ? task.dueDate.toISOString().split('T')[0] 
      : null;
    
    const formattedTask = {
      ...task,
      dueDate
    };

    return cors(NextResponse.json({ task: formattedTask }));

  } catch (error) {
    console.error('Error in PUT /api/tasks/[id]:', error);
    
    // Handle Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return cors(NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        ));
      }
      if (error.code === 'P2002') {
        return cors(NextResponse.json(
          { error: 'Unique constraint failed' },
          { status: 409 }
        ));
      }
    }
    
    // Handle invalid ID format
    if (error instanceof Error && error.message.includes('invalid input syntax')) {
      return cors(NextResponse.json(
        { error: 'Invalid task ID format' },
        { status: 400 }
      ));
    }

    // Log unexpected errors with full details in production
    console.error('Unexpected error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return cors(NextResponse.json(
      { error: 'An unexpected error occurred while updating the task' },
      { status: 500 }
    ));
  }
}

// OPTIONS /api/tasks
export async function OPTIONS(request: Request) {
  console.log('OPTIONS /api/tasks - Request received');
  return cors(new NextResponse(null, { status: 200 }));
}
