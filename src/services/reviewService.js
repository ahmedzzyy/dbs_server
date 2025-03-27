/**
 * Creates a new review
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} movieId - Movie being reviewed
 * @param {number|string} userId - User reviewing
 * @param {Object} reviewData - Review Data
 * @param {number} [reviewData.rating] - Rating between 1 to 10
 * @param {string} [reviewData.comment] - Comment for the review
 *
 * @returns {Promise<Object>} - The created review
 */
export async function createReview(db, userId, movieId, { rating, comment }) {
  const query = `
    INSERT INTO review (movie_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING review_id, rating, comment, movie_id
    `;

  const values = [movieId, userId, rating, comment];
  const result = await db.query(query, values);

  return result.rows[0];
}

/**
 * Deletes a review by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} movieId - ID of movie whose reviews are to be fetched
 * 
 * @returns {Promise<Object|null>} Reviews of the movie
*/
export async function getReviewsByMovieID(db, movieId) {
  const query = `
    SELECT review_id, user_id, "Users"."Username", rating, comment
    FROM review NATURAL JOIN "Users"
    WHERE movie_id = $1
  `;

  const result = await db.query(query, [movieId]);
  return result.rows || null;
}

/**
 * Deletes a review by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} userId - User reviewing
 * @param {number|string} movieId - Movie reviewed
 * @param {number|string} reviewId - The review's ID
 * @returns {Promise<boolean>} true if user was deleted
 */
export async function deleteReviewById(db, userId, movieId, reviewId) {
  const query = `
  DELETE FROM review
  WHERE review_id = $1
  AND user_id = $2
  AND movie_id = $3
  RETURNING review_id
  `;

  const result = await db.query(query, [reviewId, userId, movieId]);

  return result.rows.length > 0;
}
