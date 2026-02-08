import express from "express";
import multer from "multer";
import {
  getMyBooks,
  uploadBooksFromExcel,
} from "../controllers/library.controller.js";
import { authenticateLibrary } from "../middleware/authenticateLibrary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 📚 Librarian-only routes
router.get("/my-books", authenticateLibrary, getMyBooks);

router.post(
  "/upload/books",
  authenticateLibrary,
  upload.single("file"),
  uploadBooksFromExcel
);

export default router;
