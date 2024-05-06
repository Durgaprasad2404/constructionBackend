const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors')

const app = express();
app.use(cors({
  origin:'*'
}))
app.use(cookieParser());

dotenv.config({ path: "./config.env" });

require("./db/connection");
// const User = require("./model/userSchema");

app.use(express.json());
app.use(require("./router/auth"));

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`server runs at port ${PORT}`);
});
