import cors from "cors";

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
