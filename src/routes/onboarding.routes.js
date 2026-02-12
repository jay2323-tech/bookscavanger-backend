import express from "express";
import { authenticateLibrarianRoleOnly } from "../middleware/authenticateLibrarianRoleOnly.js";
import { createLibraryOnboarding } from "../controllers/onboarding.controller.js";

const router = express.Router();

// 🔐 Librarian onboarding (before approval)
router.post(
    "/onboarding",
    authenticateLibrarianRoleOnly,
    createLibraryOnboarding
);

export default router;
