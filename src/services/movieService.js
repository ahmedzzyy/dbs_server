/**
 * Creates a new movie
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {Object} movieData - The movie data
 * @param {string} [movieData.title] - Title of the movie
 * @param {string} [movieData.genre] - Genre of the movie
 * @param {string} [movieData.director] - Director of the movie
 * @param {string|number} [movieData.releaseYear] - Release year of the movie
 * @param {string} [movieData.language] - Original language of the movie
 * @returns {Promise<Object>} The created movie
 */
export async function createMovie(
  db,
  { title, genre, director, releaseYear, language },
) {
  const query = `
    INSERT INTO movie (title, genre, director, release_year, language)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING movie_id, title, genre, director, release_year, language
    `;

  const values = [title, genre, director, releaseYear, language];
  const result = await db.query(query, values);
  return result.rows[0];
}

/**
 * Find movies in a paginated format with optional filters
 * @param {import("pg").Pool} db - The PostgreSQL pool
 * @param {number} page - Page number starting from 1
 * @param {number} pageSize - Number of movies per page
 * @param {Object} options - Additional options for filtering and sorting
 * @param {string} [options.sortBy] - Field to "sort by"
 * @param {string} [options.sortDirection="ASC"] - "ASC" or "DESC"
 * @param {Object} [options.filters] - key-value pairs for filtering
 * @returns {Promise<Object>} - Movies as an array and pagination details
 */
export async function getMovies(db, page = 1, pageSize = 10, options = {}) {
  const { sortBy, sortDirection = "ASC", filters = {} } = options;

  const offset = (page - 1) * pageSize;
  const allowedColumns = new Set([
    "movie_id",
    "title",
    "genre",
    "director",
    "release_year",
    "language",
  ]);
  const filterList = [];
  const filterValues = [];
  let idx = 1;

  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      const value = filters[key];

      if (typeof value === "string") {
        filterList.push(`"${key}" ILIKE $${idx++}`);
        filterValues.push(`%${value}%`); // % regex ke liye
      } else {
        filterList.push(`"${key}" = $${idx++}`);
        filterValues.push(value);
      }
    }
  }

  const whereClause =
    filterList.length > 0 ? `WHERE ${filterList.join(" AND ")}` : "";

  let orderClause = `ORDER BY movie_id`; // by default
  if (sortBy && allowedColumns.has(sortBy)) {
    const direction = sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    orderClause = `ORDER BY "${sortBy}" ${direction} `;
  }

  const filtersOnly = [...filterValues];

  filterValues.push(pageSize, offset);
  const limitPlaceholder = `${filterValues.length - 1}`;
  const offsetPlaceholder = `${filterValues.length}`;

  const query = `
    SELECT movie_id, title, genre, director, release_year, language
    FROM movie
    ${whereClause}
    ${orderClause} 
    LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}
    `;

  const result = await db.query(query, filterValues);

  const queryToFetchCount = `
    SELECT COUNT(*) AS TOTAL FROM movie ${whereClause}
    `;

  const totalCountResult = await db.query(queryToFetchCount, filtersOnly);
  const totalCount = parseInt(totalCountResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    movies: result.rows,
    page,
    pageSize,
    totalCount,
    totalPages,
  };
}

/**
 * Find a movie by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} movieId - The movie's ID
 * @returns {Promise<Object|null>} The movie data or null if not found
 */
export async function getMovieById(db, movieId) {
  const query = `
    SELECT movie_id, title, genre, director, release_year, language
    FROM movie
    WHERE movie_id = $1
  `;
  const result = await db.query(query, [movieId]);
  return result.rows[0] || null;
}

/**
 * Get movies in a particular watchlist
 * @param {import("pg").Pool} db - The PostgreSQL pool
 * @param {number|string} watchlistId - The watchlist whose movies are to be fetched
 * @returns {Promise<Object>} - movies as an array
 */
export async function getMoviesByWatchlistID(db, watchlistId) {
  const query = `
    SELECT m.movie_id AS movieId, m.title, m.genre, m.director, m.release_year, m.language
    FROM watchlist_movie wm
    JOIN movie m ON wm.movie_id = m.movie_id
    WHERE wm.watchlist_id = $1
  `;

  const result = await db.query(query, [watchlistId]);
  return result.rows;
}

/**
 * Update a movie by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} movieId - The movie's ID
 * @param {Object} movieData - The fields to update
 * @param {string} [movieData.title] - Title of the movie
 * @param {string} [movieData.genre] - Genre of the movie
 * @param {string} [movieData.director] - Director of the movie
 * @param {string|number} [movieData.releaseYear] - Release year of the movie
 * @param {string} [movieData.language] - Original language of the movie
 * @returns {Promise<Object|null>} The updated movie data or null if not found
 */
export async function updateMovieById(
  db,
  movieId,
  { title, genre, director, releaseYear, language },
) {
  const updates = [];
  const values = [];
  let idx = 1;

  if (title !== undefined) {
    updates.push(`title = $${idx++}`);
    values.push(title);
  }
  if (genre !== undefined) {
    updates.push(`genre = $${idx++}`);
    values.push(genre);
  }
  if (director !== undefined) {
    updates.push(`director = $${idx++}`);
    values.push(director);
  }
  if (releaseYear !== undefined) {
    updates.push(`"release_year" = $${idx++}`);
    values.push(releaseYear);
  }
  if (language !== undefined) {
    updates.push(`language = $${idx++}`);
    values.push(language);
  }
  if (updates.length === 0) {
    throw new Error("No valid movie fields provided for updation");
  }
  values.push(movieId);

  const query = `
    UPDATE movie
    SET ${updates.join(", ")}
    WHERE movie_id = $${idx}
    RETURNING movie_id, title, genre, director, release_year, language
  `;
  const result = await db.query(query, values);
  return result.rows[0] || null;
}

/**
 * Delete a movie by ID
 * @param {import("pg").Pool} db - The PostgreSQL Pool
 * @param {number|string} movieId - The movie's ID
 * @returns {Promise<boolean>} true if movie was deleted
 */
export async function deleteMovieById(db, movieId) {
  const query = `
    DELETE FROM movie
    WHERE movie_id = $1
    RETURNING movie_id
  `;

  const result = await db.query(query, [movieId]);
  return result.rows.length > 0;
}
