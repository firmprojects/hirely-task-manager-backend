import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/firebase';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { cors } from '@/lib/cors';

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
    const tasks = await prisma.task.findMany({
      where: {
        userId: decodedToken.uid
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`Successfully retrieved ${tasks.length} tasks`);

    return cors(NextResponse.json({ tasks }));

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
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || '',
        userId: decodedToken.uid,
      }
    });
    console.log('Task created successfully:', task.id);

    return cors(NextResponse.json({ task }));

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

// OPTIONS /api/tasks
export async function OPTIONS(request: Request) {
  console.log('OPTIONS /api/tasks - Request received');
  return cors(new NextResponse(null, { status: 200 }));
}