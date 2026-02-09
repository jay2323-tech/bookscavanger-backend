import express from "express";
import { addBook, getLibraryDashboard, } from "../controllers/library.controller.js";
import { authenticateLibrary } from "../middleware/authenticateLibrary.js";

const router = express.Router();

router.get("/dashboard", authenticateLibrary, getLibraryDashboard);
router.post("/books", authenticateLibrary, addBook);

export default router;
