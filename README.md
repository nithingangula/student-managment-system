# Student Management System

A simple Student Management REST API built using Node.js, Express.js, and PostgreSQL.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- JavaScript
- REST API

## Features

- Add a student
- Get all students
- Get student by ID
- Update a student
- Delete a student

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get student by ID |
| POST | `/students` | Add a student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |

## Database

Database Name:

`student_management`

Table:

`students`

Columns:

- id
- name
- roll
- email

## How to Run

```bash
npm install
node app.js