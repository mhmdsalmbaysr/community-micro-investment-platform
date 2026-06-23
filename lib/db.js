import { getPrisma } from '@/lib/prisma';
import { projects as demoProjects, getProject as getDemoProject, stats as demoStats } from '@/lib/data';

// Serialize Prisma Decimal/BigInt to plain JSON-safe values.
function ser(p) {
  return {
    id: String(p.id),
    title: p.title,
    description: p.description,
    region: p.region,
    category: p.category?.name || p.category || '—',
    status: p.status,
    riskLevel: p.riskLevel,
    targetAmount: Number(p.totalCost ?? p.targetAmount ?? 0),
    fundedAmount: Number(p.fundedAmount ?? 0),
    totalShares: Number(p.totalShares ?? 0),
    sharePrice: Number(p.sharePrice ?? 0),
  };
}

export const usingDatabase = () => !!getPrisma();

export async function listProjects() {
  const db = getPrisma();
  if (!db) return demoProjects;
  const rows = await db.project.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
  return rows.map(ser);
}

export async function findProject(id) {
  const db = getPrisma();
  if (!db) return getDemoProject(id);
  const row = await db.project.findFirst({ where: { OR: [{ slug: String(id) }, ...(/^\d+$/.test(String(id)) ? [{ id: BigInt(id) }] : [])] }, include: { category: true } });
  return row ? ser(row) : null;
}

export async function createInvestment({ projectId, investorId, shares }) {
  const db = getPrisma();
  if (!db) {
    const p = getDemoProject(projectId);
    if (!p) throw new Error('Project not found');
    return { projectId, shares, amount: shares * p.sharePrice, demo: true };
  }
  // Real path: relies on DB triggers for share-availability & funded_amount.
  const p = await db.project.findUnique({ where: { id: BigInt(projectId) } });
  if (!p) throw new Error('Project not found');
  const amount = Number(p.sharePrice) * shares;
  const inv = await db.investment.create({
    data: {
      organizationId: p.organizationId, investorId: BigInt(investorId), projectId: p.id,
      shares, sharePrice: p.sharePrice, amount, status: 'confirmed',
    },
  });
  return { id: String(inv.id), projectId, shares, amount };
}

export async function adminStats() {
  const db = getPrisma();
  if (!db) return demoStats;
  const [totalProjects, totalInvestors, funding] = await Promise.all([
    db.project.count(),
    db.user.count(),
    db.investment.aggregate({ _sum: { amount: true } }),
  ]);
  return { totalProjects, totalInvestors, totalFunding: Number(funding._sum.amount || 0), activeProjects: totalProjects };
}
