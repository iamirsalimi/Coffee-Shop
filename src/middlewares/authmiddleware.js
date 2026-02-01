import { verifyAccessToken } from "@/src/utils/auth";

export function authMiddleware(reqAuthorization, res, next) {
  // expected format: "Bearer TOKEN"
  if (!reqAuthorization) {
    return res.status(404).json({
      message: "Authorization header missing",
    });
  }

  const token = reqAuthorization.split(" ")[1];

  try {
    // Verify token
    const payload = verifyAccessToken(token);
    
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
      err
    });
  }
}
