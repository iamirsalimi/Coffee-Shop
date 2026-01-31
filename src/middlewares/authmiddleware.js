import { verifyAccessToken } from "@/src/utils/auth";

export function authMiddleware(req, res, next) {
  // Read Authorization header
  const authHeader = req.headers.authorization;

  // expected format: "Bearer TOKEN"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = {
      id: payload.id,
    };
    
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
}
