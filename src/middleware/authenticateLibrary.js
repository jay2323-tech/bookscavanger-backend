import { supabase } from "../config/supabase.js";

export async function authenticateLibrary(req, res, next) {
  try {
    // Allow CORS preflight
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "This endpoint requires a valid Bearer token",
      });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error: "Invalid or expired session",
      });
    }

    if (data.user.user_metadata?.role !== "librarian") {
      return res.status(403).json({
        error: "Librarian access only",
      });
    }

    const { data: library, error: libError } = await supabase
      .from("libraries")
      .select("id, approved") //
      .eq("supabase_user_id", data.user.id)
      .single();

    if (libError || !library) {
      return res.status(404).json({
        error: "Library record not found",
      });
    }

    if (!library.approved) {
      return res.status(403).json({
        error: "Library not approved yet",
      });
    }

    req.user = data.user;
    req.library = library;

    next();
  } catch (err) {
    console.error("❌ authenticateLibrary error:", err.message);
    res.status(500).json({ error: "Authentication failed" });
  }
}
