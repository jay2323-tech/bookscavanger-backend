import fs from "fs";
import XLSX from "xlsx";
import { supabase } from "../config/db.js";

/**
 * Upload books from Excel
 */
export const uploadBooksFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const books = XLSX.utils.sheet_to_json(sheet);

    if (!books.length) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: "Excel file is empty" });
    }

    const libraryId = req.library.id;

    const formatted = books.map((b) => ({
      title: b.title || b.Title,
      author: b.author || b.Author || null,
      isbn: b.isbn || b.ISBN || null,
      library_id: libraryId,
      available: true,
    }));

    const { error } = await supabase.from("books").insert(formatted);

    fs.unlinkSync(filePath);

    if (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }

    // 📊 Track upload analytics
    await supabase.from("analytics").insert({
      event_type: "upload",
      library_id: libraryId,
      metadata: { count: formatted.length },
    }).then().catch(console.error);

    res.json({
      message: "Books uploaded successfully!",
      count: formatted.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

/**
 * Get books of logged-in library
 */
export const getMyBooks = async (req, res) => {
  try {
    const libraryId = req.library.id;

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("library_id", libraryId)
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};
