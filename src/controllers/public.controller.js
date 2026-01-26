import { supabase } from "../config/db.js";
import { calculateDistance } from "../utils/distance.js";

export async function searchBooks(req, res) {
  const { q, lat, lng } = req.query;

  try {
    const { data, error } = await supabase
      .from("books")
      .select("*, libraries(name, latitude, longitude)")
      .or(`title.ilike.%${q}%,author.ilike.%${q}%,isbn.ilike.%${q}%`);

    if (error) return res.status(500).json({ error: error.message });

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

    booksWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    res.json(booksWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
}
