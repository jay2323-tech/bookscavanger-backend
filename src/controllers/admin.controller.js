import { supabase } from "../config/db.js";

export const getAdminStats = async (req, res) => {
  try {
    const [{ count: libraries }, { count: books }] = await Promise.all([
      supabase.from("libraries").select("*", { count: "exact", head: true }),
      supabase.from("books").select("*", { count: "exact", head: true }),
    ]);

    res.json({
      totalLibraries: libraries,
      totalBooks: books,
      platform: "Lexoria",
      status: "healthy",
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};
