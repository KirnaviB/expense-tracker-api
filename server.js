const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

const PORT = 3000;

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

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get all expenses
 *     responses:
 *       200:
 *         description: List of all expenses
 */
app.get("/expenses", (req, res) => {
  res.json(expenses);
});

/**
 * @swagger
 * /expenses/total:
 *   get:
 *     summary: Get total amount of all expenses
 *     responses:
 *       200:
 *         description: Total expense amount
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
 *         description: Expenses filtered by category
 */
app.get("/expenses/category/:category", (req, res) => {
  const category = req.params.category;
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
    return res.status(404).json({ message: "Expense not found" });
  }

  res.json(expense);
});

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
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Movie ticket
 *               amount:
 *                 type: number
 *                 example: 300
 *               category:
 *                 type: string
 *                 example: entertainment
 *               date:
 *                 type: string
 *                 example: 2026-01-06
 *     responses:
 *       201:
 *         description: Expense created
 */
app.post("/expenses", (req, res) => {
  const maxId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) : 0;

  const newExpense = {
    id: maxId + 1,
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
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
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense updated
 *       404:
 *         description: Expense not found
 */
app.put("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  if (req.body.description) expense.description = req.body.description;
  if (req.body.amount) expense.amount = req.body.amount;
  if (req.body.category) expense.category = req.body.category;
  if (req.body.date) expense.date = req.body.date;

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
    return res.status(404).json({ message: "Expense not found" });
  }

  const deleted = expenses.splice(index, 1);
  res.json({ message: "Expense deleted", deleted: deleted[0] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
