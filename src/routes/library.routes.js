import express from "express";
import multer from "multer";
import { getMyBooks, uploadBooksFromExcel } from "../controllers/library.controller.js";
import { authenticateLibrary } from "../middleware/authenticateLibrary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload/books",
  authenticateLibrary,
  upload.single("file"),
  uploadBooksFromExcel
);

router.get("/my-books", authenticateLibrary, getMyBooks);

export default router;
