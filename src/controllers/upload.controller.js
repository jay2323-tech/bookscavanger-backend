import XLSX from "xlsx";
import { supabaseAdmin } from "../config/db.js";

export async function uploadBooksExcel(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const books = data.map(row => ({
      title: row.title,
      author: row.author || null,
      isbn: row.isbn || null,
      library_id: req.library.id,
      available: true
    }));

    const { error } = await supabaseAdmin.from("books").insert(books);
    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Books uploaded successfully", count: books.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Excel upload failed" });
  }
}
