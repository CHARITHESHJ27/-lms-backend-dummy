import prisma from "./src/prismaClient.js";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const userCount = await prisma.user.count();
    console.log(`Database connected! Found ${userCount} users.`);
    
    const users = await prisma.user.findMany();
    console.log("Users in database:", users);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();