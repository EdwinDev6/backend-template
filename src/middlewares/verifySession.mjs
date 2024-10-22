export const verifySession = (req, res, next) => {
  if (req.session.user) {
   return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
