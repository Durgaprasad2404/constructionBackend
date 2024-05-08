const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const authenticate = require("../middleware/authenticate");

// Load the cookie parser middleware
router.use(cookieParser());

// Load database connection and User model
require("../db/connection");
const User = require("../model/userSchema");

// Register route
router.post("/api/register", async (req, res) => {
  // Request body validation
  const { Username, email, password } = req.body;
  if (!Username || !email || !password) {
    return res.status(422).json({ error: "Please fill in all the fields" });
  }

  try {
    // Check if user already exists
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ err: "Email already exists" });
    }

    // Create new user
    const user = new User({ Username, email, password });
    const userdetails = await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Login route
router.post("/api/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ err: "Please fill in all the data" });
    }

    // Find user by email
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      // Compare passwords
      const isMatch = await bcrypt.compare(password, userLogin.password);
      token = await userLogin.generateAuthToken();
      // Set JWT token as a cookie
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      } else {
        return res.json({ message: "User login successful" });
      }
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// User route (protected)
router.get("/api/user", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// Logout route
router.get("/api/logout", (req, res) => {
  try {
    res.clearCookie("jwtoken", { path: "/" });
    res.status(200).send("User logout");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
