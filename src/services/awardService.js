/**
 * Get awards of a movie
 * @param {import("pg").Pool} db - The PostgreSQL pool
 * @param {number|string} movieId - The movie whose awards are to be known
 * @returns {Promise<Object>} Awards of the movie as an array
 */
export async function getAwardsByMovieID(db, movieId) {
  const query = `
    SELECT a.award_id, a.year, a.award_name, a.award_category
    FROM movie_award ma
    JOIN award a ON ma.award_id = a.award_id
    WHERE ma.movie_id = $1;
  `;

  const result = await db.query(query, [movieId]);
  return result.rows;
}
