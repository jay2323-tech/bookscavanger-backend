import express from "express";
import {
    getAdminStats,
    getAnalytics,
} from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

const router = express.Router();

/**
 * Admin routes
 */
router.get("/stats", authenticateAdmin, getAdminStats);
router.get("/analytics", authenticateAdmin, getAnalytics);

export default router;
