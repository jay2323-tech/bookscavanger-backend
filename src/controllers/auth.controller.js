import { supabaseAdmin } from "../config/supabase.js";

export async function signupLibrary(req, res) {
  // 🔍 TEMP DEBUG LOG (REMOVE AFTER CONFIRMING)
  console.log("📦 Signup request body:", req.body);

  const { name, email, password, latitude, longitude } = req.body;

  // 🛑 Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Missing required fields: name, email, and password are required.",
    });
  }

  try {
    // 1️⃣ Create Auth User (fires trigger)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "librarian",
        name,
      },
    });

    if (error) throw error;

    const userId = data.user.id;

    // 2️⃣ Insert Library record
    const { error: libError } = await supabaseAdmin
      .from("libraries")
      .insert({
        supabase_user_id: userId,
        name,
        email,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        approved: false,
      });

    // 3️⃣ Rollback if library insert fails
    if (libError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw libError;
    }

    // ✅ Success
    return res.status(201).json({
      message: "Librarian registered. Awaiting approval.",
    });
  } catch (err) {
    console.error("❌ Librarian signup error:", err.message);

    return res.status(500).json({
      error: "Signup failed",
      details: err.message,
    });
  }
}
