import express from "express";
import { loginLibrary, signupLibrary } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupLibrary);
router.post("/login", loginLibrary);

export default router;
