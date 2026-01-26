import cors from "cors";
import express from "express";
import "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import publicRoutes from "./routes/public.routes.js";

export const app = express();

/* 🌐 CORS - allow frontend + auth headers */
app.use(
  cors({
    origin: "*", // Later replace with frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* 📦 Body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 🛣️ Routes */
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/books", publicRoutes);

/* 🧪 Health check */
app.get("/", (req, res) => {
  res.json({ status: "Lexoria Backend is running 🚀" });
});