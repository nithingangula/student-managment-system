require("dotenv").config();

const express = require("express");
const pool = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.send("Welcome to Student Management API - JWT Authentication Enabled");
});


// =========================
// REGISTER
// =========================

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, role",
            [username, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "Username already exists"
            });
        }

        res.status(500).json({
            error: "Database error"
        });
    }
});


// =========================
// LOGIN
// =========================

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Username and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


// =========================
// GET - ALL STUDENTS
// =========================

app.get("/students", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students");

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});


// =========================
// GET - ONE STUDENT
// =========================

app.get("/students/:id",authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            "SELECT * FROM students WHERE id = $1",
            [id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});


// =========================
// POST - ADD STUDENT
// =========================

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

        res.status(500).json({
            error: "Database error"
        });
    }
});


// =========================
// PUT - UPDATE STUDENT
// =========================

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

        res.status(500).json({
            error: "Database error"
        });
    }
});


// =========================
// DELETE - DELETE STUDENT
// =========================

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

        res.status(500).json({
            error: "Database error"
        });
    }
});


// =========================
// 404 - ROUTE NOT FOUND
// =========================

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});


// =========================
// START SERVER
// =========================

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});