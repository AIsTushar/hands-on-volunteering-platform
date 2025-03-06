import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const userId = decode.userId;
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
