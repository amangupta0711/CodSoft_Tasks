import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

let cachedConnectionStatus: { connected: boolean; checkedAt: number } | null = null;

export async function checkPostgresConnection(): Promise<boolean> {
  const now = Date.now();
  if (cachedConnectionStatus && now - cachedConnectionStatus.checkedAt < 5000) {
    return cachedConnectionStatus.connected;
  }

  try {
    // Quick query to test if PostgreSQL is up and responding
    await prisma.$queryRaw`SELECT 1`;
    cachedConnectionStatus = { connected: true, checkedAt: now };
    return true;
  } catch {
    cachedConnectionStatus = { connected: false, checkedAt: now };
    return false;
  }
}
