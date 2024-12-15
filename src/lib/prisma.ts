import { PrismaClient } from '@prisma/client';

// Log environment variable status
console.log('DATABASE_URL status:', process.env.DATABASE_URL ? 'Present' : 'Missing');
console.log('NODE_ENV:', process.env.NODE_ENV);

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

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
