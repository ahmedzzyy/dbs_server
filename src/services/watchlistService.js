/**
 * Creates a new watchlist
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} userId - User creating the watchlist
 * @param {Object} watchlistData - Watchlist Data
 * @param {string} [watchlistData.name] - Name of the watchlist
 *
 * @returns {Promise<Object>} The created watchlist
 */
export async function createWatchlist(db, userId, { name }) {
  const query = `
      INSERT INTO watchlist (watchlist_name, user_id)
      VALUES ($1, $2)
      RETURNING watchlist_id, watchlist_name, user_id
      `;

  const values = [name, userId];
  const result = await db.query(query, values);

  return result.rows[0];
}

/**
 * Adds a existing movie to watchlist
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} watchlistId - ID of the watchlist to add to
 * @param {number|string} movieId - ID of the movie to add to the watchlist
 *
 * @returns {Promise<Object>} The created watchlist with the updated list of movies
 */
export async function addMovieToWatchlist(db, watchlistId, movieId) {
  const query = `
  INSERT INTO watchlist_movie (watchlist_id, movie_id)
  VALUES ($1, $2)
  RETURNING watchlist_id, movie_id
  `;

  const values = [watchlistId, movieId];
  await db.query(query, values);

  // Retrieve the watchlist details.
  const watchlistQuery = `
    SELECT watchlist_id, watchlist_name
    FROM watchlist
    WHERE watchlist_id = $1
  `;
  const watchlistResult = await db.query(watchlistQuery, [watchlistId]);
  if (!watchlistResult.rows.length) {
    throw new Error("Watchlist not found");
  }
  const { watchlist_id, watchlist_name } = watchlistResult.rows[0];

  // Retrieve all movies in the watchlist.
  const moviesQuery = `
    SELECT m."Movie_ID" AS movieId, m."Title", m."Genre", m."Director", m."Release_Year", m."Language"
    FROM watchlist_movie wm
    JOIN "Movie" m ON wm.movie_id = m."Movie_ID"
    WHERE wm.watchlist_id = $1
  `;
  const moviesResult = await db.query(moviesQuery, [watchlistId]);

  return {
    watchlistId: watchlist_id,
    watchlistName: watchlist_name,
    movies: moviesResult.rows,
  };
}

/**
 * Get watchlists of the user
 * @param {import("pg").Pool} db - The PostgreSQL pool
 * @param {number|string} userId - The user whose watchlist is to be fetched
 * @returns {Promise<Object>} - Watchlists as an array
 */
export async function getWatchlistsByUserID(db, userId) {
  const query = `
    SELECT watchlist_id, watchlist_name
    FROM watchlist
    WHERE user_id = $1
  `;

  const result = await db.query(query, [userId]);
  return result.rows;
}

/**
 * Delete a movie by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} watchlistId - The watchlist's ID
 * @param {number|string} movieId - The movie's ID
 * @returns {Promise<boolean>} true if movie was deleted
 */
export async function removeMovieFromWatchlist(db, watchlistId, movieId) {
  const query = `
    DELETE FROM watchlist_movie
    WHERE movie_id = $1
    AND watchlist_id = $2
    RETURNING watchlist_id, movie_id
  `;

  const result = await db.query(query, [movieId, watchlistId]);
  return result.rows.length > 0;
}
