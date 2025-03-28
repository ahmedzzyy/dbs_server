/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("watchlist_movie", {
    watchlist_id: {
      type: "integer",
      notNull: true,
      references: "watchList(watchlist_id)",
      onDelete: "CASCADE",
    },
    movie_id: {
      type: "integer",
      notNull: true,
      references: `movie(movie_id)`,
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("watchlist_movie", "watchlist_movie_pkey", {
    primaryKey: ["watchlist_id", "movie_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("watchlist_movie");
};
