import express from "express";
import multer from "multer";
import { login, resetPassword, importCSV, getDashboard } from "../controllers/authController.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         role:
 *           type: string
 *         userId:
 *           type: integer
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login (E001 - Login Success / E002 - Login Failure)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "admin@lms.com"
 *             password: "admin123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Password reset required
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *           example:
 *             email: "student@lms.com"
 *             newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/import-csv:
 *   post:
 *     summary: Bulk import users from CSV (ADMIN only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CSV import successful
 */
router.post("/import-csv", authMiddleware, authorizeRoles("ADMIN"), upload.single("file"), importCSV);

/**
 * @swagger
 * /api/auth/dashboard:
 *   get:
 *     summary: Get role-specific dashboard data
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get("/dashboard", authMiddleware, getDashboard);

export default router;