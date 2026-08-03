import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function fix() {
  const result = await prisma.company.deleteMany({
    where: { website: 'https://example.com' }
  });
  console.log(`Deleted ${result.count} companies with example.com websites.`);
  await prisma.$disconnect();
}
fix();
