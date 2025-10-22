require('dotenv').config(); // Add this at the top
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const recipesRouter = require("./routes/recipes");
const categoriesRouter = require("./routes/categories");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/recipes", recipesRouter);
app.use("/api/categories", categoriesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});