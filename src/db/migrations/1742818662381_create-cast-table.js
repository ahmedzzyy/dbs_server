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
  pgm.createTable("cast", {
    movie_id: {
      type: "integer",
      notNull: true,
      references: `"Movie"("Movie_ID")`,
      onDelete: "CASCADE",
    },
    actor_id: {
      type: "integer",
      notNull: true,
      references: `"Actor"("Actor_ID")`,
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("cast", "cast_pkey", {
    primaryKey: ["movie_id", "actor_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("cast");
};
