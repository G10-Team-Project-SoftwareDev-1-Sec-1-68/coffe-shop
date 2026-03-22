import jwt from "jsonwebtoken";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production");
    }
    return "dev-only-insecure-jwt-secret";
  }
  return secret;
}

/** @param {{ sub: string, email: string, role: string }} payload */
export function signToken(payload, options = {}) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: "7d",
    ...options,
  });
}

/**
 * @param {string} token
 * @returns {{ sub: string, email: string, role: string, iat?: number, exp?: number }}
 */
export function verifyToken(token) {
  return jwt.verify(token, getSecret());
}
