const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Load environment variables from .env file
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
require("./db/connection");

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware for handling CORS
app.use(
  cors({
    origin: "https://construction-g5o3.onrender.com",
    credentials: true,
  })
);

// Middleware to parse cookies attached to the request
app.use(cookieParser());

// Middleware to parse JSON request bodies (alternative method)
app.use(bodyParser.json());

// Routes
app.use(require("./router/auth"));

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
