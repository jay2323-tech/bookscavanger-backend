import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express(); // ✅ app MUST be defined first

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lexoria-frontend-phi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({ status: "BookScavanger backend running" });
});

/* -------------------- ROUTES -------------------- */
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import libraryRoutes from "./routes/library.js";

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
