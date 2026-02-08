import cors from "cors";
import "dotenv/config";
import express from "express";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import publicRoutes from "./routes/public.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

/* ✅ SINGLE CORS CONFIG */
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

app.get("/", (req, res) => {
  res.json({ status: "BookScavenger backend running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/books", publicRoutes);
app.use("/api/library/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
