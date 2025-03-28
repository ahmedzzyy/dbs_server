/**
 * Get actor details
 * @param {import("pg").Pool} db - The PostgreSQL pool
 * @param {number|string} actorId - The whose details are to be known
 * @returns {Promise<Object>} Actor details
 */
export async function getActorByID(db, actorId) {
  const query = `
      SELECT actor_id, actor_name, country
      FROM "Actor"
      WHERE actor_id = $1
    `;

  const result = await db.query(query, [actorId]);
  return result.rows[0];
}

/**
 * Get actor details
 * @param {import("pg").Pool} db - The PostgreSQL pool
 * @returns {Promise<Object>} Actor details
 */
export async function getActors(db) {
  const query = `
      SELECT actor_id, actor_name, country
      FROM "Actor"
    `;

  const result = await db.query(query);
  return result.rows;
}

/**
 * Get cast of the specified movie
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} movieId - ID of movie whose cast is to be fetched
 *
 * @returns {Promise<Object|null>} Cast of the movie
 */
export async function getCastByMovieID(db, movieId) {
  const query = `
      SELECT a.actor_id, a.actor_name, a.country
      FROM "cast" JOIN "Actor" a ON "cast".actor_id = a.actor_id
      WHERE "cast".movie_id = $1
    `;

  const result = await db.query(query, [movieId]);
  return result.rows || null;
}
