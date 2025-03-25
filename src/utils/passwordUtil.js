import bcrypt from "bcrypt";

const saltRounds = 10;

/**
 * Hash the provided password
 * @param {string} password - The plaintext password
 * @returns {Promise<string>} The hashed password
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plaintext password with a hashed password.
 * @param {string} plainPassword - The plaintext password
 * @param {string} hashedPassword - The hashed password
 * @returns {Promise<boolean>} Whether the password matches
 */
export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
