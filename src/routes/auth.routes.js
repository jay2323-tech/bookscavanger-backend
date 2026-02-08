import express from "express";
import { signupLibrary } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * Librarian signup only
 * Auth (login / Google) is handled by Supabase on frontend
 */
router.post("/signup", signupLibrary);

export default router;
