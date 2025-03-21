// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// 💡 Ensure the express.json() middleware is used before the routes
app.use(express.json());  // This line should be above route definition

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
app.use(express.urlencoded({ extended: true }));

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const recipeRoutes = require("./routes/recipes.routes");
app.use("/recipes", recipeRoutes);
//const authRoutes = require("./routes/auth.routes");
//app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
