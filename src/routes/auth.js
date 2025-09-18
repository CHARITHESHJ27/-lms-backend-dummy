import express from "express";
import multer from "multer";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";
import { login, resetPassword, importCSV, getDashboard } from "../controllers/authController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/login", login);

router.post("/reset-password", resetPassword);

router.post(
  "/import-csv",
  authMiddleware,
  authorizeRoles("ADMIN", "TUTOR"),
  upload.single("file"),
  importCSV
);

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("ADMIN", "TUTOR", "STUDENT"),
  getDashboard
);

export default router;
