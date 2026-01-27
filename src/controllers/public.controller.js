import { supabase } from "../config/db.js";
import { calculateDistance } from "../utils/distance.js";

export async function searchBooks(req, res) {
  const { q, lat, lng } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    /* 🔍 Search books */
    const { data, error } = await supabase
      .from("books")
      .select("*, libraries(name, latitude, longitude)")
      .or(`title.ilike.%${q}%,author.ilike.%${q}%,isbn.ilike.%${q}%`);

    if (error) return res.status(500).json({ error: error.message });

    /* 📊 Track search analytics */
    await supabase.from("analytics").insert({
      event_type: "search",
      metadata: { query: q }
    });

    /* 📍 Add distance calculation */
    const booksWithDistance = data.map(book => {
      const lib = book.libraries;
      const distance =
        lat && lng
          ? calculateDistance(lat, lng, lib.latitude, lib.longitude)
          : null;

      return {
        ...book,
        library_name: lib.name,
        distance
      };
    });

    /* 📐 Sort by distance */
    booksWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    res.json(booksWithDistance);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
}
