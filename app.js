require("dotenv").config();
const express = require("express");
const pool = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
    res.send("Welcome to Student Management API");
});
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;

// GET - All students
app.get("/students", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// GET - One student by ID
app.get("/students/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "SELECT * FROM students WHERE id = $1",
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// POST - Add student
app.post("/students", async (req, res) => {
    try {
        const { name, roll, email } = req.body;

        const result = await pool.query(
            "INSERT INTO students (name, roll, email) VALUES ($1, $2, $3) RETURNING *",
            [name, roll, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// PUT - Update student
app.put("/students/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, roll, email } = req.body;

        const result = await pool.query(
            "UPDATE students SET name = $1, roll = $2, email = $3 WHERE id = $4 RETURNING *",
            [name, roll, email, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "DATABASE ERROR" });
    }
});


// DELETE - Delete student
app.delete("/students/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "DELETE FROM students WHERE id = $1 RETURNING *",
            [id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "DATABASE ERROR" });
    }
});
// 404 - Route not found
        app.use((req, res) => {
            res.status(404).json({
                error: "Route not found"
    });
});


// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});