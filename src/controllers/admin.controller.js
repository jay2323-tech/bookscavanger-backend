import { supabaseAdmin } from "../config/supabase.js";

/**
 * 📊 Admin stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const [{ count: libraries }, { count: books }] = await Promise.all([
      supabaseAdmin.from("libraries").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("books").select("*", { count: "exact", head: true }),
    ]);

    res.json({
      totalLibraries: libraries ?? 0,
      totalBooks: books ?? 0,
      status: "healthy",
    });
  } catch (err) {
    console.error("getAdminStats error:", err);
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

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (err) {
    console.error("getAnalytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

/**
 * ⏳ Get pending librarians
 */
export const getPendingLibrarians = async (req, res) => {
  try {
    const { data, error } =
      await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000,
      });

    if (error) {
      console.error("listUsers error:", error);
      return res.status(500).json({ error: error.message });
    }

    const pending = data.users
      .filter(
        (u) => u.user_metadata?.role === "pending_librarian"
      )
      .map((u) => ({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.name || "Unknown",
        latitude: u.user_metadata?.latitude || null,
        longitude: u.user_metadata?.longitude || null,
        created_at: u.created_at,
      }));

    res.json(pending);
  } catch (err) {
    console.error("getPendingLibrarians fatal:", err);
    res.status(500).json({ error: "Failed to fetch pending librarians" });
  }
};



/**
 * ✅ Approve librarian
 */
export const approveLibrarian = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // 1️⃣ Fetch user
    const { data, error } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !data.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const meta = data.user.user_metadata;

    // 2️⃣ Update role → librarian
    const { error: updateErr } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...meta,
          role: "librarian",
        },
      });

    if (updateErr) {
      return res.status(500).json({ error: updateErr.message });
    }

    // 3️⃣ Create library record
    await supabaseAdmin.from("libraries").insert({
      name: meta.name,
      supabase_user_id: userId,
      latitude: meta.latitude,
      longitude: meta.longitude,
      approved: true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("approveLibrarian error:", err);
    res.status(500).json({ error: "Approval failed" });
  }
};
