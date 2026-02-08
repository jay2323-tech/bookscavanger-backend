import { supabase } from "../config/db.js";

/* ============================
   SIGNUP (LIBRARIAN ONLY)
   ============================ */
export async function signupLibrary(req, res) {
  const { name, email, password, latitude, longitude } = req.body;

  try {
    // 1️⃣ Create Supabase user with librarian role
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "librarian", // 🔐 role stored in user_metadata
          name,
        },
      },
    });

    if (error || !data?.user) {
      return res.status(400).json({ error: error?.message || "Signup failed" });
    }

    // 2️⃣ Create library record
    const { error: dbError } = await supabase.from("libraries").insert({
      name,
      email,
      latitude,
      longitude,
      supabase_user_id: data.user.id,
    });

    if (dbError) {
      console.error("Library insert error:", dbError);
      return res.status(400).json({ error: dbError.message });
    }

    return res.json({
      message: "Library registered successfully",
    });
  } catch (err) {
    console.error("signupLibrary:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
}
