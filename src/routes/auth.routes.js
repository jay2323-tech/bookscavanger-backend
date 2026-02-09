import express from "express";
import { signupLibrary } from "../controllers/auth.controller.js";

const router = express.Router();

// ✅ PUBLIC — NO AUTH MIDDLEWARE
router.post("/signup", signupLibrary);

export default router;
