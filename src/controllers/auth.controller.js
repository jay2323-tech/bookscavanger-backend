import { supabaseAdmin } from "../config/supabase.js";

/**
 * 📚 Librarian Signup Controller
 * Handles Auth creation, Profile triggering, and Library table insertion.
 */
export async function signupLibrary(req, res) {
  const { name, email, password, latitude, longitude } = req.body;

  // 1. Validation: Ensure required fields are present
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: "Missing required fields: name, email, and password are required." 
    });
  }

  try {
    // 2. Create Auth User - This fires the handle_new_user() trigger automatically
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        role: "librarian", 
        name: name // Used by the trigger to populate public.profiles.name
      }
    });

    // Enhanced Error Handling: Specifically catches SQL trigger crashes or metadata issues
    if (authError) {
      console.error("Auth/Trigger Error:", authError.message);
      return res.status(400).json({ 
        error: "Database configuration error. Check your SQL trigger columns and RLS.",
        details: authError.message 
      });
    }

    const userId = authData.user.id;

    // 3. Insert into libraries table - Using your verified column names
    const { error: dbError } = await supabaseAdmin
      .from("libraries")
      .insert([{
        name,
        email,
        latitude: latitude || null,
        longitude: longitude || null,
        supabase_user_id: userId, // Match for verified column name
        approved: false           // Librarian starts as pending
      }]);

    if (dbError) {
      console.error("Library Table Error:", dbError.message);
      
      // 🔁 Atomic Rollback: Delete the auth user if the library record fails.
      // This prevents "User already exists" errors on retry.
      await supabaseAdmin.auth.admin.deleteUser(userId);
      
      return res.status(400).json({ 
        error: "Failed to create library record. Auth user rolled back.",
        details: dbError.message 
      });
    }

    // 4. Success Response
    return res.status(201).json({ 
      message: "Librarian registered successfully. Awaiting admin approval.", 
      userId: userId 
    });

  } catch (err) {
    console.error("Catch Block Error:", err.message);
    return res.status(500).json({ 
      error: "An unexpected server error occurred during signup.",
      details: err.message 
    });
  }
}