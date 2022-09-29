import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@gmail.com' },
    update: {},
    create: {
      id: '74783f1d-22a1-4cb8-bb80-dff508883a23',
      name: 'John Doe',
      email: 'john@gmail.com',
      userRole: 'ADMIN',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@gmail.com' },
    update: {},
    create: {
      id: 'f3e6fd06-98d0-4fb8-91ee-2141806d038b',
      name: 'Jane Doe',
      email: 'jane@gmail.com',
    },
  });

  // create dummy todos
  const todos = await prisma.todo.createMany({
    data: [
      {
        title: 'Buy a train ticket.',
        userId: 'f3e6fd06-98d0-4fb8-91ee-2141806d038b',
      },
      {
        title: 'Go buy groceries.',
        userId: '74783f1d-22a1-4cb8-bb80-dff508883a23',
      },
      {
        title: 'Go to gym.',
        userId: '74783f1d-22a1-4cb8-bb80-dff508883a23',
      },
      {
        title: 'Drink coffee.',
        userId: '74783f1d-22a1-4cb8-bb80-dff508883a23',
      },
    ],
  });

  console.log({ user1, user2 }, { todos });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
