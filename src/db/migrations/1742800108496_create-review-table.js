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
  pgm.createTable("review", {
    review_id: { type: "serial", primaryKey: true },
    movie_id: {
      type: "integer",
      notNull: true,
      references: `"Movie"("Movie_ID")`,
      onDelete: "CASCADE",
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: `"Users"("User_ID")`,
      onDelete: "CASCADE",
    },
    rating: { type: "integer", check: "rating BETWEEN 1 AND 10" },
    comment: { type: "text" },
    review_date: {
      type: "date",
      notNull: true,
      default: pgm.func("CURRENT_DATE"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("review");
};
