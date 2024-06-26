const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Authenticate = require("../middleware/authenticate");

// Load the cookie parser middleware
router.use(cookieParser());

// Load database connection and User model
require("../db/connection");
const User = require("../model/userSchema");
const Cart = require("../model/CartSchema");

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all the data" });
    }

    // Find user by email
    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate token
    const token = await userLogin.generateAuthToken();
    // console.log(`token:${token}`);
    // Set JWT token as a cookie
    // res.cookie("jwtoken", token, {
    //   expires: new Date(Date.now() + 25892000000),
    //   httpOnly: true,
    //   sameSite: "lax", // Set SameSite attribute
    //   secure: true,
    // });

    // Send token in response
    res.json({ token, message: "User login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// User route (protected)
router.get("/api/user", Authenticate, (req, res) => {
  res.send(req.rootUser);
});
router.post("/api/addtoCart", Authenticate, async (req, res) => {
  const { id, itemname, imgUrl, price } = req.body.item;
  try {
    // Find or create a cart for the user
    let cart = await Cart.findOne({ user: req.userID });
    if (!cart) {
      cart = new Cart({ user: req.userID, items: [] });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex((item) => item.productId === id);
    // console.log(itemIndex);
    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in the cart, add it
      const newItem = {
        productId: id,
        productName: itemname,
        price: price,
        productImg: imgUrl,
        quantity: quantity,
      };
      cart.items.push(newItem);
      console.log(cart);
    }
    // Save the cart
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
// Logout route
// router.get("/api/logout", (req, res) => {
//   try {
//     res.clearCookie("jwtoken", { path: "/" });
//     res.status(200).send("User logout");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
