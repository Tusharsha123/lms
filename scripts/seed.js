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

  // Seed Companies
  const companyCount = await prisma.company.count();
  if (companyCount === 0) {
    console.log("Seeding companies...");
    const companies = await prisma.company.createMany({
      data: [
        {
          name: "TechCorp",
          description: "Leading technology company specializing in web and mobile development",
          website: "https://techcorp.example.com",
          logo: "https://via.placeholder.com/100",
          verified: true,
          location: "San Francisco, CA",
          industry: "Technology",
          size: "201-500",
        },
        {
          name: "DataStack",
          description: "Data analytics and business intelligence solutions provider",
          website: "https://datastack.example.com",
          logo: "https://via.placeholder.com/100",
          verified: true,
          location: "New York, NY",
          industry: "Data Science",
          size: "51-200",
        },
        {
          name: "CloudSys",
          description: "Cloud infrastructure and DevOps automation platform",
          website: "https://cloudsys.example.com",
          logo: "https://via.placeholder.com/100",
          verified: true,
          location: "Seattle, WA",
          industry: "Cloud Computing",
          size: "501-1000",
        },
      ],
    });
    console.log(`Created ${companies.count} companies`);
  }

  // Seed Internships
  const internshipCount = await prisma.internship.count();
  if (internshipCount === 0) {
    console.log("Seeding internships...");
    const allCompanies = await prisma.company.findMany();
    
    const internships = await prisma.internship.createMany({
      data: [
        {
          companyId: allCompanies[0].id,
          title: "Frontend Developer Intern",
          description: "Join our frontend team to build responsive web applications using React and modern JavaScript frameworks.",
          requirements: "- Currently pursuing a degree in Computer Science or related field\n- Proficiency in HTML, CSS, and JavaScript\n- Familiarity with React or similar frameworks\n- Strong problem-solving skills",
          responsibilities: "- Develop and maintain user interfaces\n- Collaborate with design team\n- Write clean, maintainable code\n- Participate in code reviews",
          location: "San Francisco, CA",
          locationType: "HYBRID",
          type: "FULL_TIME",
          duration: "3 months",
          stipend: "$2000/month",
          skills: JSON.stringify(["React", "JavaScript", "CSS", "HTML"]),
          status: "ACTIVE",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        },
        {
          companyId: allCompanies[1].id,
          title: "Data Analyst Intern",
          description: "Analyze datasets and create insightful dashboards to help businesses make data-driven decisions.",
          requirements: "- Strong analytical and problem-solving skills\n- Proficiency in Python and SQL\n- Experience with data visualization tools\n- Attention to detail",
          responsibilities: "- Analyze complex datasets\n- Create visualizations and reports\n- Collaborate with stakeholders\n- Present findings to team",
          location: "New York, NY",
          locationType: "ONSITE",
          type: "FULL_TIME",
          duration: "6 months",
          stipend: "$2500/month",
          skills: JSON.stringify(["Python", "SQL", "Tableau", "Data Analysis"]),
          status: "ACTIVE",
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        },
        {
          companyId: allCompanies[2].id,
          title: "Backend Engineer Intern",
          description: "Build scalable backend services for cloud infrastructure using Node.js and AWS.",
          requirements: "- Knowledge of backend development\n- Familiarity with Node.js and databases\n- Understanding of RESTful APIs\n- Interest in cloud technologies",
          responsibilities: "- Develop backend APIs\n- Optimize database queries\n- Deploy to cloud platforms\n- Write unit tests",
          location: "Remote",
          locationType: "REMOTE",
          type: "PART_TIME",
          duration: "4 months",
          stipend: "$2800/month",
          skills: JSON.stringify(["Node.js", "PostgreSQL", "AWS", "REST API"]),
          status: "ACTIVE",
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          startDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        },
      ],
    });
    console.log(`Created ${internships.count} internships`);
  }

  // Seed Mock Tests
  const testCount = await prisma.mockTest.count();
  if (testCount === 0) {
    console.log("Seeding mock tests...");
    const tests = await prisma.mockTest.createMany({
      data: [
        {
          title: "JavaScript Fundamentals",
          description: "Test your knowledge of core JavaScript concepts including variables, functions, and ES6 features.",
          category: "TECHNICAL",
          difficulty: "BEGINNER",
          duration: 30,
          totalQuestions: 10,
          passingScore: 70,
          questions: JSON.stringify([
            {
              question: "What is the output of typeof null?",
              options: ["null", "undefined", "object", "number"],
              correctAnswer: 2,
              explanation: "typeof null returns 'object' due to a long-standing bug in JavaScript."
            },
            {
              question: "Which method is used to add elements to the end of an array?",
              options: ["push()", "pop()", "shift()", "unshift()"],
              correctAnswer: 0,
              explanation: "push() adds one or more elements to the end of an array."
            },
          ]),
          tags: JSON.stringify(["JavaScript", "Programming", "Frontend"]),
          isPublished: true,
        },
        {
          title: "React Basics Assessment",
          description: "Evaluate your understanding of React fundamentals, components, hooks, and state management.",
          category: "TECHNICAL",
          difficulty: "INTERMEDIATE",
          duration: 45,
          totalQuestions: 15,
          passingScore: 70,
          questions: JSON.stringify([
            {
              question: "What hook is used to manage state in functional components?",
              options: ["useEffect", "useState", "useContext", "useReducer"],
              correctAnswer: 1,
              explanation: "useState is the primary hook for managing state in functional components."
            },
          ]),
          tags: JSON.stringify(["React", "JavaScript", "Frontend"]),
          isPublished: true,
        },
      ],
    });
    console.log(`Created ${tests.count} mock tests`);
  }

  // Seed Workshops
  const workshopCount = await prisma.workshop.count();
  if (workshopCount === 0) {
    console.log("Seeding workshops...");
    const workshops = await prisma.workshop.createMany({
      data: [
        {
          title: "Resume Writing Masterclass",
          description: "Learn how to create an ATS-friendly resume that gets you interviews. Cover formatting, keywords, and best practices.",
          instructor: "Jane Smith",
          instructorBio: "Career coach with 10+ years of experience helping tech professionals land their dream jobs.",
          category: "Career Development",
          duration: 120,
          capacity: 50,
          scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          meetingLink: "https://meet.example.com/resume-workshop",
          materials: JSON.stringify([
            { title: "Resume Template", url: "https://example.com/template.pdf" },
            { title: "Keyword Guide", url: "https://example.com/keywords.pdf" },
          ]),
          status: "SCHEDULED",
        },
        {
          title: "Interview Preparation Boot Camp",
          description: "Master technical and behavioral interviews. Practice common questions and learn effective communication strategies.",
          instructor: "John Doe",
          instructorBio: "Former FAANG interviewer turned career mentor.",
          category: "Interview Prep",
          duration: 180,
          capacity: 30,
          scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          meetingLink: "https://meet.example.com/interview-prep",
          materials: JSON.stringify([
            { title: "Common Questions", url: "https://example.com/questions.pdf" },
          ]),
          status: "SCHEDULED",
        },
      ],
    });
    console.log(`Created ${workshops.count} workshops`);
  }

  // Seed Resume Templates
  const templateCount = await prisma.resumeTemplate.count();
  if (templateCount === 0) {
    console.log("Seeding resume templates...");
    const templates = await prisma.resumeTemplate.createMany({
      data: [
        {
          name: "Modern Minimal",
          description: "Clean and professional single-column layout perfect for tech roles",
          structure: JSON.stringify({
            sections: ["header", "summary", "experience", "education", "skills", "projects"],
            style: "minimal",
            colors: { primary: "#2C3E50", secondary: "#34495E" },
          }),
          previewImage: "https://via.placeholder.com/400x600",
          category: "Technical",
          isPremium: false,
          popularity: 100,
        },
        {
          name: "Professional Classic",
          description: "Traditional two-column design with emphasis on experience",
          structure: JSON.stringify({
            sections: ["header", "summary", "experience", "education", "skills"],
            style: "classic",
            colors: { primary: "#1A1A1A", secondary: "#4A4A4A" },
          }),
          previewImage: "https://via.placeholder.com/400x600",
          category: "Business",
          isPremium: false,
          popularity: 85,
        },
        {
          name: "Creative Bold",
          description: "Eye-catching design for creative professionals and designers",
          structure: JSON.stringify({
            sections: ["header", "portfolio", "experience", "skills", "education"],
            style: "creative",
            colors: { primary: "#3498DB", secondary: "#E74C3C" },
          }),
          previewImage: "https://via.placeholder.com/400x600",
          category: "Creative",
          isPremium: true,
          popularity: 60,
        },
      ],
    });
    console.log(`Created ${templates.count} resume templates`);
  }

  console.log("Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
