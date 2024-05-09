const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {
  try {
    // Extract JWT token from request cookies
    let jtoken = req.header("Authorization").split(" ");
    let token = jtoken[1];
    // console.log(token);
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

module.exports = Authenticate;
