const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
app.use(express.json());

// Handle invalid JSON error (e.g., missing quotes, bad format)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON format. Make sure strings are in double quotes and JSON syntax is correct."
    });
  }
  next();
});

const PORT = 3000;

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
  apis: ["./routes/*.js", "./controllers/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Default route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running. Go to /api-docs");
});

// Routes
app.use("/expenses", expenseRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
