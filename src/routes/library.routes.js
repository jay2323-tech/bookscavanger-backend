import express from "express";
import multer from "multer";

import {
    getMyBooks,
    uploadBooksFromExcel,
} from "../controllers/library.controller.js";

import { authenticateLibrary } from "../middleware/authenticateLibrary.js";

const router = express.Router();

/* ============================
   FILE UPLOAD CONFIG
   ============================ */
const upload = multer({
  dest: "uploads/",  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only Excel files are allowed."), false);
    }
  },});

/* ============================
    LIBRARY PROTECTED ROUTES
   ============================ */

/**
 * Get books owned by the authenticated library
 * 🔒 Librarian only (approved)
 */
router.get("/my-books", authenticateLibrary, getMyBooks);

router.post(
  "/upload/books",
  authenticateLibrary,
  upload.single("file"),
  uploadBooksFromExcel
);


export default router;
