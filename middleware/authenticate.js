const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
  try {
    // Extract JWT token from request cookies
    let token = req.cookies.jwtoken;
    // console.log(`"m1:" ${token}`);
    // Verify JWT token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    // Find user with matching token
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    // Handle case where user is not found
    if (!rootUser) {
      throw new Error("User not found");
    }

    // Set token, rootUser, and userID in request object
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    // Call next middleware
    next();
  } catch (err) {
    // Handle unauthorized access
    console.log(err);
    res.status(401).send("Unauthorized");
  }
};

module.exports = authenticate;
