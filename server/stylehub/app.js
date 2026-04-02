//imports
require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");

//initialisations
const app = express();

// For request bodies (either form-urlencoded or JSON).
// HTML files can be large, so we increase limits from Express defaults.
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));

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
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});