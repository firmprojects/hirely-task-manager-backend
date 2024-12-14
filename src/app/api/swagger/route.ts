import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Task Management API',
    version: '1.0.0',
    description: 'API for managing tasks',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || '/api',
      description: 'API server',
    },
  ],
  paths: {
    '/tasks': {
      get: {
        summary: 'Get all tasks',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of tasks',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Task'
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized'
          }
        }
      },
      post: {
        summary: 'Create a new task',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskInput'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Task created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task'
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized'
          },
          '400': {
            description: 'Bad request'
          }
        }
      }
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get a task by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Task details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized'
          },
          '404': {
            description: 'Task not found'
          }
        },
      },
      put: {
        summary: 'Update a task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Task updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Task',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized'
          },
          '400': {
            description: 'Bad request'
          },
          '404': {
            description: 'Task not found'
          }
        },
      },
      delete: {
        summary: 'Delete a task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Task deleted successfully',
          },
          '401': {
            description: 'Unauthorized'
          },
          '404': {
            description: 'Task not found'
          }
        },
      },
    },
    '/users': {
      post: {
        summary: 'Create a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
          },
          '409': {
            description: 'User already exists',
          },
        },
      },
      options: {
        summary: 'CORS support',
        responses: {
          '204': {
            description: 'CORS preflight request',
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            description: 'Task title'
          },
          description: {
            type: 'string',
            description: 'Task description'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Task due date'
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
            description: 'Task status'
          }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Task ID'
          },
          title: {
            type: 'string',
            description: 'Task title'
          },
          description: {
            type: 'string',
            description: 'Task description'
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
            description: 'Task due date'
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
            description: 'Task status'
          },
          userId: {
            type: 'string',
            description: 'User ID'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        required: ['id', 'email'],
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(swaggerDocument, { headers: corsHeaders });
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
