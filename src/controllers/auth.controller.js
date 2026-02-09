import { supabaseAdmin } from "../config/supabase.js";

/* ============================
   SIGNUP (LIBRARIAN ONLY)
   ============================ */
export async function signupLibrary(req, res) {
  const { name, email, password, latitude, longitude } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 0️⃣ Prevent duplicate library email
    const { data: existing } = await supabaseAdmin
      .from("libraries")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: "Library already registered" });
    }

    // 1️⃣ Create Supabase user (ADMIN)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "librarian", // MUST match enum
        name,
      },
    });

    if (error || !data?.user) {
      console.error("Auth create error:", error);
      return res.status(400).json({ error: error?.message || "Signup failed" });
    }

    const userId = data.user.id;

    // 2️⃣ Create library (pending approval)
    const { error: dbError } = await supabaseAdmin
      .from("libraries")
      .insert({
        name,
        email,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        supabase_user_id: userId,
        approved: false,
      });

    if (dbError) {
      console.error("Library insert error:", dbError);

      // 🔁 Rollback auth user
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return res.status(400).json({ error: dbError.message });
    }

    return res.status(201).json({
      message: "Library registered successfully. Awaiting admin approval.",
      userId,
    });
  } catch (err) {
    console.error("signupLibrary:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
}
