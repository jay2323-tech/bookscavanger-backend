import cors from "cors";
import "dotenv/config";
import express from "express";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import publicRoutes from "./routes/public.routes.js";
import uploadRoutes from "./routes/upload.routes.js"; // ✅ ADD THIS

const app = express();

/* ============================
   GLOBAL MIDDLEWARE (NO AUTH)
   ============================ */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lexoria-frontend-phi.vercel.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ============================
   HEALTH CHECK
   ============================ */
app.get("/", (_req, res) => {
  res.json({ status: "BookScavenger backend running 🚀" });
});

/* ============================
   PUBLIC ROUTES (NO AUTH)
   ============================ */
app.use("/api/auth", authRoutes);      // ✅ PUBLIC
app.use("/api/books", publicRoutes);   // ✅ PUBLIC

/* ============================
   PROTECTED ROUTES
   ============================ */
app.use("/api/library", libraryRoutes); // 🔒 librarian-only routes
app.use("/api/library", uploadRoutes);  // 🔒 upload (protected internally)
app.use("/api/admin", adminRoutes);     // 🔒 admin-only

/* ============================
   START SERVER
   ============================ */
const PORT = process.env.PORT || 8080; // Railway requirement
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
