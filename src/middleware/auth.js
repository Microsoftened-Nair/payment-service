const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "payment-service-insecure-dev-secret-key-2026";

/**
 * Express middleware to authenticate payment gateway requests via JWT.
 * Note: jsonwebtoken < 9.0.0 is vulnerable to CVE-2022-23529 (key confusion).
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Missing Bearer authorization token",
    });
  }

  // Reachable invocation of vulnerable jwt.verify
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Invalid or expired authorization token",
      });
    }

    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
  JWT_SECRET,
};
