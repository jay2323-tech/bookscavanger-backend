import express from "express";
import { authenticateLibrarianRoleOnly } from "../middleware/authenticateLibrarianRoleOnly.js";
import { createLibraryOnboarding } from "../controllers/onboarding.controller.js";

const router = express.Router();

// POST /api/library/onboarding
router.post(
    "/onboarding",
    authenticateLibrarianRoleOnly,
    createLibraryOnboarding
);

export default router;
