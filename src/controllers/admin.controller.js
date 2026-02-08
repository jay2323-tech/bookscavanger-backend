import { supabaseAdmin } from "../config/db.js";

export const getAdminStats = async (req, res) => {
  try {
    const [{ count: libraries }, { count: books }] = await Promise.all([
      supabaseAdmin
        .from("libraries")
        .select("*", { count: "exact", head: true }),

      supabaseAdmin
        .from("books")
        .select("*", { count: "exact", head: true }),
    ]);

    return res.json({
      totalLibraries: libraries ?? 0,
      totalBooks: books ?? 0,
      platform: "BookScavenger",
      status: "healthy",
    });
  } catch (err) {
    console.error("getAdminStats error:", err);
    return res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("getAnalytics error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error("getAnalytics fatal error:", err);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
