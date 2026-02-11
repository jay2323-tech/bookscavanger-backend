import { supabaseAdmin } from "../config/supabase.js";

export const authenticateAdmin = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.replace("Bearer ", "");

    // 1️⃣ Validate token
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = data.user.id;

    // 2️⃣ Check role from PROFILES table (single source of truth)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: "Profile not found" });
    }

    if (profile.role !== "admin") {
      return res.status(403).json({ error: "Admins only" });
    }

    req.admin = data.user;
    next();
  } catch (err) {
    console.error("authenticateAdmin:", err);
    return res.status(500).json({ error: "Authentication failed" });
  }
};
