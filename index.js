const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(require("./router/auth"));
app.use(
  cors({
    origin: "https://construction-g5o3.onrender.com",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

dotenv.config({ path: "./config.env" });

require("./db/connection");
// const User = require("./model/userSchema");

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`server runs at port ${PORT}`);
});
