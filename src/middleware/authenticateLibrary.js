import { supabaseAdmin } from "../config/supabase.js";

export async function authenticateLibrary(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user)
    return res.status(401).json({ error: "Invalid session" });

  if (data.user.user_metadata?.role !== "librarian")
    return res.status(403).json({ error: "Librarian access only" });

  const { data: library } = await supabaseAdmin
    .from("libraries")
    .select("*")
    .eq("supabase_user_id", data.user.id)
    .single();

  if (!library || !library.approved)
    return res.status(403).json({ error: "Library not approved" });

  req.user = data.user;
  req.library = library;
  next();
}
