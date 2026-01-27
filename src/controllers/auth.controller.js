import crypto from "crypto";
import { supabase } from "../config/db.js";

export async function signupLibrary(req, res) {
  const { name, email, password, latitude, longitude } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const userId = authData.user.id;

    const { error: dbError } = await supabase.from("libraries").insert([
      {
        name,
        email,
        latitude,
        longitude,
        supabase_user_id: userId,
        api_key: crypto.randomUUID(),
      },
    ]);

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.json({ message: "Library registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
}

export async function loginLibrary(req, res) {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    // 📊 Track login analytics
    await supabase.from("analytics").insert({
      event_type: "login",
      metadata: { email },
    }).then().catch(console.error);

    res.json({ session: data.session, user: data.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
}
