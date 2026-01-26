import { supabase } from "../config/db.js";

export const authenticateLibrary = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { data: library } = await supabase
      .from("libraries")
      .select("*")
      .eq("supabase_user_id", data.user.id)
      .single();

    if (!library) {
      return res.status(403).json({ error: "Library not registered" });
    }

    req.library = library;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
