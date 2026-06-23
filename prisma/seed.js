/* Seed baseline data. Run: node prisma/seed.js (requires DATABASE_URL). */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'cmip' }, update: {},
    create: { name: 'منصة الاستثمار المجتمعي', slug: 'cmip' },
  });
  for (const r of [['investor','مستثمر'],['project_owner','صاحب مشروع'],['platform_admin','مدير المنصة'],['finance_officer','مسؤول مالي'],['auditor','مراقب']]) {
    await prisma.role.upsert({ where: { code: r[0] }, update: {}, create: { code: r[0], name: r[1] } });
  }
  const owner = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: org.id, email: 'owner@demo.com' } },
    update: {},
    create: { organizationId: org.id, fullName: 'صاحب مشروع', email: 'owner@demo.com', passwordHash: 'x', accountStatus: 'active' },
  });
  const cat = await prisma.projectCategory.create({ data: { code: 'food', name: 'أغذية' } }).catch(() => null);
  await prisma.project.create({
    data: {
      organizationId: org.id, ownerId: owner.id, categoryId: cat?.id,
      title: 'مخبز الحي التعاوني', slug: 'bakery', region: 'الرياض',
      totalCost: 120000, totalShares: 1200, sharePrice: 100, fundedAmount: 78000, status: 'published',
    },
  });
  console.log('Seed complete.');
}
main().finally(() => prisma.$disconnect());
