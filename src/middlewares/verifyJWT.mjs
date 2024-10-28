import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.mjs";

export const verifyJWT = (req, res, next) => {
  const authCookie = req.cookies["Auth"];
  if (!authCookie) return res.status(401).json({ error: "No autorized" });
  const token = authCookie;
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403);
    req.user = decoded.username;
    req.database = decoded.database;
    req.schema = decoded.schema;
    next();
  });
};
