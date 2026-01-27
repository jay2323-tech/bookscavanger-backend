export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing admin token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (token !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ error: "Invalid admin token" });
  }

  next();
};
