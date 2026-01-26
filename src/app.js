import cors from "cors";
import express from "express";
import "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import publicRoutes from "./routes/public.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/books", publicRoutes);
