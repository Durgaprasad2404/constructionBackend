const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const cookieParse = require("cookie-parser");
const cors = require("cors");

require("../db/connection");
const User = require("../model/userSchema");
router.use(cookieParse());
//register

router.post("/register", async (req, res) => {
  const { Username, email, password } = req.body;
  if (!Username || !email || !password) {
    return res.status(422).json({ error: "fill the field" });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ err: "email already exist" });
    }

    const user = new User({ Username, email, password });

    const userdetails = await user.save();

    res.status(201).json({ message: "registered successfully" });
    res.send("dp you did");
  } catch {
    (err) => {
      console.log(err);
    };
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ err: "plz fill the data" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      token = await userLogin.generateAuthToken();
      // console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ message: "Invalid password" });
      } else {
        res.json({ message: "user login successfully" });
      }
    } else {
      res.status(400).json({ message: "Invaild crediential" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/user", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("USER LOGOUT");
});

module.exports = router;
