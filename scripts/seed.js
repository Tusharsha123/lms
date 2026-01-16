const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  // Create instructor user
  let instructor = await prisma.user.findUnique({
    where: { email: "instructor@example.com" },
  });
  if (!instructor) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    instructor = await prisma.user.create({
      data: {
        email: "instructor@example.com",
        name: "Instructor One",
        role: "instructor",
        hashedPassword,
        emailVerified: new Date(),
      },
    });
    await prisma.profile.create({
      data: {
        userId: instructor.id,
        bio: "Instructor account",
        skills: "Teaching,Node.js",
      },
    });
  } else {
    // Update existing user with password and verification
    const hashedPassword = await bcrypt.hash("password123", 10);
    instructor = await prisma.user.update({
      where: { email: "instructor@example.com" },
      data: {
        hashedPassword,
        emailVerified: new Date(),
      },
    });
  }

  const existing = await prisma.course.findMany({
    where: { instructorId: instructor.id },
  });
  if (existing.length === 0) {
    await prisma.course.createMany({
      data: [
        {
          title: "Intro to JavaScript",
          description: "Learn JS basics",
          level: "beginner",
          category: "web",
          instructorId: instructor.id,
          isPublished: true,
          price: 0,
          duration: 5,
        },
        {
          title: "React for Beginners",
          description: "Build UIs with React",
          level: "beginner",
          category: "web",
          instructorId: instructor.id,
          isPublished: true,
          price: 0,
          duration: 8,
        },
      ],
    });
  }

  console.log("Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
