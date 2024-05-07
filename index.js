const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3004",
<<<<<<< HEAD
    credentials: true,
=======
    credentials: true
>>>>>>> 0dfd7d5ca594428dff80a3496a552a23df33f0ae
  })
);
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3004");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });
app.use(cookieParser());
app.use(bodyParser.json());

dotenv.config({ path: "./config.env" });

require("./db/connection");
// const User = require("./model/userSchema");

app.use(express.json());
app.use(require("./router/auth"));

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`server runs at port ${PORT}`);
});
