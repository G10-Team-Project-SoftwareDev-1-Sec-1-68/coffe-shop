import { verifyToken } from "@/lib/jwt";

/**
 * Extract Bearer token from Authorization header.
 * @param {Request} request
 * @returns {string | null}
 */
export function getBearerToken(request) {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

/**
 * Get JWT from Authorization header or auth-token cookie (for browser clients).
 * @param {Request} request
 * @returns {string | null}
 */
export function getJwtFromRequest(request) {
  const bearer = getBearerToken(request);
  if (bearer) return bearer;
  return request.cookies.get("auth-token")?.value ?? null;
}

/**
 * Verify JWT from request and return decoded payload, or null if invalid/missing.
 * @param {Request} request
 * @returns {{ sub: string, email: string, role: string } | null}
 */
export function verifyJwtFromRequest(request) {
  const token = getJwtFromRequest(request);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
