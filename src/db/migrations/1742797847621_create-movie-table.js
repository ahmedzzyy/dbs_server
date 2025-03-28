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
  pgm.createTable("movie", {
    movie_id: { type: "serial", primaryKey: true },
    title: { type: "varchar(255)", notNull: true },
    genre: { type: "varchar(255)" },
    director: { type: "varchar(255)" },
    release_year: { type: "integer" },
    language: { type: "varchar(255)" },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("movie");
};
