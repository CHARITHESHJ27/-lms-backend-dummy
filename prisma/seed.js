import bcrypt from "bcryptjs";
import prisma from "../src/prismaClient.js";

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const tutorPass = await bcrypt.hash("tutor123", 10);
  const studentPass = await bcrypt.hash("student123", 10);
  const newStudentPass = await bcrypt.hash("newstudent123", 10);

  // Admin (no password reset required)
  await prisma.user.upsert({
    where: { email: "admin@lms.com" },
    update: {},
    create: {
      email: "admin@lms.com",
      passwordHash: adminPass,
      role: "ADMIN",
      mustResetPassword: false,
    },
  });

  // Tutor (must reset password on first login)
  await prisma.user.upsert({
    where: { email: "tutor@lms.com" },
    update: {},
    create: {
      email: "tutor@lms.com",
      passwordHash: tutorPass,
      role: "TUTOR",
      mustResetPassword: true,
    },
  });

  // Student (must reset password on first login)
  await prisma.user.upsert({
    where: { email: "student@lms.com" },
    update: {},
    create: {
      email: "student@lms.com",
      passwordHash: studentPass,
      role: "STUDENT",
      mustResetPassword: true,
    },
  });

  
  // New Student (must reset password on first login)
  await prisma.user.upsert({
    where: { email: "newstudent@lms.com" },
    update: {},
    create: {
      email: "newstudent@lms.com",
      passwordHash: newStudentPass,
      role: "STUDENT",
      mustResetPassword: true,
    },
  });

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming"
    }
  });

  const course2 = await prisma.course.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "React Development",
      description: "Build modern web applications with React"
    }
  });

  console.log("Seeded Admin, Tutor, Student users and sample courses");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
