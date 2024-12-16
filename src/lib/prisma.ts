import { PrismaClient } from '@prisma/client';

// Log environment variable status
console.log('Environment variables status:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
console.log('Current DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Add retry logic for database operations
export async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.message.includes('terminating connection')) {
        console.log(`Retry attempt ${i + 1} of ${maxRetries} after connection error`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        continue;
      }
      throw error; // If it's not a connection error, throw immediately
    }
  }
  throw lastError;
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
