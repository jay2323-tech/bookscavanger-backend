import { supabase } from "../config/db.js";

export const authenticateLibrary = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      console.error("Supabase auth error:", error);
      return res.status(401).json({ error: "Invalid token" });
    }

    const { data: library, error: libError } = await supabase
      .from("libraries")
      .select("*")
      .eq("supabase_user_id", data.user.id)
      .single();

    if (libError || !library) {
      console.error("Library lookup failed:", libError);
      return res.status(403).json({ error: "Library not registered" });
    }

    req.library = library;
    next();
  } catch (err) {
    console.error("Auth middleware crash:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
