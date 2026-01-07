const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

/**
 * @swagger
 * components:
 *   schemas:
 *     ExpenseInput:
 *       type: object
 *       required:
 *         - description
 *         - amount
 *         - category
 *         - date
 *       properties:
 *         description:
 *           type: string
 *           example: "Coffee"
 *         amount:
 *           type: number
 *           example: 50
 *         category:
 *           type: string
 *           example: "food"
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
router.get("/", expenseController.getAll);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseInput'
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Invalid input
 */
router.post("/", expenseController.create);

/**
 * @swagger
 * /expenses/total:
 *   get:
 *     summary: Get total expense amount
 *     responses:
 *       200:
 *         description: Total amount
 */
router.get("/total", expenseController.getTotal);

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
router.get("/category/:category", expenseController.getByCategory);

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
router.get("/:id", expenseController.getById);

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
 *             $ref: '#/components/schemas/ExpenseInput'
 *     responses:
 *       200:
 *         description: Expense updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Expense not found
 */
router.put("/:id", expenseController.update);

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
router.delete("/:id", expenseController.remove);

module.exports = router;
