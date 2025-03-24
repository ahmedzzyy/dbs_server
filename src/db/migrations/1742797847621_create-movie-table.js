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
  pgm.createTable("Movie", {
    Movie_ID: { type: "serial", primaryKey: true },
    Title: { type: "varchar(255)", notNull: true },
    Genre: { type: "varchar(255)" },
    Director: { type: "varchar(255)" },
    Release_Year: { type: "integer" },
    Language: { type: "varchar(255)" },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("Movie");
};
