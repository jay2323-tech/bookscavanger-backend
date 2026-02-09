import cors from "cors";
import "dotenv/config";
import express from "express";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();

/* ============================
   GLOBAL MIDDLEWARE
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
   ROUTES
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/books", publicRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/admin", adminRoutes);

/* ============================
   START SERVER (IMPORTANT)
============================ */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
