const Product = require("../models/productModel");
const User = require("../models/userModel");

const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user.cart);
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "Product id is required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);
  const existingItem = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  const updatedUser = await User.findById(req.user._id).populate("cart.product");
  res.status(200).json(updatedUser.cart);
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity === undefined) {
    return res
      .status(400)
      .json({ message: "Product id and quantity required" });
  }

  const user = await User.findById(req.user._id);
  const item = user.cart.find(
    (cartItem) => cartItem.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (quantity <= 0) {
    user.cart = user.cart.filter(
      (cartItem) => cartItem.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  await user.save();
  const updatedUser = await User.findById(req.user._id).populate("cart.product");
  res.status(200).json(updatedUser.cart);
};

const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter(
    (cartItem) => cartItem.product.toString() !== productId
  );

  await user.save();
  const updatedUser = await User.findById(req.user._id).populate("cart.product");
  res.status(200).json(updatedUser.cart);
};

const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.status(200).json([]);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
