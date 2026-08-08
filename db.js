const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "student_management",
    password: "Nithin@123",
    port: 5434
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