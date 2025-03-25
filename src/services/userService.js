/**
 * Creates a new user
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {Object} userData - The user data { username, email, password }
 * @returns {Object} The created user
 */
export async function createUser(db, { username, email, password }) {
  const query = `
    INSERT INTO "Users" ("Username", "Password", "Email")
    VALUES ($1, $2, $3)
    RETURNING "User_ID", "Registration_Date", "Username", "Email"
    `;

  const values = [username, password, email];
  const result = await db.query(query, values);

  return result.rows[0];
}

/**
 * Find a user by email
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {string} email The user's email
 * @returns {Object|undefined} The user
 */
export async function findUserByEmail(db, email) {
  const query = `
    SELECT * FROM "Users" WHERE "Email" = $1
    `;

  const result = await db.query(query, [email]);
  return result.rows[0];
}

/**
 * Find a user by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} userId - The user's ID
 * @returns {Promise<Object|null>} The user data or null if not found
 */
export async function getUserById(db, userId) {
  const query = `
    SELECT "User_ID", "Registration_Date", "Username", "Email"
    FROM "Users"
    WHERE "User_ID" = $1
  `;
  const result = await db.query(query, [userId]);
  return result.rows[0] || null;
}

/**
 * Update a user by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} userId - The user's ID
 * @param {Object} data - The fields to update
 * @param {string} [data.username] - New username
 * @param {string} [data.email] - New email
 * @param {string} [data.password] - New username
 * @returns {Promise<Object|null>} The updated user data or null if not found
 */
export async function updateUserById(
  db,
  userId,
  { username, email, password },
) {
  const updates = [];
  const values = [];
  let idx = 1;

  if (username !== undefined) {
    updates.push(`"Username" = $${idx++}`);
    values.push(username);
  }
  if (email !== undefined) {
    updates.push(`"Email" = $${idx++}`);
    values.push(email);
  }
  if (password !== undefined) {
    updates.push(`"Password" = $${idx++}`);
    values.push(password);
  }
  if (updates.length === 0) {
    throw new Error("No valid user fields provided for updation");
  }
  values.push(userId);

  const query = `
    UPDATE "Users"
    SET ${updates.join(", ")}
    WHERE "User_ID" = $${idx}
    RETURNING "User_ID", "Registration_Date", "Username", "Email"
  `;
  const result = await db.query(query, values);
  return result.rows[0] || null;
}

/**
 * Delete a user by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} userId - The user's ID
 * @returns {Promise<boolean>} true if user was deleted
 */
export async function deleteUserById(db, userId) {
  const query = `
    DELETE FROM "Users"
    WHERE "User_ID" = $1
    RETURNING "User_ID"
  `;

  const result = await db.query(query, [userId]);
  return result.rows.length > 0;
}
