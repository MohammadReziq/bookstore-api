const express = require("express");
require("dotenv").config();
const booksPath = require("./routes/books");
const authorsPath = require("./routes/authors");
const authPath = require("./routes/auth");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errors");
const usersPath = require("./routes/users");
const connectToDB = require("./config/db");
// connectio nto datbase
connectToDB();
const app = express();
app.use(express.json());

app.use(logger);
// books api=
app.use("/api/books", booksPath);
// authors api
app.use("/api/authors", authorsPath);
app.use("/api/auth", authPath);
app.use("/api/users", usersPath);
// Error handlign middlw erro:
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`serer sis runnig in ${process.env.NODE_ENV} on  port ${PORT}`);
});
