import express from "express";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, assignCourse } from "../controllers/courseController.js";

const router = express.Router();

router.get("/", authMiddleware, getCourses);
router.get("/:id", authMiddleware, getCourseById);
router.post("/", authMiddleware, authorizeRoles("ADMIN"), createCourse);
router.put("/:id", authMiddleware, authorizeRoles("ADMIN"), updateCourse);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), deleteCourse);
router.post("/assign", authMiddleware, authorizeRoles("ADMIN"), assignCourse);

export default router;