/*
 * app.js
 * Entry point for the Express backend server application, configuring routing, middleware, and CORS.
 */
//imports
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const indexRouter = require("./routes/indexRouter");

//initialisations
const app = express();

const cors = require("cors")

// For request bodies (either form-urlencoded or JSON).
// HTML files can be large, so we increase limits from Express defaults.
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// Enable CORS for frontend origin.
const allowedOrigin = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  })
)

//routing
app.use("/", indexRouter);

// Error handling
app.get("/{*splat}", (req, res) => {
  res.send("Error 404: Not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
// Starts the Express server and begins listening for requests on the specified port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}! From ${process.env.FRONTEND_URL}`);
});