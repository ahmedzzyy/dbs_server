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
  pgm.createTable("Users", {
    User_ID: { type: "serial", primaryKey: true },
    Registration_Date: {
      type: "date",
      notNull: true,
      default: pgm.func("CURRENT_DATE"),
    },
    Username: { type: "varchar(255)", unique: true, notNull: true },
    Password: { type: "varchar(255)", notNull: true },
    Email: { type: "varchar(255)", unique: true, notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("Users");
};
