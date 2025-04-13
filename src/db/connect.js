import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // "max": 10 // Default hi 10 hai
});

/**
 * Connect to the PostgreSQL Database
 * @param {import("fastify").FastifyInstance} fastify - Fastify Instance
 */
export const connectDB = async (fastify) => {
  try {
    await pool.query("SELECT 1"); // Testing ke liye
    fastify.log.info("🟢 PostgreSQL Connected!");
  } catch (error) {
    fastify.log.error({ err: error }, "🔴 PostgreSQL Connection Error");
    process.exit(1);
  }
};

/**
 * Disconnect from the PostgreSQL Database
 * @param {import("fastify").FastifyInstance} fastify - Fastify Instance
 */
export const closeDB = async (fastify) => {
  fastify.log.info("🟡 Closing PostgreSQL pool...");
  try {
    await pool.end();
    fastify.log.info("🟢 PostgreSQL pool closed.");
  } catch (error) {
    fastify.log.error({ err: error }, "🔴 Error closing PostgreSQL pool");
  }
};

export default pool;
