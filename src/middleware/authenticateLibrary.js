import { supabase } from "../config/db.js";

export const authenticateLibrary = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ VERIFY SUPABASE TOKEN
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // ✅ ROLE CHECK
    if (data.user.user_metadata?.role !== "librarian") {
      return res.status(403).json({ error: "Librarian access only" });
    }

    // ✅ FETCH LIBRARY RECORD
    const { data: library, error: libError } = await supabase
      .from("libraries")
      .select("*")
      .eq("supabase_user_id", data.user.id)
      .single();

    if (libError || !library) {
      return res.status(403).json({ error: "Library not registered" });
    }

    req.user = data.user;
    req.library = library;
    next();
  } catch (err) {
    console.error("authenticateLibrary:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
