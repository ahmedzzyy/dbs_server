import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    "user": process.env.PG_USER,
    "host": process.env.PG_HOST,
    "database": process.env.PG_DB,
    "password": process.env.PG_PASSWORD,
    "port": process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
    // "max": 10 // Default hi 10 hai
});

const connectDB = async () => {
    try {
        await pool.query("SELECT 1"); // Testing ke liye
        console.log("Server : 🟢 PostgreSQL Connected!");
    } catch (error) {
        console.error("Server : 🔴 PostgreSQL Connection Error");
        console.error(error.message);
        process.exit(1);
    }
};

const closeDB = async () => {
    console.log("Server : 🔴 Closing PostgreSQL pool...");
    await pool.end();
    console.log("Server : 🟢 PostgreSQL pool closed.");
}

export { connectDB, closeDB };