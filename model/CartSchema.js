const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [],
});
const Cart = mongoose.model("CART", CartSchema);
module.exports = Cart;
