import { supabase } from "../config/supabase.js";

export const authenticateAdmin = async (req, res, next) => {
  // ✅ allow CORS preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

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

    if (data.user.user_metadata?.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    req.admin = data.user;
    next();
  } catch (err) {
    console.error("authenticateAdmin:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};
