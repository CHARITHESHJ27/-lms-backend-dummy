import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import csvParser from "fast-csv";
import prisma from "../prismaClient.js";
import { loginSchema, resetPasswordSchema } from "../validator/auth.js";

export const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  const { email, password } = result.data;
  console.log('Login attempt:', { email, password });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      // E002 - Login Failure Event
      console.log(`[E002] Login Failure - Email: ${email}, Reason: User not found, Time: ${new Date().toISOString()}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', valid);
    console.log('User mustResetPassword:', user.mustResetPassword);
    if (!valid) {
      await prisma.user.update({
        where: { email },
        data: { loginAttempts: { increment: 1 } },
      });
      // E002 - Login Failure Event
      console.log(`[E002] Login Failure - Email: ${email}, Reason: Invalid password, Time: ${new Date().toISOString()}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.mustResetPassword) {
      console.log('Returning password reset required');
      return res.status(403).json({
        message: "Password reset required on first login",
        action: "RESET_PASSWORD",
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // E001 - Login Success Event
    console.log(`[E001] Login Success - User: ${user.email}, Role: ${user.role}, Time: ${new Date().toISOString()}`);
    
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user.id
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  const { email, newPassword } = result.data;

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hash, mustResetPassword: false },
    });
    res.json({ message: "Password reset successful. Please login again." });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed", error: err.message });
  }
};

export const importCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "CSV file required" });

  const results = [];
  csvParser
    .parseFile(req.file.path, { headers: true })
    .on("error", (err) => res.status(500).json({ error: err.message }))
    .on("data", (row) => results.push(row))
    .on("end", async () => {
      try {
        const promises = results.map(async (user) => {
          const hash = await bcrypt.hash(user.password, 10);
          return prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email,
              passwordHash: hash,
              role: user.role.toUpperCase(),
              mustResetPassword: true,
            },
          });
        });

        await Promise.all(promises);
        res.json({
          message: "CSV import successful",
          imported: results.length,
        });
      } catch (err) {
        res.status(500).json({ message: "Import failed", error: err.message });
      }
    });
};

export const getDashboard = async (req, res) => {
  try {
    let data = {};
    if (req.user.role === "ADMIN") {
      data = {
        totalStudents: await prisma.user.count({
          where: { role: "STUDENT" },
        }),
        totalTutors: await prisma.user.count({
          where: { role: "TUTOR" },
        }),
      };
    } else if (req.user.role === "TUTOR") {
      data = {
        myStudents: await prisma.user.count({
          where: { tutorId: req.user.userId },
        }),
      };
    } else if (req.user.role === "STUDENT") {
      data = {
        coursesEnrolled: await prisma.enrollment.count({
          where: { studentId: req.user.userId },
        }),
      };
    }
    res.json({ role: req.user.role, dashboard: data });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch dashboard",
      error: err.message,
    });
  }
};