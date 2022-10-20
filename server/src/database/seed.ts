import { PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  Array.from({ length: 5 }).forEach(async () => {
    const user = await prisma.user.create({
      data: {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        userRole: UserRole.USER,
        email: faker.internet.email(),
        updatedAt: faker.date.past(),
        createdAt: faker.date.past(),
      },
    });

    console.log(user);

    const todos = await prisma.todo.createMany({
      data: [
        {
          title: 'Buy a train ticket.',
          userId: user.id,
        },
        {
          title: 'Go buy groceries.',
          userId: user.id,
        },
        {
          title: 'Go to gym.',
          userId: user.id,
        },
        {
          title: 'Drink coffee.',
          userId: user.id,
        },
      ],
    });

    console.log(todos);
  });
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
