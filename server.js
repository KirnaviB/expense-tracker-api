const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

function isValidDateFormat(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  return regex.test(dateStr);
}

const app = express();
app.use(express.json());

const PORT = 3000;

// Allowed categories
const VALID_CATEGORIES = ["food", "travel", "shopping", "entertainment", "bills", "other"];

// In-memory data
const expenses = [
  {
    id: 1,
    description: "Grocery shopping",
    amount: 520,
    category: "food",
    date: "2026-01-05"
  },
  {
    id: 2,
    description: "Bus ticket",
    amount: 20,
    category: "travel",
    date: "2026-01-06"
  }
];

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Expense Tracker API",
      version: "1.0.0",
      description: "API for tracking personal expenses"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running. Go to /api-docs for Swagger UI.");
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense Input:
 *       type: object
 *       required:
 *         - description
 *         - amount
 *         - category
 *         - date
 *       properties:
 *         description:
 *           type: string
 *           example: ""
 *         amount:
 *           type: number
 *           example: 0
 *         category:
 *           type: string
 *           example: ""
 *         date:
 *           type: string
 *           example: "2026-01-07"
 */

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses
 *     responses:
 *       200:
 *         description: List of expenses
 */

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Add a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense Input'
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Invalid input
 */

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.post("/expenses", (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        error: "description, amount, category, and date are required"
      });
    }

    // Validate description
    if (typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({
       error: "Description must be a non-empty string"
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        error: "Amount must be a positive number"
      });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: "Invalid category. Allowed: " + VALID_CATEGORIES.join(", ")
      });
    }

    if (!isValidDateFormat(date)) {
      return res.status(400).json({
       error: "Date must be in YYYY-MM-DD format"
       });
    }

    const maxId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) : 0;

    const newExpense = {
      id: maxId + 1,
      description,
      amount,
      category,
      date
    };

    expenses.push(newExpense);
    res.status(201).json(newExpense);

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /expenses/total:
 *   get:
 *     summary: Get total amount of all expenses
 *     responses:
 *       200:
 *         description: Total sum
 */

app.get("/expenses/total", (req, res) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  res.json({ total });
});

/**
 * @swagger
 * /expenses/category/{category}:
 *   get:
 *     summary: Get expenses by category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered expenses
 *       400:
 *         description: Invalid category
 */

app.get("/expenses/category/:category", (req, res) => {
  const category = req.params.category;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: "Invalid category. Allowed: " + VALID_CATEGORIES.join(", ")
    });
  }

  const filtered = expenses.filter(e => e.category === category);
  res.json(filtered);
});


/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Get expense by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense found
 *       404:
 *         description: Expense not found
 */

app.get("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json(expense);
});

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense Input'
 *     responses:
 *       200:
 *         description: Expense updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Expense not found
 */

app.put("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  const { description, amount, category, date } = req.body;

  if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      error: "Invalid category. Allowed: " + VALID_CATEGORIES.join(", ")
    });
  }

  if (description !== undefined) expense.description = description;
  if (amount !== undefined) expense.amount = amount;
  if (category !== undefined) expense.category = category;
  if (date !== undefined) expense.date = date;

  res.json(expense);
});

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense deleted
 *       404:
 *         description: Expense not found
 */

app.delete("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = expenses.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Expense not found" });
  }

  const deleted = expenses.splice(index, 1);
  res.json({ message: "Expense deleted", deleted: deleted[0] });
});


// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
