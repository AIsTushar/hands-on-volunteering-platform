import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Education" },
      { name: "Environmental" },
      { name: "Healthcare" },
      { name: "Community" },
      { name: "Animal Welfare" },
    ],
  });

  console.log("Categories seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
