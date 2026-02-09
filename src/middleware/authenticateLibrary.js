import { supabase } from "../config/supabase.js";

export const authenticateLibrary = async (req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided. Please login." });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Session expired. Please login again." });
    }

    // Check role in metadata
    const userRole = data.user.user_metadata?.role;
    if (userRole !== "librarian") {
      return res.status(403).json({ error: "Access denied. Librarian role required." });
    }

    // Fetch library and check approval
    const { data: library, error: libError } = await supabase
      .from("libraries")
      .select("*")
      .eq("supabase_user_id", data.user.id)
      .single();

    if (libError || !library) {
      return res.status(404).json({ error: "Library record not found." });
    }

    if (!library.approved) {
      return res.status(403).json({ error: "Your library account is awaiting admin approval." });
    }

    req.user = data.user;
    req.library = library;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server authentication error." });
  }
};