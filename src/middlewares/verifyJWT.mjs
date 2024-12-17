import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.mjs";

export const verifyJWT = (req, res, next) => {
  const authToken = req.cookies["Auth"] || req.header['Authorization'];
  if (!authToken) {
    return res.status(401).json({ error: "Not autorized" });
  }
  const token = authToken;
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403);
    req.user = decoded.username;
    req.user_id = decoded.user_id
    req.database = decoded.database;
    req.schema = decoded.schema;
    next();
  });
};
