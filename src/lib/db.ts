import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL || "";
  
  if (!connectionString) {
    console.warn("DATABASE_URL not set. Database operations will fail.");
    // Return a client that will fail on operations - but won't crash on import
    return new PrismaClient();
  }

  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  const pool = new pg.Pool({ 
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter }) as unknown as PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
