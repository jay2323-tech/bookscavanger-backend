import { supabaseAdmin } from "../config/supabase.js";

/**
 * 📊 Admin stats
 */
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

    res.json({
      totalLibraries: libraries ?? 0,
      totalBooks: books ?? 0,
      status: "healthy",
    });
  } catch (err) {
    console.error("getAdminStats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

/**
 * 📈 Analytics
 */
export const getAnalytics = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error("getAnalytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

/**
 * ⏳ Pending librarians (SOURCE OF TRUTH = libraries table)
 */
export const getPendingLibrarians = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("libraries")
      .select(`
        id,
        name,
        email,
        latitude,
        longitude,
        supabase_user_id,
        created_at
      `)
      .eq("approved", false)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error("getPendingLibrarians:", err);
    res.status(500).json({ error: "Failed to fetch pending librarians" });
  }
};

/**
 * ✅ Approve librarian (FINAL & CORRECT)
 */
export const approveLibrarian = async (req, res) => {
  try {
    const { libraryId } = req.body;

    if (!libraryId) {
      return res.status(400).json({ error: "libraryId required" });
    }

    // 1️⃣ Fetch library
    const { data: library, error: libErr } = await supabaseAdmin
      .from("libraries")
      .select("*")
      .eq("id", libraryId)
      .single();

    if (libErr || !library) {
      return res.status(404).json({ error: "Library not found" });
    }

    // 2️⃣ Update auth user role → librarian
    if (library.supabase_user_id) {
      await supabaseAdmin.auth.admin.updateUserById(
        library.supabase_user_id,
        {
          user_metadata: { role: "librarian" },
        }
      );
    }

    // 3️⃣ Approve library
    await supabaseAdmin
      .from("libraries")
      .update({ approved: true })
      .eq("id", libraryId);

    res.json({ success: true });
  } catch (err) {
    console.error("approveLibrarian:", err);
    res.status(500).json({ error: "Approval failed" });
  }
};
