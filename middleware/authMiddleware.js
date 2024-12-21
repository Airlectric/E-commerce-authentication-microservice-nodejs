const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // Attach user info to request object
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

exports.hasRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied by auth" });
  }
  next();
};
