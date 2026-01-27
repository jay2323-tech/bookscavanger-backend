import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

const router = express.Router();

router.get("/stats", authenticateAdmin, getAdminStats);

export default router;
