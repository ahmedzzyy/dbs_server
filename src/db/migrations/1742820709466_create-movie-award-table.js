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
  pgm.createTable("movie_award", {
    movie_id: {
      type: "integer",
      notNull: true,
      references: `"Movie"("Movie_ID")`,
      onDelete: "CASCADE",
    },
    award_id: {
      type: "integer",
      notNull: true,
      references: "award(award_id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("movie_award", "movie_award_pkey", {
    primaryKey: ["movie_id", "award_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("movie_award");
};
