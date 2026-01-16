const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: "instructor@example.com" },
  });
  console.log(JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

checkUser().catch(console.error);
