import { supabaseAdmin } from "../config/supabase.js";

/* ============================
   UPDATED SIGNUP (LIBRARIAN)
   ============================ */
export async function signupLibrary(req, res) {
  // Destructure all needed fields from the body
  const { name, email, password, latitude, longitude } = req.body;

  // 1. Validation check
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  try {
    // 2. Create Auth User using Service Role
    // This triggers the PostgreSQL function 'handle_new_user()'
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: "librarian", // Used by your SQL enum
        name: name,        // This is what the trigger uses for the profile
      },
    });

    // If the trigger fails (e.g., column mismatch), it returns here as an error
    if (authError) {
      console.error("Trigger or Auth Error:", authError.message);
      return res.status(400).json({ 
        error: "Database configuration error. Check your SQL trigger columns.",
        details: authError.message 
      });
    }

    const userId = authData.user.id;

    // 3. Insert into libraries table (Pending Admin Approval)
    const { error: dbError } = await supabaseAdmin
      .from("libraries")
      .insert([
        {
          name,
          email,
          latitude: latitude || null,
          longitude: longitude || null,
          supabase_user_id: userId,
          approved: false // Must be approved by admin later
        }
      ]);

    if (dbError) {
      console.error("Library Table Insert Error:", dbError.message);
      
      // Cleanup: Rollback the auth user so the email isn't "taken" on retry
      await supabaseAdmin.auth.admin.deleteUser(userId);
      
      return res.status(400).json({ 
        error: "Database error saving library details.",
        details: dbError.message 
      });
    }

    // 4. Success Response
    return res.status(201).json({
      message: "Librarian registered successfully. Awaiting admin approval.",
      userId: userId,
    });

  } catch (err) {
    console.error("Fatal signup error:", err.message);
    return res.status(500).json({ error: "Internal server error during signup" });
  }
}