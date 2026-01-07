💰 Personal Expense Tracker API

A production-style REST API built using Node.js and Express to manage personal expenses with full CRUD functionality, input validation, error handling, and Swagger documentation.


🚀 Features

Create, Read, Update, Delete (CRUD) expenses

Auto-generated unique ID for each expense

Filter expenses by category

Get total of all expenses

Input validation for all fields

Proper HTTP status codes and error handling

Swagger UI for API testing and documentation


🧱 Tech Stack

Node.js

Express.js

Swagger UI (swagger-jsdoc, swagger-ui-express)


📦 Data Model
{
  "id": 1,
  "description": "Grocery shopping",
  "amount": 520,
  "category": "food",
  "date": "2026-01-05"
}


📌 API Endpoints
Method	Endpoint	Description
GET	/expenses	Get all expenses
GET	/expenses/:id	Get expense by ID
POST	/expenses	Add new expense
PUT	/expenses/:id	Update an expense
DELETE	/expenses/:id	Delete an expense
GET	/expenses/total	Get total of all expenses
GET	/expenses/category/:category	Get expenses by category


🧪 Swagger UI

After running the server, open:

http://localhost:3000/api-docs


Use Swagger UI to test all APIs interactively.


✅ Input Validation Rules

description must be a non-empty string

amount must be a positive number

category must be one of:

food, travel, shopping, entertainment, bills, other


date must be in format:

YYYY-MM-DD


⚠️ Error Handling

The API returns proper HTTP status codes:

200 – Successful GET, PUT, DELETE

201 – Successful creation (POST)

400 – Invalid input or validation failure

404 – Resource or route not found

500 – Internal server error


▶️ How to Run
npm install
node server.js


Then open:

http://localhost:3000/api-docs


🧪 Example POST Request
{
  "description": "Coffee",
  "amount": 50,
  "category": "food",
  "date": "2026-01-07"
}


🏆 What This Project Demonstrates

REST API design

CRUD operations

Input validation

Error handling

Swagger documentation

Backend best practices
