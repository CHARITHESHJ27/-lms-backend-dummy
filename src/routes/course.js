import express from "express";
import { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, assignCourse } from "../controllers/courseController.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get("/", authMiddleware, getCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get("/:id", authMiddleware, getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create new course (ADMIN only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             title: "Node.js Fundamentals"
 *             description: "Learn backend development with Node.js"
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post("/", authMiddleware, authorizeRoles("ADMIN"), createCourse);

/**
 * @swagger
 * /api/courses/assign:
 *   post:
 *     summary: Assign course to user (E003 - Course Assignment)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               courseId:
 *                 type: integer
 *           example:
 *             userId: 2
 *             courseId: 1
 *     responses:
 *       200:
 *         description: Course assigned successfully
 */
router.post("/assign", authMiddleware, authorizeRoles("ADMIN"), assignCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update course (ADMIN only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
router.put("/:id", authMiddleware, authorizeRoles("ADMIN"), updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course (ADMIN only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 */
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), deleteCourse);

export default router;