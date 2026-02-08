import { supabase } from "../config/supabase.js";

export const authenticateLibrary = async (req, res, next) => {
  // ✅ Allow CORS preflight
  if (req.method === "OPTIONS") return res.sendStatus(204);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 🚫 BLOCK pending librarians
    if (data.user.user_metadata?.role !== "librarian") {
      return res.status(403).json({ error: "Librarian approval pending" });
    }

    // ✅ Fetch approved library
    const { data: library, error: libError } = await supabase
      .from("libraries")
      .select("*")
      .eq("supabase_user_id", data.user.id)
      .eq("approved", true)
      .single();

    if (libError || !library) {
      return res.status(403).json({ error: "Library not approved" });
    }

    req.user = data.user;
    req.library = library;
    next();
  } catch (err) {
    console.error("authenticateLibrary:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
};
