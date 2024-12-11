import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const usersData: Prisma.UserCreateInput[] = [
  {
    id: '1',
    email: 'ginxaco@gmail.com',
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const p of usersData) {
    const user = await prisma.user.upsert({
      where: { id: p.id },
      create: p,
      update: {},
    });
    console.log(`Upserted Pet with id: ${user.id}`);
  }
  console.log(`Users added.`);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
