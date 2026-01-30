import cors from "cors";
import "dotenv/config";
import express from "express";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();

/* 🔐 CORS — MUST BE FIRST */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lexoria-frontend-phi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* Body parsing */
app.use(express.json());

/* Routes */
app.use("/api/books", publicRoutes);   // 🔥 IMPORTANT CHANGE
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/admin", adminRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "BookScavanger backend running" });
});

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
