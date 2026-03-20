//imports
require("dotenv").config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");

//initialisations
const app = express();

//for form values
app.use(express.urlencoded({extended: true}));

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
  console.log(`Members Only app - listening on port ${PORT}!`);
});