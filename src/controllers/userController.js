import prisma from "../prismaClient.js";
import { getUsersSchema, userIdSchema, updateUserSchema } from "../validator/user.js";

export const getUsers = async (req, res) => {
  const result = getUsersSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  const { page = 1, limit = 10 } = result.data;
  
  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const result = userIdSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const idResult = userIdSchema.safeParse({ id: req.params.id });
  const bodyResult = updateUserSchema.safeParse(req.body);
  
  if (!idResult.success) {
    return res.status(400).json({ errors: idResult.error.errors });
  }
  if (!bodyResult.success) {
    return res.status(400).json({ errors: bodyResult.error.errors });
  }
  
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: bodyResult.data,
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const result = userIdSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }
  
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};