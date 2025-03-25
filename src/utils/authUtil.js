import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generate a JWT token
 * @param {string} payload - The token payload
 * @returns {string} The signed token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

/**
 * Generate a JWT token
 * @param {string} payload - The token to verify
 * @returns {Object|null} The decoded token if valid, otherwise null.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
