import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.jwt; // get from cookie
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.sendStatus(401);
  }
};
export const authorizeRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return res.sendStatus(403);
  next();
};