import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function test() {
  const companies = await prisma.company.findMany({ take: 5 });
  console.log("Companies count:", await prisma.company.count());
  console.log(companies.map(c => c.name));
  await prisma.$disconnect();
}
test();
