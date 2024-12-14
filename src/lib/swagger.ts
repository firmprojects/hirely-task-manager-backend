import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // Path to API routes
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Hireley API Documentation',
        version: '1.0.0',
        description: 'API documentation for Hireley Task Manager',
      },
      servers: [
        {
          url: 'https://task-backend-liart.vercel.app',
          description: 'Production server',
        },
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });
  return spec;
};
