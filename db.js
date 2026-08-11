require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

const connectDB = async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Database connected!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

connectDB();

module.exports = pool;