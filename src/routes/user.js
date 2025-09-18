import express from "express";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("ADMIN"), getUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), deleteUser);

export default router;