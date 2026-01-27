import { supabase } from "../config/db.js";

/**
 * Get platform stats (Admin Dashboard)
 */
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

/**
 * Get recent analytics events
 */
export const getAnalytics = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
