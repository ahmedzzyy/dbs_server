import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // "max": 10 // Default hi 10 hai
});

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1"); // Testing ke liye
    console.log("Server : 🟢 PostgreSQL Connected!");
  } catch (error) {
    console.error("Server : 🔴 PostgreSQL Connection Error");
    console.error(error.message);
    process.exit(1);
  }
};

export const closeDB = async () => {
  console.log("Server : 🔴 Closing PostgreSQL pool...");
  await pool.end();
  console.log("Server : 🟢 PostgreSQL pool closed.");
};

export default pool;
