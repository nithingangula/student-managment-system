const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Student Management API");
});

app.get("/students", (req, res) => {
    res.send("Get All Students");
});

app.get("/students/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Student ID: ${id}`);
});

app.post("/students", (req, res) => {
    const student = req.body;
    res.send({
        message: "Student Added Successfully",
        data: student
    });
});

app.put("/students/:id", (req, res) => {
    const id = req.params.id;
    const student = req.body;

    res.send({
        message: `Student ${id} Updated Successfully`,
        data: student
    });
});

app.delete("/students/:id", (req, res) => {
    const id = req.params.id;

    res.send(`Student ${id} Deleted Successfully`);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});