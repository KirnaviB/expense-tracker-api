const expenseService = require("../services/expenseService");

// GET /expenses
exports.getAll = (req, res) => {
  res.json(expenseService.getAll());
};

// GET /expenses/:id
exports.getById = (req, res) => {
  const id = parseInt(req.params.id);
  const expense = expenseService.getById(id);

  if (!expense) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json(expense);
};

// POST /expenses
exports.create = (req, res) => {
  const { description, amount, category, date } = req.body;
  const { VALID_CATEGORIES, isValidDateFormat } = expenseService;

  if (
    typeof description !== "string" || description.trim() === "" ||
    typeof amount !== "number" || amount <= 0 ||
    typeof category !== "string" || !VALID_CATEGORIES.includes(category) ||
    typeof date !== "string" || !isValidDateFormat(date)
  ) {
    return res.status(400).json({
      error: "Invalid input. Check description, amount, category, and date format (YYYY-MM-DD)."
    });
  }

  const newExpense = expenseService.create({ description, amount, category, date });
  res.status(201).json(newExpense);
};

// PUT /expenses/:id
exports.update = (req, res) => {
  const id = parseInt(req.params.id);
  const { description, amount, category, date } = req.body;
  const { VALID_CATEGORIES, isValidDateFormat } = expenseService;

  const updateData = {};

  if (description !== undefined) {
    if (typeof description !== "string" || description.trim() === "") {
      return res.status(400).json({ error: "Description must be a non-empty string" });
    }
    updateData.description = description;
  }

  if (amount !== undefined) {
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }
    updateData.amount = amount;
  }

  if (category !== undefined) {
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    updateData.category = category;
  }

  if (date !== undefined) {
    if (!isValidDateFormat(date)) {
      return res.status(400).json({ error: "Date must be in YYYY-MM-DD format" });
    }
    updateData.date = date;
  }

  const updated = expenseService.update(id, updateData);

  if (!updated) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json(updated);
};

// DELETE /expenses/:id
exports.remove = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = expenseService.remove(id);

  if (!deleted) {
    return res.status(404).json({ error: "Expense not found" });
  }

  res.json({ message: "Expense deleted", deleted });
};

// GET /expenses/total
exports.getTotal = (req, res) => {
  res.json({ total: expenseService.getTotal() });
};

// GET /expenses/category/:category
exports.getByCategory = (req, res) => {
  const category = req.params.category;
  const { VALID_CATEGORIES } = expenseService;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  res.json(expenseService.getByCategory(category));
};
