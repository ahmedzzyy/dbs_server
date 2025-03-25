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

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function authenticateRequest(request, reply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.code(401).send({ error: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return reply.code(401).send({ error: "Token not provided" });
    }

    const decodedUser = verifyToken(token);
    if (!decodedUser) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    request.user = decodedUser;
  } catch (error) {
    reply.code(401).send({ error: `Invalid Token :: ${error.message}` });
  }
}
