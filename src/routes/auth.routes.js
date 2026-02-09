import express from "express";
import { signupLibrary } from "../controllers/auth.controller.js";

const router = express.Router();

// 🚨 NO middleware here
router.post("/signup", signupLibrary);

export default router;
