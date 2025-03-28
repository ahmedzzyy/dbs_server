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
  pgm.createTable("cast_members", {
    movie_id: {
      type: "integer",
      notNull: true,
      references: `movie(movie_id)`,
      onDelete: "CASCADE",
    },
    actor_id: {
      type: "integer",
      notNull: true,
      references: `actor(actor_id)`,
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("cast_members", "cast_pkey", {
    primaryKey: ["movie_id", "actor_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("cast_members");
};
