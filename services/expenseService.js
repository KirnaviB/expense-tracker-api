// In-memory data
let expenses = [
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

const VALID_CATEGORIES = ["food", "travel", "shopping", "entertainment", "bills", "other"];

let nextId = Math.max(...expenses.map(e => e.id)) + 1;

function isValidDateFormat(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateStr);
}

// Data functions
exports.getAll = () => expenses;

exports.getById = (id) => expenses.find(e => e.id === id);

exports.create = (data) => {
  const newExpense = { id: nextId++, ...data };
  expenses.push(newExpense);
  return newExpense;
};

exports.update = (id, newData) => {
  const expense = expenses.find(e => e.id === id);
  if (!expense) return null;
  Object.assign(expense, newData);
  return expense;
};

exports.remove = (id) => {
  const index = expenses.findIndex(e => e.id === id);
  if (index === -1) return null;
  return expenses.splice(index, 1)[0];
};

exports.getTotal = () => {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
};

exports.getByCategory = (category) => {
  return expenses.filter(e => e.category === category);
};

// Expose helpers/constants
exports.VALID_CATEGORIES = VALID_CATEGORIES;
exports.isValidDateFormat = isValidDateFormat;
