// Prisma client singleton. Returns null if Prisma isn't generated or DATABASE_URL is unset,
// allowing the app to gracefully fall back to demo seed data.
let prisma = null;
export function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prisma) return prisma;
  try {
    // Lazy require so the build never fails when the client isn't generated.
    const { PrismaClient } = require('@prisma/client');
    prisma = globalThis.__prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;
    return prisma;
  } catch (e) {
    console.warn('[prisma] client unavailable, using demo data:', e.message);
    return null;
  }
}
